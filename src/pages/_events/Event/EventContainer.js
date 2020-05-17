import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import classes from 'classnames';
import update from "immutability-helper";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Event.scss';
import {I18n} from 'react-redux-i18n';
import WarningPopover from '../../../components/WarningPopover';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import Event from './Event';
import MobileVersion from './EventMobile';
import { MOBILE_VERSION } from '../../../actions/app';
import { userIsItemOwner } from '../../../helpers/permissions';
import { getEventActualDate } from '../../../helpers/events';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import { SilencedError } from '../../../exceptions/errors';
import Groups from './Groups';


import {
  goingToEvent,
  notGoingToEvent
} from "../../../actions/events";

class EventContainer extends Component {
  constructor(props, context) {
    super(props, context);

    const data = props.location.state && props.location.state.data ? props.location.state.data : null;
    this.state = {
      isLoaded: !!data,
      data,
      isGoing: false,
      isNotGoing: false,
      showGroupsList: false,
      textOver: false,
      activeImageIndex: data
        ? data.gallery.images.findIndex(i => i.default)
        : null,
      randActiveIndex: false
    };

    this.actionButtons = this.actionButtons.bind(this);
  }

  componentDidMount() {
    if( ! this.state.data) {
      const {
        match: {params: {eventId: eventRoute}}
      } = this.props;

      const eventId = eventRoute.split('-').pop();

      const {
        dispatch,
        accessToken,
      } = this.props;

      this.eventFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/events/${eventId}`, {
          ...(accessToken ? {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          } : {})
        })
      );

      this.eventFetcher
        .then(response => {
          switch(response.status) {
            case 200:

              return response.json();

            default:

              return Promise.reject(
                new SilencedError('Failed to fetch event.')
              );
          }
        })
        .then(data => {
          this.setState({data, activeImageIndex: data.gallery.images.findIndex(i => i.default)});
          return Promise.resolve();
        })
        .finally(() => {
          if ( ! this.eventFetcher.isCancelled()) {
            this.setState({
              isLoaded: true,
              randActiveIndex: this.state.data.gallery.images.length > 1 && !!this.state.data.days.length 
                ? Math.floor(Math.random() * this.state.data.gallery.images.length)
                : false
            });
          }
        });
    }
  }

  componentWillUnmount() {
    if (this.eventFetcher instanceof Promise) {
      this.eventFetcher.cancel();
    }

    if (this.toggleGoingStatusFetcher instanceof Promise) {
      this.toggleGoingStatusFetcher.cancel();
    }
  }

  actionButtons() {
    const {
      dispatch,
      accessToken,
      isAuthenticated,
      match: {params: {eventId: eventRoute}},
      history,
      user,
    } = this.props;

    const eventId = eventRoute.split('-').pop();

    const {
      isGoing,
      isNotGoing,
      data,
      data: {
        going,
        postedLike,
        owner,
        days,
        dateStart,
        goingDate,
      },
      textOver,
    } = this.state;

    const accountIsConfirmed = user.confirmed || false;

    const startDayOfEvent = days && days.length ? dateStart : null;

    const isEventOwner = isAuthenticated
      && userIsItemOwner(user, postedLike, owner);

      let text = I18n.t('general.elements.going');

      if (textOver) {
        text = I18n.t('general.elements.notGoingOver');
      }

      if (isGoing) {
        text = I18n.t('general.elements.goingInProcess')
      }

      if (!textOver && !isGoing) {
        text = I18n.t('general.elements.notGoing')
      }

    const goingButton = (
      <button
          key="isGoing"
          className={classes('btn btn-red', {
            "inTransition": isGoing,
          })}
          onClick={() => {
            if(accountIsConfirmed){
              if(isAuthenticated) {
                if (! isGoing) {
                  this.setState({
                    isGoing: true,
                    goingDate: dateStart
                  }, () => {
                    this.toggleGoingStatusFetcher =
                      dispatch(
                        goingToEvent(
                          accessToken,
                          eventId,
                          startDayOfEvent
                        )
                      );

                    this.toggleGoingStatusFetcher
                      .then(() => {
                        this.setState({
                          isGoing: false,
                          data: update(data, {
                            going: {
                              $set: true
                            },
                            goingDate: {
                              $set: dateStart
                            }
                          }),
                        });
                      });
                  });
                }
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `events/${eventRoute}`});
            }
          }
          }
        >
          {
            (isGoing && I18n.t('general.elements.goingInProcess')) ||
            (I18n.t('general.elements.going'))
          }
        </button>
    );

    const notGoingButton = (
      <button
        key="notGoing"
        className={classes('btn btn-red', {
          "inTransition": isNotGoing,
          "isNotGoing": !isGoing
        })}
        onMouseOver={() => this.setState({ textOver: true })}
        onMouseOut={() => this.setState({ textOver: false })}
        onClick={() => {
          if ( ! isNotGoing) {
            this.setState({
              isNotGoing: true,
              goingDate: null
            }, () => {
              this.toggleGoingStatusFetcher =
                dispatch(
                  notGoingToEvent(
                    accessToken,
                    eventId
                  )
                );

              this.toggleGoingStatusFetcher
                .then(() => {
                  this.setState({
                    isNotGoing: false,
                    data: update(data, {
                      going: {
                        $set: false
                      },
                      goingDate: {
                        $set: null
                      }
                    }),
                  });
                });
            });
          }
        }}
      >
        {text}
      </button>
    );

    const notConfirmedAccountButton = (
      <WarningPopover key="goingToEvent" isPopup={true}>
        {goingButton}
      </WarningPopover>
    );

    const findAGroup = (
      <button
        key="findAGroup"
        className="btn btn-red"
        onClick={() => this.setState({showGroupsList: true})}
      >
        {I18n.t('events.findAGroupButton')}
      </button>
    );

    let buttons = [];

    if ( ! isEventOwner ) {
      if ( (goingDate === dateStart) || (going && goingDate === null)){
        buttons.push(notGoingButton)
      } else if (accountIsConfirmed) {
        buttons.push(goingButton)
      } else {
        buttons.push(notConfirmedAccountButton)
      }
    }

    buttons.push(findAGroup);

    return buttons;
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return Event;
    }
  }

  render () {
    const {
      UIVersion,
      isAuthenticated,
      history,
    } = this.props;

    const {
      isLoaded,
      data,
      activeImageIndex,
      showGroupsList,
      randActiveIndex
    } = this.state;

    if ( ! isLoaded) {
      return (
        <Loader />
      );
    }

    if ( ! data) {
      return (
        <PageNotFound />
      );
    }

    const Event = this.getListItem();
    const images = data.gallery.images;

    const defaultImage = !!randActiveIndex ? images[randActiveIndex] : images[activeImageIndex];
    

    let tags = document.querySelectorAll("#links a");

    if (tags) {
      for (let tag of tags){
        tag.setAttribute('target', '_blank');
      }
    }

    if(showGroupsList){
      return (
        <Groups
          isAuthenticated={isAuthenticated}
          isMobile={UIVersion === MOBILE_VERSION}
          data={{
            ...data,
            date: getEventActualDate(data),
          }}
          defaultImage={defaultImage}
          closeGroupsList={() => this.setState({showGroupsList: false})}
          createGroupForEvent={() => history.push(
            `/groups/create`,
            {event: data},
          )}
        />
      )
    }

    return (
      <Event
        data={{
          ...data,
          date: getEventActualDate(data),
        }}
        postedLike={() => {
          switch (data.postedLike.code) {
            case 'place':
              return 'places';
            case 'professional':
              return 'professionals';
            default:
              return 'member';
          }
        }}
        defaultImage={defaultImage}
        actionButtonsList={this.actionButtons()}
        activeImageIndex={activeImageIndex}
        onImageSelect={activeImageIndex => {
          this.setState({activeImageIndex});
        }}
        moveDownImage = {() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === 0
                ? images.length - 1
                : activeImageIndex - 1,
          })
        }}
        moveUpImage ={() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === images.length - 1
              ? 0
              : activeImageIndex + 1
            ,
          })
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    user: state.user,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EventContainer)));
