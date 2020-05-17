import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import slugify from 'slugify';
import WarningPopover from '../../../../../components/WarningPopover';
import { userIsItemOwner } from '../../../../../helpers/permissions';
import PopupContent from './PopupContent';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';

import {
  addToFavorites, receiveAddToFavorites, receiveRemoveFromFavorites,
  removeFromFavorites
} from "../../../../../actions/products";
import {metaDataGenerate} from "../../../../../helpers/metaDataGenerate";

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      title: PropTypes.string.isRequired,
      gallery: PropTypes.shape({
        id: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      restrictions: PropTypes.shape({
        sinceAge: PropTypes.number,
        untilAge: PropTypes.number,
        gender: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }),
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired,
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
      description: PropTypes.string.isRequired,
      favorite: PropTypes.bool.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
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
          id: productId,
          favorite,
          postedLike,
          owner,
          title,
        } = data;

      const {
        isAddingToFavorites,
        isRemovingFromFavorites,
        textOver,
      } = _this.state;

      let text = I18n.t('general.elements.follow');

      if (textOver) {
        text = I18n.t('general.elements.unFolow');
      }

      if (isAddingToFavorites) {
        text = I18n.t('general.elements.addingToFavorites')
      }

      if (!textOver && !isAddingToFavorites) {
        text = I18n.t('general.elements.addedFollow')
      }

      const accountIsConfirmed = user.confirmed || false;
        const isProductOwner = isAuthenticated
          && userIsItemOwner(user, postedLike, owner);

        const removeFromFavoritesButton = (
          <button
            key="RemoveToFavorites"
            className={classes('btn btn-red', {
              "inTransition": isRemovingFromFavorites,
              "isNotGoing": !isRemovingFromFavorites
            })}
            onMouseOver={() => _this.setState({ textOver: true })}
            onMouseOut={() => _this.setState({ textOver: false })}
            onClick={() => {
              if ( ! isRemovingFromFavorites) {
                _this.setState({
                  isRemovingFromFavorites: true,
                }, () => {
                  _this.toggleFavoriteStatusFetcher =
                    dispatch(
                      removeFromFavorites(
                        accessToken,
                        productId
                      )
                    );

                  _this.toggleFavoriteStatusFetcher
                    .then(() => {
                      dispatch(
                        receiveRemoveFromFavorites(productId)
                      );

                      _this.setState({
                        isRemovingFromFavorites: false,
                      });
                    });
                });
              }
            }}
          >
            { text }
          </button>
        );

        const addToFavoritesButton = (
          <button
            key="AddToFavorites"
            className={classes('btn btn-red', {
              "inTransition": isAddingToFavorites,
            })}
            onClick={() => {
              if(accountIsConfirmed) {
                if (isAuthenticated) {
                  if (!isAddingToFavorites) {
                    _this.setState({
                      isAddingToFavorites: true,
                    }, () => {
                      _this.toggleFavoriteStatusFetcher =
                        dispatch(
                          addToFavorites(
                            accessToken,
                            productId
                          )
                        );

                      _this.toggleFavoriteStatusFetcher
                        .then(() => {
                          dispatch(
                            receiveAddToFavorites(productId)
                          );

                          _this.setState({
                            isAddingToFavorites: false,
                          });
                        });
                    });
                  }
                }
              } else {
                if(!isAuthenticated)
                  history.push('/login', {from: `products/${slugify(title)}-${productId}`});
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
          <WarningPopover key="AddToFavorites" isPopup={true}>
            {addToFavoritesButton}
          </WarningPopover>
        );

        let buttons = [];

        if(!isProductOwner){
          if(favorite) {
            buttons.push(removeFromFavoritesButton);
          } else {
            if(accountIsConfirmed){
              buttons.push(addToFavoritesButton);
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
    let defaultIndex;
    defaultIndex = this.props.data.gallery.images.find((i,index) => { return index });
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
      actionButtons
    } = this.props;

    const { activeImageIndex } = this.state;
    const images = data.gallery.images;
    const defaultImage = images[activeImageIndex];

    const stripedHtml = data.description.replace(/<[^>]+>/g, '');

    metaDataGenerate(data.title, defaultImage.src, stripedHtml);

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
