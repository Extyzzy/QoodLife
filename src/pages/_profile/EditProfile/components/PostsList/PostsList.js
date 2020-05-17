import React, {Component} from "react";
import {connect} from "react-redux";
import {isEqual} from "lodash";
import moment from 'moment';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PostsList.scss";
import Loader from "../../../../../components/Loader";
import ComponentsList from "../../../../../components/ComponentsList";
import PostsListItem from "../../../../../pages/_blog/Blog/components/ListItem";
import { settingsForListitem } from "../../../../../components/_carousel/SliderSettingsMobile";
import {FILTER_OWNED} from "../../../../../helpers/filter";
import CreatePostButton from "../../../../_blog/Blog/components/CreatePostButton";
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';

import { MOBILE_VERSION, DESKTOP_VERSION } from '../../../../../actions/app';
import {
  clearPosts,
  deletePost,
  fetchPostsWithStore,
  receiveDeletePost,
  loadMorePostsUsingStore,
} from "../../../../../actions/posts";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import classes from "classnames";
import {SilencedError} from "../../../../../exceptions/errors";

class PostsList extends Component {
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
    const {dispatch} = this.props;

    dispatch(
      clearPosts()
    );
  }

  componentDidMount() {
    this.fetchPostsList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      role
    } = this.props;

    const {
      navigation: nextNavigation,
      notificationsList: nextNotificationsList
    } = nextProps;

    if ( ! isEqual(role, nextProps.role)) {
      dispatch(
        fetchPostsWithStore(
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
    if (this.fetchPostsListFetcher instanceof Promise) {
      this.fetchPostsListFetcher.cancel();
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

  fetchPostsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      role
    } = this.props;

    this.fetchPostsListFetcher = dispatch(
      fetchPostsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            role: role,
            ids: this.notificationsIds(),
          },
        }
      )
    );

    this.fetchPostsListFetcher
      .finally(() => {
        if (!this.fetchPostsListFetcher.isCancelled()) {
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
   * @param _this Reference to PostsListItem
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }

  /**
   * Define ListItem action buttons array.
   *
   * @param _this Reference to PostsListItem
   * @returns {[XML]}
   */
  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      history,
      role,
      promotion,
      demo,
    } = this.props;

    const {
      isRemoving,
    } = _this.state;

    const {
      id: postId,
      status,
    } = _this.props.data;

    let buttons = [
      <button
        key="EditPost"
        className='edit round-button'
        onClick={() => { history.push(`/blog/edit/${postId}`, {data: _this.props.data, role: role});}}
      />,
      <button
        key="RemovePost"
        className='remove round-button'
        onClick={() => {
          confirm(I18n.t('blog.confirmDeletepost'))
            .then(() => {
              if (!isRemoving) {
                _this.setState({
                  isRemoving: true,
                }, () => {
                  _this.removeFetcher = dispatch(
                    deletePost(
                      accessToken,
                      postId
                    )
                  );

                  _this.removeFetcher
                    .then(() => {
                      _this.setState({
                        isRemoving: false,
                      }, () => {
                        dispatch(
                          receiveDeletePost(postId)
                        );
                      });
                    });
                });
              }
            });
        }}
      />,
    ];

    if (!demo && !_this.props.data.public) {
      buttons.push(
        <button
          key="Activate"
          className={classes(s.activate, {
            [s.pending]: status.pending === 'sent not-confirmed',
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/posts/${postId}/pending`, {
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
                  case 200:
                    status.pending = 'sent not-confirmed';
                    _this.forceUpdate();
                    return;

                  case 403:
                    return history.push(`/profile/ads`);

                  default:

                    return Promise.reject(
                      new SilencedError('Failed to fetch activate the product.')
                    );
                }
              })
          }}
        >

          {
            (status.pending === 'sent not-confirmed' &&(
              I18n.t('products.pending')
            )) || (
              I18n.t('products.activate')
            )
          }

        </button>,
      )
    }

    if (promotion && _this.props.data.public) {
      buttons.push(
        <button
          key="Promotion"
          className={classes(s.activate, {
            [s.pending]: status.promotion,
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/posts/promotions?post=${postId}`, {
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
        </button>
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
      postsList,
      role,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMorePostsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: postsList.length,
              role: role,
              ids: this.notificationsIds(),
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
      postsList,
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

    const {isLoaded} = this.state;
    const routeLink = (role === 'place') ? 'business' : 'professional';

    return (
      <div className={classes({
        [s.root]: uiVersion === DESKTOP_VERSION,
        [s.rootMobile]: uiVersion === MOBILE_VERSION
      })}>
        <div className={s.head}>
          <h4>{I18n.t('blog.postsEditProfile')}</h4>
          {
            isMobile && (
              (match.path !== `/profile/${routeLink}/posts`) && (
                <button
                  className={s.seeAll}
                  onClick={() => history.push(`/profile/${routeLink}/posts`)}
                >
                  {I18n.t('administration.menuDropDown.showAll')}
                </button>
              )
            )
          }
          <CreatePostButton role={role} isMobile={isMobile} />
        </div>
        
        {
          isLoaded && (
            (!!postsList && !!postsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  beforeChange={(prevIndex, nextIndex) => {
                    if(totalNrOfItems > postsList.length && nextIndex+1 === postsList.length) {
                      this.loadMore();
                    }
                  }}
                  {...settingsForListitem}
                >
                  {
                    postsList.map(item => {
                      return (
                        <div key={`${item.key}_${item.id}`}>
                          <PostsListItem
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
                  list={postsList}
                  component={PostsListItem}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  showOwnerDetails={false}
                  notificationsList={notificationsList}
                  actionButtons={this.listItemActionButtons}
                  setViewedNotification={setViewedNotification}
                />
            ))) || I18n.t('blog.postsNotFound')
          )
        }

        {
          couldLoadMore && (
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
    isFetching: state.posts.isFetching,
    loadingMore: state.posts.loadingMore,
    couldLoadMore: state.posts.couldLoadMore,
    totalNrOfItems: state.groups.totalNrOfItems,
    postsList: state.posts.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    promotion: state.app.promotion,
    demo: state.app.demo,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PostsList)));
