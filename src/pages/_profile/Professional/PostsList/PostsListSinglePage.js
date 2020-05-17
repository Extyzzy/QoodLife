import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './PostsList.scss';
import Layout from '../../../../components/_layout/Layout';
import PostsListContainer from './PostsList';
import { connect } from 'react-redux';

const PostsListSinglePage = proName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('blog.postsEditProfile')} {I18n.t('help.by')}{' '}
      {proName.proName.firstName} {proName.proName.lastName}
    </h4>
    <PostsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    proName: state.user.profDetails
  };
}

export { PostsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(PostsListSinglePage));
