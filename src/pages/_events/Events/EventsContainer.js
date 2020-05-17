import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';
import moment from 'moment';
import Events from './Events';
import { fetchAdsBlocks, loadMoreAdsBlocks } from '../../../actions/adsModule';
import { MOBILE_VERSION } from '../../../actions/app';
import { SIDEBAR_GROUP_RELATED } from '../../../actions/navigation';
import { audience } from '../../../helpers/sideBarAudience';
import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
  DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK
} from '../../../constants';

import {
  fetchEventsWithStore,
  clearEvents,
  loadMoreEventsUsingStore,
} from '../../../actions/events';

class EventsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      intervalWasChanged: false,
      viewMode: 'list',
      since: null,
      until: null,
      distance: 50,
      latitude: null,
      longitude: null,
      label: null,
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
      clearEvents()
    );
  }

  componentDidMount() {
    const { location, dispatch, UIVersion } = this.props;

    if(location.state){
      this.fetchEventsList(location.state)
    } else {
      navigator.geolocation.getCurrentPosition(
        this.geolocationIsAllowed,
        this.golocationIsNotAllowed
      );
    }

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
      until
    } = this.state;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            __GET: {
              lat: latitude,
              long: longitude,
              range: distance,
              since: {
                until: until,
              },
              until: {
                since: since,
              },
              audience: audience(nextNavigation),
            },
          },
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchEventsListFetcher instanceof Promise) {
      this.fetchEventsListFetcher.cancel();
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
        this.fetchEventsList()
      }
    );
  }

  getLocationUsingIp() {
    const { userLocationInfo } = this.props;
    if (userLocationInfo) { 
      this.setState({
        latitude: userLocationInfo.lat,
        longitude: userLocationInfo.lon
      }, () => this.fetchEventsList())
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
          this.fetchEventsList()
        });
      } else {
        this.getLocationUsingIp()
      }
    } else {
      this.getLocationUsingIp()
    }
  }

  fetchEventsList(dayInterval = false) {
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
      until,
    } = this.state;

    if(dayInterval){
      this.fetchEventsListFetcher = dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            navigation: {
              sidebarOpenedGroup: SIDEBAR_GROUP_RELATED,
            },
            __GET: {
              expired: 1,
              since: {
                until: dayInterval.until,
              },
              until: {
                since: dayInterval.since,
              },
              take: 'ALL',
              calendar: 'true',
            },
          },
          {
            going: true
          },
        )
      );
    } else {
      this.fetchEventsListFetcher = dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            navigation,
            __GET: {
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              lat: latitude,
              long: longitude,
              range: distance,
              since: {
                until: until,
              },
              until: {
                since: since,
              },
              audience: audience(navigation),
            },
          },
        )
      );
    }

    this.fetchEventsListFetcher
      .finally(() => {
        if ( ! this.fetchEventsListFetcher.isCancelled()) {
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
      eventsList
    } = this.props;

    const {
      since,
      until,
      latitude,
      longitude,
      distance,
    } = this.state;

    if ( ! loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(
          accessToken,
          {
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: eventsList.length,
              since: {
                until: until,
              },
              until: {
                since: since,
              },
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
      eventsList,
    } = this.props;

    const {
      isLoaded,
      viewMode,
      latitude,
      longitude,
      distance,
      since,
      until,
      intervalWasChanged
    } = this.state;

    return (
      <Events
        isFetching={isFetching}
        isLoaded={isLoaded}
        events={eventsList}
        distance={distance}
        intervalValue={{since, until}}
        showItemOwnerDetails={true}
        onChangeViewMode={vm => {
          if (vm !== viewMode) {
            this.setState({
              viewMode: vm,
            });
          }
        }}
        viewMode={viewMode}
        onLoadMore={this.loadMore}
        showLoadMore={couldLoadMore}
        loadingMore={loadingMore}
        longitude={longitude}
        latitude={latitude}
        filterIntervalSince={this.state.since}
        intervalWasChanged={intervalWasChanged}
        onSetDefaultLocation={this.onSetDefaultLocation}
        changeDistanceRange={distance => {
          this.setState({
            distance
          }, () => {
            this.fetchEventsList()
          })
        }}
        setDateInterval={(interval) => {
          this.setState({
            since: interval? interval.since : null,
            until: interval? interval.until : null,
            intervalWasChanged: false,
          }, () => this.fetchEventsList(interval))
        }}
        location={location => {
          this.setState({
            latitude: location.latitude,
            longitude: location.longitude,
          }, () => {
            this.fetchEventsList()
          })
        }}
        interval={(since, until) => {
          this.setState({
            since,
            until,
            intervalWasChanged: true
          }, () => {
            this.fetchEventsList()
          })
        }}
      />
    );
  }
}

function mapStateToProps(state) {

  return {
    UIVersion: state.app.UIVersion,
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    isFetching: state.events.isFetching,
    loadingMore: state.events.loadingMore,
    couldLoadMore: state.events.couldLoadMore,
    eventsList: state.events.list,
    userLocation: !!state.user.locations? state.user.locations : false,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    userLocationInfo: state.app.userDetails
  };
}

export default withRouter(connect(mapStateToProps)(EventsContainer));
