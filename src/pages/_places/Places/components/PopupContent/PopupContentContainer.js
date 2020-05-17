import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import classes from 'classnames';
import slugify from 'slugify';
import {I18n} from 'react-redux-i18n';
import WarningPopover from '../../../../../components/WarningPopover';
import PopupContent from './PopupContent';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';

import {
  addToFavorites,
  receiveAddToFavorites,
  removeFromFavorites,
  receiveRemoveFromFavorites,
} from '../../../../../actions/places';
import {metaDataGenerate} from "../../../../../helpers/metaDataGenerate";

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }),
      branches: PropTypes.arrayOf(
        PropTypes.shape({
          default: PropTypes.bool.isRequired,
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
          gallery: PropTypes.shape({
            images: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                default: PropTypes.bool.isRequired,
              })).isRequired,
          }).isRequired,
          schedule: PropTypes.string,
        })
      ).isRequired,
      description: PropTypes.string,
      email: PropTypes.string,
      favorite: PropTypes.bool.isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape.isRequired,
        })
      ).isRequired,
      socialmediaLinks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
      phoneNumber: PropTypes.string,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    onPopupComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
    popupActionButtons: PropTypes.func,
  };

  static defaultProps = {
    onComponentWillUnmount: (_this) => {
      if (_this.toggleFavoriteStatusFetcher instanceof Promise) {
        _this.toggleFavoriteStatusFetcher.cancel();
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
        id: placeId,
        favorite,
        name,
        followers,
      } = data;

      const {
        isAddingToFavorites,
        isRemovingFromFavorites,
        textOver,
      } = _this.state;

      let text = I18n.t('general.elements.addedFollow');

      if (textOver) {
        text = I18n.t('general.elements.unFollowingOver');
      }

      if (isAddingToFavorites) {
        text = I18n.t('general.elements.unFolow')
      }

      const accountIsConfirmed = user.confirmed || false;
      const isOwinPlace = user.placePending === 'ok'
        && user.placeDetails.id === placeId;

      const removeButton = (
        <button
          key="RemoveFromFavorites"
          className={classes('btn btn-red', {
            "inTransition": isRemovingFromFavorites,
            "isNotGoing": !isRemovingFromFavorites
          })}
          onMouseOver={() => _this.setState({ textOver: true })}
          onMouseOut={() => _this.setState({ textOver: false })}
          onClick={() => {
            if (!isRemovingFromFavorites) {
              _this.setState({
                isRemovingFromFavorites: true,
              }, () => {
                _this.toggleFavoriteStatusFetcher =
                  dispatch(
                    removeFromFavorites(
                      accessToken,
                      placeId
                    )
                  );

                _this.toggleFavoriteStatusFetcher
                  .then(() => {
                    _this.setState({
                      isRemovingFromFavorites: false,
                    }, () => {
                      dispatch(
                        receiveRemoveFromFavorites(placeId)
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

      const addButton = (
        <button
          key="AddToFavorites"
          className={classes('btn btn-red', {
            "inTransition": isAddingToFavorites,
          })}
          onClick={() => {
            if(accountIsConfirmed){
              if (isAuthenticated) {
                if (!isAddingToFavorites) {
                  _this.setState({
                    isAddingToFavorites: true,
                  }, () => {
                    _this.toggleFavoriteStatusFetcher =
                      dispatch(
                        addToFavorites(
                          accessToken,
                          placeId
                        )
                      );

                    _this.toggleFavoriteStatusFetcher
                      .then(() => {
                        _this.setState({
                          isAddingToFavorites: false,
                        }, () => {
                          dispatch(
                            receiveAddToFavorites(placeId)
                          );
                        });
                      });
                  });
                }
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `places/${slugify(name)}-${placeId}`});
            }
          }}
        >
          {
            (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) ||
            I18n.t('general.elements.addToFavorites')
          }
        </button>
      );

      const notConfirmedAccountButton = (
        <WarningPopover key="Follow" isPopup={true}>
          {addButton}
        </WarningPopover>
      );

      const followersButton = (
        <div className="followersCount">
          <i className="icon-man-bold" /> / { followers }
        </div>
      );

      let buttons = [];

      if(!isOwinPlace) {
        if(favorite) {
          buttons.push(removeButton);
        } else {
          if(accountIsConfirmed){
            buttons.push(addButton);
          } else {
            buttons.push(notConfirmedAccountButton);
          }
        }
      }

      buttons.push(followersButton)

      return buttons;

    },
  };

  constructor(props, context) {
    super(props, context);
    let defaultIndex;
    const { data } = this.props;

    defaultIndex = data.gallery.images.findIndex(i => i.default);
    defaultIndex = defaultIndex >=0 ? defaultIndex : 0;

    this.state = {
      activeImageIndex: defaultIndex,
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
    } = this.props;

    const { activeImageIndex } = this.state;
    const defaultBranch = data.placesBranch
      ? data.branches.find(m => m.id === data.placesBranch)
      : data.branches.find(br => br.default);

    const defaultImage = data.gallery.images[activeImageIndex];
    const images = data.gallery.images;
    const notDefaultBranches = data.branches.slice(1);

    metaDataGenerate(data.name, defaultImage.src, data.description);

    return (
      <PopupContent
        data={data}
        defaultBranch={defaultBranch}
        defaultImage={defaultImage}
        activeImageIndex={activeImageIndex}
        branches={notDefaultBranches}
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

        actionButtonsList={
          actionButtons(this)
        }
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
