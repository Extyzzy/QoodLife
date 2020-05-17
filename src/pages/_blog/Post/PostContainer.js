import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Post from './Post';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import s from './Post.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import WarningPopover from '../../../components/WarningPopover';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import {SilencedError} from "../../../exceptions/errors";
import classes from 'classnames';
import update from "immutability-helper";
import MobileVersion from './PostMobile';
import { MOBILE_VERSION } from '../../../actions/app';
import { userIsItemOwner } from '../../../helpers/permissions';
import {I18n} from 'react-redux-i18n';
import {
  addToFavorites,
  removeFromFavorites,
} from '../../../actions/posts';
import {Link} from "react-router-dom";

class PostContainer extends Component {
  constructor(props, context) {
    super(props, context);

      const data = props.location.state && props.location.state.data
        ? props.location.state.data
        : null;

    this.state = {
      isLoaded: !!data,
      data,
      isAddingToFavorites: false,
      isRemovingFromFavorites: false,
      textOver: false,
    };

    this.actionButtons = this.actionButtons.bind(this);
  }

  componentDidMount() {
      if( ! this.state.data) {
          const {
              match: {params: {postId: postRoute}},
          } = this.props;

          const postId = postRoute.split('-').pop();

          const {
              dispatch,
              accessToken,
          } = this.props;

          this.postFetcher = dispatch(
              fetchAuthorizedApiRequest(`/v1/posts/${postId}`, {
                  ...(accessToken ? {
                      headers: {
                          'Authorization': `Bearer ${accessToken}`,
                      },
                  } : {})
              })
          );

          this.postFetcher
              .then(response => {
                  switch(response.status) {
                      case 200:

                          return response.json();

                      default:

                          return Promise.reject(
                              new SilencedError('Failed to fetch post.')
                          );
                  }
              })
              .then(data => {
                  this.setState({data});
                  return Promise.resolve();
              })
              .finally(() => {
                  if ( ! this.postFetcher.isCancelled()) {
                      this.setState({
                          isLoaded: true,
                      });
                  }
              });
      }
  }

  componentWillUnmount() {
    if (this.postFetcher instanceof Promise) {
      this.postFetcher.cancel();
    }

    if (this.toggleFavoriteStatusFetcher instanceof Promise) {
      this.toggleFavoriteStatusFetcher.cancel();
    }
  }

  actionButtons() {
    const {
      dispatch,
      accessToken,
      isAuthenticated,
      match: {params: {postId: postRoute}},
      history,
      user,
    } = this.props;

    const postId = postRoute.split('-').pop();

    const {
      isAddingToFavorites,
      isRemovingFromFavorites,
      data,
      data: {
        favorite,
        postedLike,
        owner
      },
      textOver,
    } = this.state;


    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isAddingToFavorites) {
      text = I18n.t('general.elements.unFolow')
    }


    const accountIsConfirmed = user.confirmed || false;
    const isPostOwner = isAuthenticated
      && userIsItemOwner(user, postedLike, owner);

    const removeFromFavoritesButton = (
      <button
        key="RemoveFromFavorites"
        className={classes('btn btn-red', {
          "inTransition": isRemovingFromFavorites,
          "isNotGoing": !isRemovingFromFavorites
        })}
        onMouseOver={() => this.setState({ textOver: true })}
        onMouseOut={() => this.setState({ textOver: false })}
        onClick={() => {
          if (!isRemovingFromFavorites) {
            this.setState({
              isRemovingFromFavorites: true,
            }, () => {
              this.toggleFavoriteStatusFetcher =
                dispatch(
                  removeFromFavorites(
                    accessToken,
                    postId
                  )
                );

              this.toggleFavoriteStatusFetcher
                .then(() => {
                  this.setState({
                    isRemovingFromFavorites: false,
                    data: update(data, {
                      favorite: {
                        $set: false
                      }
                    }),
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
           if (accountIsConfirmed){
            if (isAuthenticated) {
              if (!isAddingToFavorites) {
                this.setState({
                  isAddingToFavorites: true,
                }, () => {
                  this.toggleFavoriteStatusFetcher =
                    dispatch(
                      addToFavorites(
                        accessToken,
                        postId
                      )
                    );

                  this.toggleFavoriteStatusFetcher
                    .then(() => {
                      this.setState({
                        isAddingToFavorites: false,
                        data: update(data, {
                          favorite: {
                            $set: true
                          }
                        }),
                      });
                    });
                });
              }
            }
           } else {
              if(!isAuthenticated)
              history.push('/login', {from: `blog/post/${postRoute}`});
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

    if(!isPostOwner) {
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
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return Post;
    }
  }

  render () {
    const {
      isLoaded,
      data,
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

    const tagsList = data.tags.map(({tag, slug}, i) => (
      <Link
        to={`/blog/tag/${slug}`}
        className={s.tag}
        key={i}
      >
        {tag}
      </Link>
    ));

    const Post = this.getListItem();

    return (
      <Post
        data={data}
        actionButtonsList={this.actionButtons()}
        tags={tagsList}
        postHasTags={!!tagsList.length}
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
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PostContainer)));
