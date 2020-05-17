import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import slugify from 'slugify';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { userIsItemOwner } from '../../../../../helpers/permissions';
import WarningPopover from '../../../../../components/WarningPopover';
import PopupContent from './PopupContent';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';

import {
  addToFavorites,
  receiveAddToFavorites,
  removeFromFavorites,
  receiveRemoveFromFavorites,
} from '../../../../../actions/posts';

import {
  metaDataGenerate,
} from '../../../../../helpers/metaDataGenerate';

class PopupContentContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      image: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }).isRequired,
      intro: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          tag: PropTypes.string.isRequired,
        })
      ),
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image:  PropTypes.shape({
              id: PropTypes.string.isRequired,
              src: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
      favorite: PropTypes.bool.isRequired,
    }),
    onComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
  };

  static defaultProps = {
    /**
     * Default actions to trigger on componentWillUnmount.
     *
     * @param _this
     */
    onComponentWillUnmount: (_this) => {
      if (_this.toggleFavoriteStatusFetcher instanceof Promise) {
        _this.toggleFavoriteStatusFetcher.cancel();
      }
    },
    /**
     * Default action buttons that will be used in most cases.
     *
     * @param _this Reference to PopupContentContainer
     * @returns {[XML]}
     */
    actionButtons: (_this) => {
      const {
        history,
        dispatch,
        isAuthenticated,
        accessToken,
        data,
        user
      } = _this.props;

      const {
        id: postId,
        favorite,
        postedLike,
        owner
      } = data;

      const accountIsConfirmed = user.confirmed || false;
      const isPostOwner = isAuthenticated
        && userIsItemOwner(user, postedLike, owner);

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

      const removeFromFavoritesButton = (
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
                      postId
                    )
                  );

                _this.toggleFavoriteStatusFetcher
                  .then(() => {
                    _this.setState({
                      isRemovingFromFavorites: false,
                    }, () => {
                      dispatch(
                        receiveRemoveFromFavorites(postId)
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

      const addToFavoritesButton = (
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
                            postId
                          )
                        );

                      _this.toggleFavoriteStatusFetcher
                        .then(() => {
                          _this.setState({
                            isAddingToFavorites: false,
                          }, () => {
                            dispatch(
                              receiveAddToFavorites(postId)
                            );
                          });
                        });
                    });
                  }
                }
              } else {
                if(!isAuthenticated)
                  history.push('/login', {from: `blog/post/${slugify(data.title)}-${postId}`});
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

      if(!isPostOwner){
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

    this.state = {};
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
      onClose,
    } = this.props;

    metaDataGenerate(data.title,  data.image.src, data.intro);

    const tagsList = data.tags.map(({tag, slug}, i) => (
      <Link
        onClick={onClose}
        to={`/blog/tag/${slug}`}
        className={s.tag}
        key={i}
      >
        {tag}
      </Link>
    ));

    return (
      <PopupContent
        data={data}
        tags={tagsList}
        postHasTags={!!tagsList.length}
        actionButtonsList={
          actionButtons(this)
        }
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
