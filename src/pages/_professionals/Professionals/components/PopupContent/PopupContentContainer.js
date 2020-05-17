import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import classes from 'classnames';
import slugify from 'slugify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';
import {I18n} from 'react-redux-i18n';
import PopupContent from './PopupContent';
import WarningPopover from '../../../../../components/WarningPopover';

import {
  follow as followTheProfessional,
  receiveFollowTheProfessional,
  unfollow as unfollowTheProfessional,
  receiveUnfollowTheProfessional,
} from '../../../../../actions/professionals';
import {metaDataGenerate} from "../../../../../helpers/metaDataGenerate";

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      follow: PropTypes.bool.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      description: PropTypes.string,
      dateOfBirth: PropTypes.number,
      email: PropTypes.string,
      avatar: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }),
      gallery: PropTypes.shape({
        images: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired,
          title: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          })
        })
      ).isRequired,
      socialMediaLinks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
      studies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          institution: PropTypes.string.isRequired,
        })
      ),
      workingPlaces: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          institution: PropTypes.string.isRequired,
          position: PropTypes.string.sRequired,
          schedule: PropTypes.string,
          location: PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            longitude: PropTypes.number.isRequired,
            latitude: PropTypes.number.isRequired,
            timezone: PropTypes.shape({
              id: PropTypes.string.isRequired,
              identifier: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            }),
          }).isRequired,
        })
      ),
      phoneNumber: PropTypes.string,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
  };

  static defaultProps = {
    onComponentWillUnmount: (_this) => {
      if (_this.toggleFollowStatusFetcher instanceof Promise) {
        _this.toggleFollowStatusFetcher.cancel();
      }
    },
    actionButtons: (_this) => {
      const {
        history,
        dispatch,
        isAuthenticated,
        accessToken,
        data,
        user,
      } = _this.props;

      const {
        isStartingToFollow,
        isStoppingToFollow,
        textOver
      } = _this.state;

      const {
        id: professionalId,
        follow,
        firstName,
        lastName,
      } = data;

      let text = I18n.t('general.elements.following');

      if (textOver) {
        text = I18n.t('general.elements.unFollowingOverPro');
      }

      if (isStartingToFollow) {
        text = I18n.t('general.elements.followPro')
      }

      if(!textOver && !isStartingToFollow) {
        text = I18n.t('general.elements.following')

      }

      const accountIsConfirmed = user.confirmed || false;
      const isProfessionalOwner = user.profPending === 'ok'
        && user.profDetails.id === professionalId;

      const followButton = (
        <button
          key="Follow"
          className={classes('btn btn-red', {
            "inTransition": isStartingToFollow,
          })}
          onClick={() => {
            if(accountIsConfirmed){
              if (isAuthenticated) {
                if (!isStartingToFollow) {
                  _this.setState({
                    isStartingToFollow: true,
                  }, () => {
                    _this.toggleFollowStatusFetcher =
                      dispatch(
                        followTheProfessional(
                          accessToken,
                          professionalId
                        )
                      );

                    _this.toggleFollowStatusFetcher
                      .then(() => {
                        _this.setState({
                          isStartingToFollow: false,
                        }, () => {
                          dispatch(
                            receiveFollowTheProfessional(professionalId)
                          );
                        });
                      });
                  });
                }
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `professionals/${slugify(firstName)}-${slugify( lastName)}-${professionalId}`});
            }
          }}
        >
          {
            (isStartingToFollow && I18n.t('general.elements.following')) || I18n.t('general.elements.followPro')
          }
        </button>
      );

      const unFollowButton = (
        <button
          key="Unfollow"
          className={classes('btn btn-red', {
            "inTransition": isStoppingToFollow,
            "isNotGoing": !isStartingToFollow
          })}
          onMouseOver={() => _this.setState({ textOver: true })}
          onMouseOut={() => _this.setState({ textOver: false })}
          onClick={() => {
            if (!isStoppingToFollow) {
              _this.setState({
                isStoppingToFollow: true,
              }, () => {
                _this.toggleFollowStatusFetcher =
                  dispatch(
                    unfollowTheProfessional(
                      accessToken,
                      professionalId
                    )
                  );

                _this.toggleFollowStatusFetcher
                  .then(() => {
                    _this.setState({
                      isStoppingToFollow: false,
                    }, () => {
                      dispatch(
                        receiveUnfollowTheProfessional(professionalId)
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
        <WarningPopover key="Follow" isPopup={true}>
          {followButton}
        </WarningPopover>
      );

      let buttons = [];

      if(!isProfessionalOwner) {
        if(follow) {
          buttons.push(unFollowButton);
        } else {
          if(accountIsConfirmed){
            buttons.push(followButton);
          } else {
            buttons.push(notConfirmedAccountButton);
          }
        }
      }

      return buttons;
    },
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      activeImageIndex: this.props.data.gallery.images.findIndex(i => i.default),
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
      actionButtons
    } = this.props;

    const { activeImageIndex } = this.state;
    const images = data.gallery.images;
    const defaultImage = images[activeImageIndex];

    const fullName = `${data.firstName} ${data.lastName}`;

    metaDataGenerate(fullName, defaultImage.src, data.description);

    return (
      <PopupContent
        data={data}
        defaultImage={defaultImage}
        actionButtonsList={actionButtons(this)}
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
        activeImageIndex={activeImageIndex}
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
