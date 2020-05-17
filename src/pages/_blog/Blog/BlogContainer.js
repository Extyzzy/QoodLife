import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';
import moment from 'moment';
import { fetchAdsBlocks, loadMoreAdsBlocks } from '../../../actions/adsModule';
import { MOBILE_VERSION } from '../../../actions/app';
import Blog from './Blog';

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
  DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK
} from '../../../constants';

import {
  fetchPostsWithStore,
  clearPosts,
  loadMorePostsUsingStore,
} from '../../../actions/posts';
import {audience} from "../../../helpers/sideBarAudience";

class BlogContainer extends Component {
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

    if(this.props.UIVersion === MOBILE_VERSION) {
      this.props.dispatch(
        fetchAdsBlocks()
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
      match: {
        params: {
          tag,
        },
      },
    } = this.props;

    const {
      navigation: nextNavigation,
      match: {
        params: {
          tag: nextTag,
        },
      },
    } = nextProps;


    if ( ! isEqual(navigation, nextNavigation) ||
         ! isEqual(tag, nextTag)) {
      dispatch(
        fetchPostsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            __GET: {
              ...(nextTag ? {
                tags: [nextTag],
              } : {}),
              audience: audience(nextNavigation),
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
      match: {
        params: {
          tag,
        },
      },
    } = this.props;

    this.fetchPostsListFetcher = dispatch(
      fetchPostsWithStore(
        accessToken,
        {
          navigation,
          __GET: {
            ...(tag ? {
              tags: [tag],
            } : {}),
            audience: audience(navigation),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
          },
        }
      ),
    );

    this.fetchPostsListFetcher
      .finally(() => {
        if ( ! this.fetchPostsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }

  loadMore(groupIndex = 0) {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      postsList
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMorePostsUsingStore(
          accessToken,
          {
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: postsList.length,
              audience: audience(navigation),
            },
          }
        )
      );

      dispatch(
        loadMoreAdsBlocks(
          {
            navigation,
            __GET: {
              take: DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK,
              skip: groupIndex*3,
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      postsList,
    } = this.props;

    const { isLoaded } = this.state;

    return (
      <Blog
        isFetching={isFetching}
        isLoaded={isLoaded}
        postsList={postsList}
        showItemOwnerDetails={true}
        onLoadMore={this.loadMore}
        showLoadMore={couldLoadMore}
        loadingMore={loadingMore}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    isFetching: state.posts.isFetching,
    loadingMore: state.posts.loadingMore,
    couldLoadMore: state.posts.couldLoadMore,
    postsList: state.posts.list,
    UIVersion: state.app.UIVersion,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(BlogContainer));
