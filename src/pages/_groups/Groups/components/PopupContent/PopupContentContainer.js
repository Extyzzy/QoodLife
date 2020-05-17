import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "classnames";
import { withRouter } from "react-router";
import { connect } from "react-redux";
import moment from "moment";
import slugify from 'slugify';
import WarningPopover from '../../../../../components/WarningPopover';
import PopupContent from "./PopupContent";
import {I18n} from 'react-redux-i18n';
import {
  joinGroup,
  leaveGroup,
  receiveJoinGroup,
  receiveLeaveGroup
} from "../../../../../actions/groups";
import {metaDataGenerate} from "../../../../../helpers/metaDataGenerate";

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      gallery: PropTypes.shape({
        images: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      event: PropTypes.shape({
        location: PropTypes.shape({
          label: PropTypes.string,
          longitude: PropTypes.number.isRequired,
          latitude: PropTypes.number.isRequired,
        }).isRequired,
        since: PropTypes.number.isRequired,
        until: PropTypes.number.isRequired,
      }),
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })).isRequired,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          fullName: PropTypes.string.isRequired,
          avatar: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }),
          owner: PropTypes.bool,
        }).isRequired,
      ),
      location: PropTypes.shape({
        label: PropTypes.string,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }),
      since: PropTypes.number,
      until: PropTypes.number,
      details: PropTypes.string.isRequired,
      isFull: PropTypes.bool,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
  };

  static defaultProps = {
    onComponentWillUnmount: (_this) => {
      if (_this.toggleJoiningStatusFetcher instanceof Promise) {
        _this.toggleJoiningStatusFetcher.cancel();
      }
    },
    actionButtons: (_this) => {
      const {
        history,
        dispatch,
        onChatPopupOpen,
        isAuthenticated,
        accessToken,
        data,
        data: {
          members,
          owner
        },
        user,
      } = _this.props;

      const isGroupOwner = user.id === owner.id;
      const isMember = !!members.find(m => m.id === user.id);
      const isFull = members.length >= data.size;
      const accountIsConfirmed = user.confirmed;

      const {
        id: groupId,
      } = data;

      const {
        isJoining,
        isLeaving,
      } = _this.state;

      const leaveButton = (
          <button
            key="leaveGroup"
            className={classes("btn btn-red", {
              "inTransition": isLeaving,
              "removeButton": !isLeaving
            })}
            onClick={() => {
              if (!isLeaving) {
                _this.setState({
                  isLeaving: true,
                }, () => {
                  _this.toggleJoiningStatusFetcher =
                    dispatch(
                      leaveGroup(
                        accessToken,
                        groupId
                      )
                    );

                  _this.toggleJoiningStatusFetcher
                    .then(() => {
                      dispatch(
                        receiveLeaveGroup(groupId, user.id)
                      );

                      _this.setState({
                        isLeaving: false,
                      });
                    });
                });
              }
            }}
          >
            {
              (isLeaving && I18n.t('groups.inProgressButton')) ||
              I18n.t('groups.leaveGroupButton')
            }
          </button>
      );

      const joinButton = (
          <button
            key="joinToGroup"
            className={classes("btn btn-red", {
              "inTransition": isJoining
            })}
            onClick={() => {
              if(accountIsConfirmed){
                if(isAuthenticated){
                  _this.setState({
                    isJoining: true,
                  }, () => {
                    _this.toggleJoiningStatusFetcher =
                      dispatch(
                        joinGroup(
                          accessToken,
                          groupId
                        )
                      );

                    _this.toggleJoiningStatusFetcher
                      .then(() => {
                        dispatch(
                          receiveJoinGroup(groupId, user)
                        );

                        _this.setState({
                          isJoining: false,
                        });
                      });
                  });
                }
              } else {
                if(!isAuthenticated)
                  history.push('/login', {from: `groups/${slugify(data.name)}-${groupId}`});
              }
            }}
          >
            {
              (isJoining && I18n.t('groups.inProgressButton')) ||
              I18n.t('groups.joinToGroupButton')
            }
          </button>
      );

      const notConfirmedAccountButton = (
        <WarningPopover key="joinToGroup" isPopup={true}>
          {joinButton}
        </WarningPopover>
      );

      const writeMessageButton = (
          <button
            key="writeMessage"
            className="btn btn-red"
            onClick={onChatPopupOpen}
          >
            {I18n.t('general.elements.writeMessage')}
          </button>
      );

      const notConfirmedAccountwriteMessageButton = (
        <WarningPopover key="writeMessage" isPopup={true}>
          {writeMessageButton}
        </WarningPopover>
      );

      let buttons = [];

      if(!isGroupOwner) {
        if(isMember) {
          buttons.push(leaveButton);
        } else {
            if(!isFull) {
              if(accountIsConfirmed) {
                buttons.push(joinButton);
              } else {
                buttons.push(notConfirmedAccountButton);
              }
            }
        }
      };

      if(accountIsConfirmed){
        buttons.push(writeMessageButton);
      } else {
        if(isAuthenticated)
        buttons.push(notConfirmedAccountwriteMessageButton);
      };

      return buttons;
    },
  };

  constructor(props, context) {
    super(props, context);
    let defaultIndex;
    defaultIndex = this.props.data.gallery.images.find((i, index) => {
      return index
    });
    defaultIndex = defaultIndex >= 0 ? defaultIndex : 0;

    this.state = {
      activeImageIndex: defaultIndex,
      viewMembersDetails: false,
      sliderSettings: {
        autoplaySpeed: 3000,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
      }
    };
  }


  componentWillUnmount() {
    const {onComponentWillUnmount} = this.props;

    if (onComponentWillUnmount instanceof Function) {
      onComponentWillUnmount(this);
    }

  }

  render() {
    const {
      data,
      actionButtons,
    } = this.props;

    const { activeImageIndex, viewMembersDetails, sliderSettings } = this.state;
    const defaultImage = data.gallery.images[activeImageIndex];
    const location = data.location || (data.event && data.event.location);
    const since = moment(data.since || (data.event && data.event.since), 'X');
    const until = moment(data.until || (data.event && data.event.until), 'X');

    metaDataGenerate(data.name, defaultImage.src, data.details);

    return (
      <PopupContent
        data={data}
        location={location}
        since={since}
        until={until}
        defaultImage={defaultImage}
        actionButtonsList={actionButtons(this)}
        onImageSelect={(index) => {
          this.setState({activeImageIndex: index});
        }}
        activeImageIndex={activeImageIndex}
        toggleDetails={() => {
          this.setState({viewMembersDetails: !viewMembersDetails});
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
        viewMembersDetails={viewMembersDetails}
        sliderSettings={sliderSettings}
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

export default withRouter(connect(mapStateToProps)(PopupContentContainer));
