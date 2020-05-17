import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { userIsItemOwner } from '../../../../../helpers/permissions';
import slugify from 'slugify';
import WarningPopover from '../../../../../components/WarningPopover';
import Groups from './Groups';
import PopupContent from './PopupContent';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';

import {
  goingToEvent,
  notGoingToEvent,
  receiveGoingToEvent,
  receiveNotGoingToEvent
} from "../../../../../actions/events";

import {
  getEventActualDate,
} from '../../../../../helpers/events';

import {
  metaDataGenerate,
} from '../../../../../helpers/metaDataGenerate';

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      gallery: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          tag: PropTypes.string.isRequired,
        })
      ),
      location: PropTypes.shape({
        label: PropTypes.string,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
      since: PropTypes.number.isRequired,
      until: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      going: PropTypes.bool.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
  };

  static defaultProps = {
    onComponentWillUnmount: (_this) => {
      if (_this.toggleGoingStatusFetcher instanceof Promise) {
        _this.toggleGoingStatusFetcher.cancel();
      }
    },
    actionButtons: (_this) => {
      const {
        history,
        dispatch,
        isAuthenticated,
        accessToken,
        data,
        data: {
          id: eventId,
          postedLike,
          going,
          owner,
          title,
          goingDate,
          dateStart,
          days
        },
        user,
      } = _this.props;

      const isEventOwner = isAuthenticated
        && userIsItemOwner(user, postedLike, owner);

      const accountIsConfirmed = user.confirmed || false;

      const {
        isGoing,
        isNotGoing,
        textOver,
      } = _this.state;

      let text = I18n.t('general.elements.going');

      const startDayOfEvent = days && days.length ? dateStart : null;

      if (textOver) {
        text = I18n.t('general.elements.notGoingOver');
      }

      if (isGoing) {
        text = I18n.t('general.elements.goingInProcess')
      }

      if (!textOver && !isGoing ) {
        text = I18n.t('general.elements.notGoing')
      }

      const goingButton = (
        <button
        key="isGoing"
        className={classes("btn btn-red", {
          "inTransition": isGoing
        })}
        onClick={() => {
          if(accountIsConfirmed){
            if (isAuthenticated) {
              if ( ! isGoing ) {
                _this.setState({
                  isGoing: true,
                }, () => {
                  _this.toggleGoingStatusFetcher =
                    dispatch(
                      goingToEvent(
                        accessToken,
                        eventId,
                        startDayOfEvent
                      )
                    );
                  _this.props.data.going = true;
                  _this.props.data.goingDate = dateStart;
                  _this.forceUpdate();
                  _this.toggleGoingStatusFetcher
                    .then(() => {
                      _this.setState({
                        isGoing: false,
                      }, () => {
                        dispatch(
                          receiveGoingToEvent(data)
                        );
                      });
                    });
                });
              }
            }
          } else {
            if(!isAuthenticated)
               history.push('/login', {from: `events/${slugify(title)}-${eventId}`});
          }
        }}
        >
          {
            (isGoing && I18n.t('general.elements.goingInProcess')) || (
              I18n.t('general.elements.going')
            )
          }
        </button>
      );

      const notGoingButton= (
        <button
          key="NotGoing"
          className={classes("btn btn-red", {
            "inTransition": isNotGoing,
            "isNotGoing": !isGoing
          })}
          onMouseOver={() => _this.setState({ textOver: true })}
          onMouseOut={() => _this.setState({ textOver: false })}
          onClick={() => {
            if (! isNotGoing) {
              _this.setState({
                isNotGoing: true,
              }, () => {
                _this.toggleGoingStatusFetcher =
                  dispatch(
                    notGoingToEvent(
                      accessToken,
                      eventId
                    )
                  );
                _this.props.data.going = false;
                _this.props.data.goingDate = null;
                _this.forceUpdate();
                _this.toggleGoingStatusFetcher
                  .then(() => {
                    _this.setState({
                      isNotGoing: false,
                    }, () => {
                      dispatch(
                        receiveNotGoingToEvent(data)
                      );
                    });
                  });
              });
            }
          }}
          >
            { text }
          </button>
      );

      const notConfirmedAccountButton = (
        <WarningPopover key="goingToEvent" isPopup={true}>
          {goingButton}
        </WarningPopover>
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

      return buttons;
    },
  };

  constructor(props, context) {
    super(props, context);
    const { gallery } = props.data;

    this.state = {
      activeImageIndex: gallery.images.findIndex(i => i.default),
      showGroupsList: false,
    };

  }

  componentWillUnmount() {
    const { onComponentWillUnmount } = this.props;

    if (onComponentWillUnmount instanceof Function) {
      onComponentWillUnmount(this);
    }
  }

  render () {
    const {
      data,
      actionButtons,
      isAuthenticated,
      history,
    } = this.props;

    const {
      activeImageIndex,
      showGroupsList,
    } = this.state;

    const images = data.gallery.images;
    const activeImage = images[activeImageIndex];
    const defaultImage = images.find(i => i.default);

    metaDataGenerate(data.title, defaultImage.src, data.description);

    if(showGroupsList){
      return (
        <Groups
          userCanAddGroup
          data={{
            ...data,
            date: getEventActualDate(data),
          }}
          defaultImage={defaultImage}
          closeGroupsList={() => this.setState({showGroupsList: false})}
          isAuthenticated={isAuthenticated}
          createGroupForEvent={() => history.push(
            `/groups/create`,
            {event: data},
          )}
        />
      )
    }

    return (
      <PopupContent
        data={{
          ...data,
          date: getEventActualDate(data),
        }}
        defaultImage={activeImage}
        showGroupsList={showGroupsList}
        actionButtonsList={actionButtons(this)}
        openGroupsList={() => this.setState({showGroupsList: true})}
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
        activeImageIndex = {activeImageIndex}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    user: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PopupContentContainer)));
