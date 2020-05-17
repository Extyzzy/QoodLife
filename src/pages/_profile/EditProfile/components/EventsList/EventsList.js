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
import CreateEventButton from '../../../../_events/Events/components/CreateEventButton';
import { settingsForListitem } from "../../../../../components/_carousel/SliderSettingsMobile";
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { withRouter } from 'react-router';
import {FILTER_OWNED} from "../../../../../helpers/filter";
import {I18n} from 'react-redux-i18n';
import {
  clearEvents,
  fetchEventsWithStore,
  deleteEvent,
  receiveDeleteEvent,
  loadMoreEventsUsingStore,
} from "../../../../../actions/events";

import { MOBILE_VERSION, DESKTOP_VERSION } from '../../../../../actions/app';
import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {SilencedError} from "../../../../../exceptions/errors";
import classes from "classnames";

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
      role,
    } = this.props;

    const {
      navigation: nextNavigation,
      notificationsList: nextNotificationsList
    } = nextProps;

    if ( ! isEqual(role, nextProps.role)) {
      dispatch(
        fetchEventsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
              __GET: {
                take: DEFAULT_NOF_RECORDS_PER_PAGE,
                role: nextProps.role,
                ids: nextNotificationsList ? nextNotificationsList.map(data => data.objectReferenceId) : null
              },
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

  notificationsIds() {
    const {notificationsList} = this.props;

    if (notificationsList) {
      return notificationsList.map(data => data.objectReferenceId)
    } else {
      return null
    }
  }

  fetchEventsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      role,
    } = this.props;

    this.fetchEventsListFetcher = dispatch(
      fetchEventsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            ids: this.notificationsIds(),
            role,
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

  /**
   * Define ListItem action buttons array.
   *
   * @param _this Reference to EventsListItem
   * @returns {[XML]}
   */
  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      history,
      role,
      promotion,
    } = this.props;

    const {
      isRemoving,
    } = _this.state;

    const {
      id: eventId,
      status,
    } = _this.props.data;

    let buttons = [
      <button
        key="RemoveEvent"
        className='remove round-button'

        onClick={() => {
          confirm(I18n.t('events.confirmDeleteEvent')).then(() => {
            if (!isRemoving) {
              _this.setState({
                isRemoving: true,
              }, () => {
                /**
                 * TODO: Will be needed to confirm
                 * this action before removing.
                 */

                _this.removeFetcher = dispatch(
                  deleteEvent(
                    accessToken,
                    eventId
                  )
                );

                _this.removeFetcher
                  .then(() => {
                    _this.setState({
                      isRemoving: false,
                    }, () => {
                      dispatch(
                        receiveDeleteEvent(eventId)
                      );
                    });
                  });
              });
            }
          });
        }}
      />,
      <button
        key="CopyEvent"
        className='round-button'
        style={{marginLeft: '4px', position: 'relative'}}
        onClick={() => {
          history.push(`/events/create`, {data: _this.props.data, role: role});
      }}>
        <i className={classes('icon-copy', s.copy)}/>
      </button>,
      <button
        key="EditEvent"
        className='edit round-button'
        onClick={() => {
          history.push(`/events/edit/${eventId}`, {data: _this.props.data, role: role});
        }}
      />,
    ];

    if (promotion && _this.props.data.public) {
      buttons.push(
        <button
          key="Promotion"
          className={classes(s.activate, {
            [s.pending]: status.promotion,
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/events/promotions?event=${eventId}`, {
                ...(accessToken ? {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  },
                } : {})
              })
            )
              .then(response => {
                switch (response.status) {
                  case 201:
                    status.promotion = true;
                    _this.forceUpdate();
                    return;

                  case 403:
                    return history.push(`/profile/ads`);

                  default:

                    return Promise.reject(
                      new SilencedError('Failed to fetch activate promotion.')
                    );
                }
              })
          }}
        >
          {I18n.t('products.promotion')}
        </button>,
      )
    }
    return buttons;
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      eventsList,
      role,
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
              role: role,
              ids: this.notificationsIds()
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
      totalNrOfItems,
      notificationsList,
      setViewedNotification,
      eventsList,
      role,
      history,
      match,
      uiVersion
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const { isLoaded } = this.state;
    const routeLink = (role === 'place') ? 'business' : 'professional';

    return (
      <div className={classes({
        [s.root]: uiVersion === DESKTOP_VERSION,
        [s.rootMobile]: uiVersion === MOBILE_VERSION
      })}>
        <div className={s.head}>
          <h4>{I18n.t('events.eventsEditProfile')}</h4>
          {
            isMobile && (
              (match.path !== `/profile/${routeLink}/events`) && (
                <button
                  className={s.seeAll}
                  onClick={() => history.push(`/profile/${routeLink}/events`)}
                >
                  {I18n.t('administration.menuDropDown.showAll')}
                </button>
              )
            )
          }
          <CreateEventButton role={role} isMobile={isMobile} />
        </div>

        {
          isLoaded && (
            (!!eventsList && !!eventsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  beforeChange={(prevIndex, nextIndex) => {
                    if(totalNrOfItems > eventsList.length && nextIndex+1 === eventsList.length) {
                      this.loadMore();
                    }
                  }}
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
                  actionButtons={this.listItemActionButtons}
                  setViewedNotification={setViewedNotification}
                  notificationsList={notificationsList}
                />
              )
            )) || I18n.t('events.eventsNotFound')
          )
        }

        {
          couldLoadMore && !isMobile && (
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
    uiVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    user: state.user,
    isFetching: state.events.isFetching,
    loadingMore: state.events.loadingMore,
    couldLoadMore: state.events.couldLoadMore,
    totalNrOfItems: state.groups.totalNrOfItems,
    eventsList: state.events.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    promotion: state.app.promotion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EventsList)));
