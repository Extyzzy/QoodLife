import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./EventsList.scss";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import EventsListItem from "../../../../../pages/_events/Events/components/ListItem";
import { FILTER_FAVORITE } from '../../../../../helpers/filter';
import { confirm } from '../../../../../components/_popup/Confirm';

import {
  clearEvents,
  fetchEventsWithStore,
  removeEventFromList,
  loadMoreEventsUsingStore,
  notGoingToEvent,
} from "../../../../../actions/events";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {I18n} from "react-redux-i18n";

class EventsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);

    this.listItemActionButtons = this.listItemActionButtons.bind(this);
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
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            group: FILTER_FAVORITE,
            navigation: nextNavigation,
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchEventsListFetcher instanceof Promise) {
      this.fetchEventsListFetcher.cancel();
    }
  }

  fetchEventsList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    this.fetchEventsListFetcher = dispatch(
      fetchEventsWithStore(
        accessToken,
        {
          group: FILTER_FAVORITE,
          navigation,
          take: DEFAULT_NOF_RECORDS_PER_PAGE,
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
   * @param _this Reference to PostsListItem
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFromFavoritesFetcher instanceof Promise) {
      _this.removeFromFavoritesFetcher.cancel();
    }
  }

  /**
   * Define ListItem action buttons array.
   *
   * @param _this Reference to PostsListItem
   * @returns {{removeFromFavorites: XML}}
   * @returns {[XML]}
   */
  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken
    } = this.props;

    const {
      isRemovingFromFavorites,
    } = _this.state;

    const {
      id: eventId,
    } = _this.props.data;

    return [
      <button
        key="RemoveFromFavorites"
        className='round-button remove'
        onClick={() => {
          if (!isRemovingFromFavorites) {
            confirm(I18n.t('general.components.confirmFavorite'))
              .then(() => {
                _this.setState({
                  isRemovingFromFavorites: true,
                }, () => {
                  _this.removeFromFavoritesFetcher = dispatch(
                    notGoingToEvent(
                      accessToken,
                      eventId
                    )
                  );

                  _this.removeFromFavoritesFetcher
                    .then(() => {
                      _this.setState({
                        isRemovingFromFavorites: false,
                      }, () => {
                        dispatch(
                          removeEventFromList(eventId)
                        );
                      });
                    });
                });
              });
          }
        }}
      />,
    ];
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      eventsList,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: eventsList.length,
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

    if (isFetching) {
      return (
        <Loader sm contrast />
      );
    }

    const { isLoaded } = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!eventsList && !!eventsList.length && (
              <ComponentsList
                list={eventsList}
                component={EventsListItem}
                onComponentWillUnmount={
                  this.onListItemComponentWillUnmount
                }
                actionButtons={
                  this.listItemActionButtons
                }
                popupActionButtons={() => []}
              />
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
                  loadingMore ?
                  I18n.t('general.elements.loading') :
                  I18n.t('general.elements.loadMore')
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
    isFetching: state.posts.isFetching,
    loadingMore: state.posts.loadingMore,
    couldLoadMore: state.posts.couldLoadMore,
    eventsList: state.events.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default connect(mapStateToProps)(withStyles(s)(EventsList));
