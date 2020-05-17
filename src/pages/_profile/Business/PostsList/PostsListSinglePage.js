import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './PostsList.scss';
import Layout from '../../../../components/_layout/Layout';
import PostsListContainer from './PostsList';
import { connect } from 'react-redux';

const PostsListSinglePage = placeName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('blog.postsEditProfile')} {I18n.t('help.by')}{' '}
      {placeName.placeName.name}
    </h4>
    <PostsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    placeName: state.user.placeDetails
  };
}

export { PostsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(PostsListSinglePage));
