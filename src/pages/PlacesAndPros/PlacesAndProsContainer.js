import React, { Component } from 'react';
import moment from "moment/moment";
import PlacesAndPros from './PlacesAndPros'
import { connect } from 'react-redux';
import { isEqual } from "lodash";
import { fetchAdsBlocks, loadMoreAdsBlocks } from '../../actions/adsModule';
import {audience} from "../../helpers/sideBarAudience";
import { MOBILE_VERSION } from '../../actions/app';
import { DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK } from '../../constants';
import {
  clearPlaces,
  fetchPlacesWithStore,
  loadMorePlacesUsingStore,
  switchPlacesActiveStatus
} from "../../actions/places";

import {
  clearProfessionals,
  fetchProfessionalsWithStore,
  loadMoreProfessionalsUsingStore,
  switchProsActiveStatus,
} from "../../actions/professionals";

class PlacesAndProsContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoadedPros: false,
      isLoadedPlaces: false,
      distance: 50,
      latitude: null,
      longitude: null,
      viewMode: 'icons',
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMorePros = this.loadMorePros.bind(this);
    this.loadMorePlaces = this.loadMorePlaces.bind(this);
    this.geolocationIsAllowed = this.geolocationIsAllowed.bind(this);
    this.golocationIsNotAllowed = this.golocationIsNotAllowed.bind(this);
    this.onSetDefaultLocation = this.onSetDefaultLocation.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(clearProfessionals());
    dispatch(clearPlaces());
    dispatch(switchPlacesActiveStatus(true));
    dispatch(switchProsActiveStatus(true));
  }

  componentDidMount() {
    const { dispatch, UIVersion } = this.props;

    navigator.geolocation.getCurrentPosition(
      this.geolocationIsAllowed,
      this.golocationIsNotAllowed
    );

    if(UIVersion === MOBILE_VERSION) {
      dispatch(
        fetchAdsBlocks()
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
      selectedPlaceTitle,
      selectedProsTitle,
      placesAreActive,
      professionalsAreActive,
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
    } = this.state;

    const {
      navigation: nextNavigation,
      placesAreActive: nextPlacesAreActive,
      professionalsAreActive: nextProfessionalsAreActive,
      selectedPlaceTitle: nextSelectedPlaceTitle,
      selectedProsTitle: nextSelectedProsTitle,
    } = nextProps;

    const prosNavigation = {
      ...nextNavigation,
      selectedTitle: nextSelectedProsTitle
    };

    const placeNavigation = {
      ...nextNavigation,
      selectedTitle: nextSelectedPlaceTitle
    };

    if (!isEqual(placesAreActive, nextPlacesAreActive)){
      if(!nextPlacesAreActive){
        dispatch(clearPlaces());
        dispatch(
          fetchProfessionalsWithStore(
            accessToken,
            {
              navigation: prosNavigation,
              __GET: {
                take: 6,
                lat: latitude,
                long: longitude,
                range: distance,
                audience: audience(nextNavigation),
              },
            }
          ),
        );
      }
    }

    if (!isEqual(professionalsAreActive, nextProfessionalsAreActive)){
      if(!nextProfessionalsAreActive){
        dispatch(clearProfessionals());
        dispatch(
          fetchPlacesWithStore(
            accessToken,
            {
              navigation: placeNavigation,
              __GET: {
                take: 6,
                lat: latitude,
                long: longitude,
                range: distance,
                audience: audience(nextNavigation),
              },
            }
          )
        );
      }
    }

    if (!isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchProfessionalsWithStore(
          accessToken,
          {
            navigation: prosNavigation,
            __GET: {
              take: 6,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(nextNavigation),
            },
          }
        ),
      );

      dispatch(
        fetchPlacesWithStore(
          accessToken,
          {
            navigation: placeNavigation,
            __GET: {
              take: 6,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(nextNavigation),
            },
          }
        )
      );
    }

    if(!isEqual(selectedPlaceTitle, nextSelectedPlaceTitle)){
      dispatch(
        fetchPlacesWithStore(
          accessToken,
          {
            navigation: placeNavigation,
            __GET: {
              take: 6,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(nextNavigation),
            },
          }
        )
      );
    }

    if(!isEqual(selectedProsTitle, nextSelectedProsTitle)){
      dispatch(
        fetchProfessionalsWithStore(
          accessToken,
          {
            navigation: prosNavigation,
            __GET: {
              take: 6,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(nextNavigation),
            },
          }
        ),
      );
    }
  }

  componentWillUnmount() {
    if (this.currentPositionGetter instanceof Promise) {
      this.currentPositionGetter.cancel();
    }

    if (this.fetchProfessionalsListFetcher instanceof Promise) {
      this.fetchProfessionalsListFetcher.cancel();
    }

    if (this.fetchPlacesListFetcher instanceof Promise) {
      this.fetchPlacesListFetcher.cancel();
    }
  }

  geolocationIsAllowed({coords: {latitude, longitude}}) {
    this.setState({
        latitude,
        longitude,
      }, () => {
        this.fetchProfessionalsList();
        this.fetchPlacesList();
      }
    );
  }

  getLocationUsingIp() {
    const { userLocationInfo } = this.props;

    if (userLocationInfo) { 
      this.setState({
        latitude: userLocationInfo.lat,
        longitude: userLocationInfo.lon
      }, () => {
        this.fetchProfessionalsList();
        this.fetchPlacesList();
      })
    }
  }

  onSetDefaultLocation() {
    this.setState({
      label: null
    }, () => this.golocationIsNotAllowed());
  }

  golocationIsNotAllowed() {
    const { userLocation, isAuthenticated } = this.props;

    if(isAuthenticated){
      const [ defaultLocation ] = userLocation;
      if(defaultLocation){
        this.setState({
          latitude: defaultLocation.latitude,
          longitude: defaultLocation.longitude
        }, () => {
          this.fetchProfessionalsList();
          this.fetchPlacesList();
        });
      } else {
        this.getLocationUsingIp()
      }
    } else {
      this.getLocationUsingIp()
    }
  }

  fetchPlacesList() {
    const {
      dispatch,
      accessToken,
      navigation,
      selectedPlaceTitle,
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
    } = this.state;

    const placeNavigation = {
      ...navigation,
      selectedTitle: selectedPlaceTitle
    };

    this.fetchPlacesListFetcher = dispatch(
      fetchPlacesWithStore(
        accessToken,
        {
          navigation: placeNavigation,
          __GET: {
            take: 6,
            lat: latitude,
            long: longitude,
            range: distance,
            audience: audience(navigation),
          },
        }
      )
    );

    this.fetchPlacesListFetcher
      .finally(() => {
        if ( ! this.fetchPlacesListFetcher.isCancelled()) {
          this.setState({
            isLoadedPlaces: true,
          });
        }
      })
  }

  fetchProfessionalsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      selectedProsTitle,
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
    } = this.state;

    const prosNavigation = {
      ...navigation,
      selectedTitle: selectedProsTitle
    };

    this.fetchProfessionalsListFetcher = dispatch(
      fetchProfessionalsWithStore(
        accessToken,
        {
          navigation: prosNavigation,
          __GET: {
            take: 6,
            lat: latitude,
            long: longitude,
            range: distance,
            audience: audience(navigation),
          },
        }
      )
    );

    this.fetchProfessionalsListFetcher
    .finally(() => {
      if ( ! this.fetchProfessionalsListFetcher.isCancelled()) {
        this.setState({
            isLoadedPros: true,
        });
      }
    })
  }

  loadMorePlaces(groupIndex = 0) {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      placesList
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
    } = this.state;

    if ( ! loadingMore) {
      dispatch(
        loadMorePlacesUsingStore(
          accessToken,
          {
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: 6,
              skip: placesList.length,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(navigation),
            },
          }
        )
      );

      dispatch(
        loadMoreAdsBlocks(
          {
            navigation,
            __GET: {
              take: DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK,
              skip: groupIndex*3,
            },
          }
        )
      );
    }
  }

  loadMorePros(groupIndex = 0) {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      professionalsList
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
    } = this.state;

    if ( ! loadingMore) {
      dispatch(
        loadMoreProfessionalsUsingStore(
          accessToken,
          {
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: 6,
              skip: professionalsList.length,
              lat: latitude,
              long: longitude,
              range: distance,
              audience: audience(navigation),
            },
          }
        )
      );

      dispatch(
        loadMoreAdsBlocks(
          {
            navigation,
            __GET: {
              take: DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK,
              skip: groupIndex*3,
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      professionalsList,
      placesList,
      UIVersion,
      isAuthenticated,
      placesAreActive,
      professionalsAreActive,
      couldLoadMorePlaces,
      loadingMorePlaces,
    } = this.props;

    const {
      isLoadedPros,
      isLoadedPlaces,
      latitude,
      longitude,
      distance,
      viewMode,
    } = this.state;

    return (
      <PlacesAndPros
        loadingMorePlaces={loadingMorePlaces}
        couldLoadMorePlaces={couldLoadMorePlaces}
        isLoadedPros={isLoadedPros}
        isLoadedPlaces={isLoadedPlaces}
        placesAreActive={placesAreActive}
        professionalsAreActive={professionalsAreActive}
        latitude={latitude}
        longitude={longitude}
        distance={distance}
        viewMode={viewMode}
        isFetching={isFetching}
        loadingMore={loadingMore}
        couldLoadMore={couldLoadMore}
        professionalsList={professionalsList}
        placesList={placesList}
        UIVersion={UIVersion}
        isAuthenticated={isAuthenticated}
        loadMorePros={this.loadMorePros}
        loadMorePlaces={this.loadMorePlaces}
        onSetDefaultLocation={this.onSetDefaultLocation}
        onChangeViewModeSwitcher={vm => {
          if (vm !== viewMode) {
            this.setState({
              viewMode: vm,
            });
          }
        }}
        getLocation={location => {
          this.setState({
            latitude: location.latitude,
            longitude: location.longitude,
          }, () => {
            this.fetchProfessionalsList();
            this.fetchPlacesList();
          })
        }}
        changeDistanceRange={distance => {
          this.setState({
            distance
          }, () => {
            this.fetchProfessionalsList();
            this.fetchPlacesList();
          })
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    placesAreActive: state.places.active,
    professionalsAreActive: state.professionals.active,
    isAuthenticated: state.auth.isAuthenticated,
    UIVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    isFetching: state.professionals.isFetching,
    loadingMore: state.professionals.loadingMore,
    couldLoadMore: state.professionals.couldLoadMore,
    professionalsList: state.professionals.list,
    placesList: state.places.list,
    couldLoadMorePlaces: state.places.couldLoadMore,
    loadingMorePlaces: state.places.loadingMore,
    userLocation: !!state.user.locations ? state.user.locations : false,
    selectedPlaceTitle: state.navigation.selectedPlaceTitle,
    selectedProsTitle: state.navigation.selectedProsTitle,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    userInfo: state.app.userInfoFetched,
    userLocationInfo: state.app.userDetails
  };
}

export default connect(mapStateToProps)(PlacesAndProsContainer);
