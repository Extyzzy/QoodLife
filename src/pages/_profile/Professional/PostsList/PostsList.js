import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PostsList.scss';
import Loader from '../../../../components/Loader';
import ComponentsList from '../../../../components/ComponentsList';
import { FILTER_OWNED } from '../../../../helpers/filter';
import PostsListItem from '../../../../pages/_blog/Blog/components/ListItem';
import {
  fetchPostsWithStore,
  loadMorePostsUsingStore
} from '../../../../actions/posts';
import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../constants';
import { I18n } from 'react-redux-i18n';

class PostsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.fetchPostsList();
  }

  componentWillUnmount() {
    if (this.fetchPostsListFetcher instanceof Promise) {
      this.fetchPostsListFetcher.cancel();
    }
  }

  fetchPostsList() {
    const { dispatch, accessToken, navigation } = this.props;

    this.fetchPostsListFetcher = dispatch(
      fetchPostsWithStore(accessToken, {
        navigation,
        group: FILTER_OWNED,
        __GET: {
          role: 'professional',
          take: DEFAULT_NOF_RECORDS_PER_PAGE,
        }
      })
    );

    this.fetchPostsListFetcher.finally(() => {
      if (!this.fetchPostsListFetcher.isCancelled()) {
        this.setState({
          isLoaded: true
        });
      }
    });
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      postsList
    } = this.props;

    if (!loadingMore) {
      dispatch(
        loadMorePostsUsingStore(accessToken, {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            before: this.createdAt.unix(),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            skip: postsList.length,
            role: 'professional'
          }
        })
      );
    }
  }

  render() {
    const { postsList, isFetching, loadingMore, couldLoadMore } = this.props;
    if (isFetching) {
      return <Loader />;
    }

    return (
      <div>
        {(!!postsList.length && (
          <ComponentsList
            component={PostsListItem}
            list={postsList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('blog.postsNotFound')}
        {couldLoadMore && (
          <div className="text-center">
            <button
              className="btn btn-default"
              disabled={loadingMore}
              onClick={this.loadMore}
            >
              {loadingMore
                ? I18n.t('general.elements.loading')
                : I18n.t('general.elements.loadMore')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    loadingMore: state.posts.loadingMore,
    couldLoadMore: state.posts.couldLoadMore,
    postsList: state.posts.list,
    isFetching: state.posts.isFetching
  };
}

export default connect(mapStateToProps)(withStyles(s)(PostsList));
