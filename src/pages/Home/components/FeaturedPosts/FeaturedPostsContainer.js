import React, { Component } from 'react';
import {connect} from "react-redux";
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../../_blog/Blog/components/ListItem/ListItem.scss';
import MobileVersion from './FeaturedPostsMobile';
import { MOBILE_VERSION } from '../../../../actions/app';
import WarningPopover from '../../../../components/WarningPopover';
import { userIsItemOwner } from '../../../../helpers/permissions';
import FeaturedPosts from './FeaturedPosts';
import slugify from 'slugify';
import {I18n} from 'react-redux-i18n';
import {
  removeFromFavorites,
  addToFavorites,
} from '../../../../actions/posts';

class FeaturedPostsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      postsList: null,
      postsAreLoading: true,
    };

    this.onItemPopupComponentWillUnmount = this.onItemPopupComponentWillUnmount.bind(this);
    this.itemPopupActionButtons = this.itemPopupActionButtons.bind(this);
  }

  componentDidMount() {
    const {
      postsList,
    } = this.props;

      this.setState({
        postsList
      }, () =>
        this.setState({
          postsAreLoading: false,
      }));
  }

  componentWillUnmount() {
    if (this.fetchPostsListFetcher instanceof Promise) {
      this.fetchPostsListFetcher.cancel();
    }
  }

  onItemPopupComponentWillUnmount(_this) {
    if (_this.toggleFavoriteStatusFetcher instanceof Promise) {
      _this.toggleFavoriteStatusFetcher.cancel();
    }
  }

  itemPopupActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      isAuthenticated,
      history,
      user,
    } = this.props;

    const {
      postsList,
    } = this.state;

    const {
      data: {
        id: postId,
        postedLike,
        owner,
        favorite,
        title,
      },
    } = _this.props;

    const {
      isAddingToFavorites,
      isRemovingFromFavorites,
    } = _this.state;

    const accountIsConfirmed = user.confirmed;
    const isPostOwner = isAuthenticated
      && userIsItemOwner(user, postedLike, owner)

    const removeFromFavoritesButton = (
      <button
        key="RemoveFromFavorites"
        className='btn btn-red'
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
                    const postIndex = postsList
                      .findIndex(({id}) => id === postId);

                    if (postIndex !== -1) {
                      this.setState({
                        postsList: update(postsList, {
                          [postIndex]: {
                            $apply: (post) => update(post, {
                              favorite: {
                                $set: false,
                              },
                            }),
                          },
                        }),
                      }, () => {
                        // TODO: It's a temporal solution, check a better one.
                        // The issue is in the way we open popup in another container.
                        _this.props.data.favorite = false;
                        _this.forceUpdate();
                      });
                    }
                  });
                });
            });
          }
        }}
      >
        {
          (isRemovingFromFavorites && I18n.t('general.elements.removingFromFavorites')) ||
          I18n.t('general.elements.removeFromFavorites')
        }
      </button>
    );

    const addToFavoritesButton = (
        <button
          key="AddToFavorites"
          className='btn btn-red'
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
                          const postIndex = postsList
                            .findIndex(({id}) => id === postId);

                          if (postIndex !== -1) {
                            this.setState({
                              postsList: update(postsList, {
                                [postIndex]: {
                                  $apply: (post) => update(post, {
                                    favorite: {
                                      $set: true,
                                    },
                                  }),
                                },
                              }),
                            }, () => {
                              // TODO: It's a temporal solution, check a better one.
                              // The issue is in the way we open popup in another container.
                              _this.props.data.favorite = true;
                              _this.forceUpdate();
                            });
                          }
                        });
                      });
                  });
                }
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `blog/post/${slugify(title)}-${postId}`});
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

    const buttons = [];

    if(!isPostOwner) {
      if(favorite){
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
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return FeaturedPosts;

    }
  }

  render() {
    const {
      postsList,
      postsAreLoading,
    } = this.state;

    const FeaturedPosts = this.getListItem();

    return (
      <FeaturedPosts
        postsList={postsList}
        postsAreLoading={postsAreLoading}
        onItemPopupComponentWillUnmount={
          this.onItemPopupComponentWillUnmount
        }
        itemPopupActionButtons={
          this.itemPopupActionButtons
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
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(FeaturedPostsContainer)));
