import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import moment from 'moment';
import { fetchAdsBlocks, loadMoreAdsBlocks } from '../../../actions/adsModule';
import { MOBILE_VERSION } from '../../../actions/app';
import Groups from './Groups';
import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
  DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK
} from '../../../constants';

import {
  fetchGroupsWithStore,
  clearGroups,
  loadMoreGroupsUsingStore,
} from '../../../actions/groups';
import {audience} from "../../../helpers/sideBarAudience";

class GroupsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      distance: 50,
      latitude: null,
      longitude: null,
      since: 'not-null',
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
    this.geolocationIsAllowed = this.geolocationIsAllowed.bind(this);
    this.golocationIsNotAllowed = this.golocationIsNotAllowed.bind(this);
    this.onSetDefaultLocation = this.onSetDefaultLocation.bind(this);

  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(
      clearGroups()
    );
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
    } = this.props;

    const {
      navigation: nextNavigation
    } = nextProps;

    const {
      latitude,
      longitude,
      distance,
      since,
    } = this.state;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchGroupsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            __GET: {
              lat: latitude,
              long: longitude,
              range: distance,
              since,
              audience: audience(nextNavigation),
            },
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchGroupsListFetcher instanceof Promise) {
      this.fetchGroupsListFetcher.cancel();
    }

    if (this.currentPositionGetter instanceof Promise) {
      this.currentPositionGetter.cancel();
    }
  }

  geolocationIsAllowed({coords: {latitude, longitude}}) {
    this.setState({
        latitude,
        longitude,
      }, () => {
        this.fetchGroupsList();
      }
    );
  }

  getLocationUsingIp() {
    const { userLocationInfo } = this.props;

    if (userLocationInfo) {
      this.setState({
        latitude: userLocationInfo.lat,
        longitude: userLocationInfo.lon
      }, () => this.fetchGroupsList())
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
          this.fetchGroupsList();
        });
      } else {
        this.getLocationUsingIp()
      }
    } else {
      this.getLocationUsingIp()
    }
  }

  fetchGroupsList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
      since,
    } = this.state;

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(
        accessToken,
        {
          navigation,
          __GET: {
            lat: latitude,
            long: longitude,
            range: distance,
            since,
            audience: audience(navigation),
          },
        },
      )
    );

    this.fetchGroupsListFetcher
      .finally(() => {
        if ( ! this.fetchGroupsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      })
  }

  loadMore(groupIndex = 0) {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      groupsList
    } = this.props;

    const {
      latitude,
      longitude,
      distance,
      since,
    } = this.state;

    if ( ! loadingMore) {
      dispatch(
        loadMoreGroupsUsingStore(
          accessToken,
          {
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: groupsList.length,
              lat: latitude,
              long: longitude,
              range: distance,
              since,
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
      groupsList,
    } = this.props;

    const {
      isLoaded,
      latitude,
      longitude,
      distance,
      since,
    } = this.state;

    return (
      <Groups
        isFetching={isFetching}
        isLoaded={isLoaded}
        groups={groupsList}
        groupsHasSince={since}
        showItemOwnerDetails={true}
        onLoadMore={this.loadMore}
        showLoadMore={couldLoadMore}
        loadingMore={loadingMore}
        distance={distance}
        longitude={longitude}
        latitude={latitude}
        onSetDefaultLocation={this.onSetDefaultLocation}
        location={location => {
          this.setState({
            latitude: location.latitude,
            longitude: location.longitude,
          }, () => {
            this.fetchGroupsList();
          })
        }}

        onGroupsSinceChange={since =>
          this.setState({
            since,
          }, () => {
            this.fetchGroupsList()
          })
        }

        changeDistanceRange={distance =>
          this.setState({
            distance,
          }, () => {
            this.fetchGroupsList();
          })
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    isFetching: state.groups.isFetching,
    loadingMore: state.groups.loadingMore,
    couldLoadMore: state.groups.couldLoadMore,
    groupsList: state.groups.list,
    userLocation: !!state.user.locations ? state.user.locations : false,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    userInfo: state.app.userInfoFetched,
    userLocationInfo: state.app.userDetails
  };
}

export default connect(mapStateToProps)(GroupsContainer);
