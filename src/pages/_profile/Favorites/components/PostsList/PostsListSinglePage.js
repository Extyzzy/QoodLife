import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from "react-redux-i18n";
import s from './PostsList.scss';
import Layout from '../../../../../components/_layout/Layout';
import PostsListContainer from './PostsList';

const PostsListSinglePage = () => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <h4>{I18n.t('blog.favoritePosts')}</h4>
    <PostsListContainer />
  </Layout>
);

export { PostsListSinglePage as EventWithoutStyles };
export default withStyles(s)(PostsListSinglePage);
