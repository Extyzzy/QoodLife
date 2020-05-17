import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import moment from 'moment';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./EventsList.scss";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import EventsListItem from "../../../../../pages/_events/Events/components/ListItem";
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";

import {
  clearEvents,
  clearHobbiesEvents,
  fetchEventsWithStore,
  loadMoreEventsUsingStore,
  fetchEventsHobbiesUser,
} from "../../../../../actions/events";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {FILTER_OWNED} from "../../../../../helpers/filter";

class EventsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(
      clearEvents()
    );
  }

  componentDidMount() {
    this.fetchEventsList();
    this.fetchEventsHobbies();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
      ownerID,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if (!isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
            __GET: {
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              user: ownerID,
              role: 'place',
            },
          }
        )
      );
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(
      clearHobbiesEvents()
    );

    if (this.fetchEventsListFetcher instanceof Promise) {
      this.fetchEventsListFetcher.cancel();
    }
  }

  fetchEventsHobbies() {
    const {
      dispatch,
      ownerID
    } = this.props;

    dispatch(
      fetchEventsHobbiesUser(
        {
          __GET: {
            user: ownerID,
            role: 'place',
          },
        },
        ownerID,
      )
    );
  }

  fetchEventsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      ownerID,
    } = this.props;

    this.fetchEventsListFetcher = dispatch(
      fetchEventsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            user: ownerID,
            role: 'place',
          },
        }
      )
    );

    this.fetchEventsListFetcher
      .finally(() => {
        if ( ! this.fetchEventsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }

  /**
   * Function to be triggered on ListItem componentWillUnmount
   * to cancel fetcher Promise if is still fetching.
   *
   * @param _this Reference to EventsListItem
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      eventsList,
      ownerID,
    } = this.props;


    if ( ! loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: eventsList.length,
              user: ownerID,
              role: 'place',
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isMobile,
      isFetching,
      loadingMore,
      couldLoadMore,
      eventsList,
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const { isLoaded } = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!eventsList && !!eventsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  {...settingsForListitem}
                >
                  {
                    eventsList.map(item => {
                      return (
                        <div key={`${item.key}_${item.id}`}>
                          <EventsListItem
                            data={item}
                            className={s.listItem}
                            viewMode="icons"
                          />
                        </div>
                      );
                    })
                  }
                </Slider>
              )) || (
                <ComponentsList
                  list={eventsList}
                  component={EventsListItem}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  showOwnerDetails={false}
                  actionButtons={
                    this.listItemActionButtons
                  }
                />
              )
            )) || I18n.t('events.eventsNotFound')
          )
        }

        {
          couldLoadMore && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {
                  loadingMore
                    ? I18n.t('general.elements.loading')
                    : I18n.t('general.elements.loadMore')
                }
              </button>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    isFetching: state.events.isFetching,
    loadingMore: state.events.loadingMore,
    couldLoadMore: state.events.couldLoadMore,
    eventsList: state.events.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EventsList)));
