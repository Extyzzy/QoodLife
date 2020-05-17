import React, { Component } from "react";
import { connect } from "react-redux";
import { isEqual } from "lodash";
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import moment from 'moment';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PostsList.scss";
import Loader from "../../../../../components/Loader";
import ComponentsList from "../../../../../components/ComponentsList";
import PostsListItem from "../../../../../pages/_blog/Blog/components/ListItem";
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";

import {
  clearPosts,
  fetchPostsWithStore,
  loadMorePostsUsingStore,
} from "../../../../../actions/posts";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {FILTER_OWNED} from "../../../../../helpers/filter";

class PostsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

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
      navigation,
      ownerID,
    } = this.props;

    const {navigation: nextNavigation} = nextProps;

    if (!isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchPostsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
            __GET: {
              user: ownerID,
              role: 'place',
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
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

  fetchPostsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      ownerID,
    } = this.props;


    this.fetchPostsListFetcher = dispatch(
      fetchPostsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            user: ownerID,
            role: 'place',
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
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

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      postsList,
      ownerID,
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
              user: ownerID,
              role: 'place',
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
      postsList,
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const {isLoaded} = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!postsList && !!postsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
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
                            showOwnerDetails={false}
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
                  actionButtons={
                    this.listItemActionButtons
                  }
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
    accessToken: state.auth.accessToken,
    isFetching: state.posts.isFetching,
    loadingMore: state.posts.loadingMore,
    couldLoadMore: state.posts.couldLoadMore,
    postsList: state.posts.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PostsList)));
