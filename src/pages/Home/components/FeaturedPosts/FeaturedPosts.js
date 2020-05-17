import React from 'react';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./FeaturedPosts.scss";

import Loader from '../../../../components/Loader';
import PostsSliderContainer from './PostsSliderContainer';

import {I18n} from 'react-redux-i18n';
const FeaturedPosts = ({
  postsList,
  postsAreLoading,
  onItemComponentWillUnmount,
  onItemPopupComponentWillUnmount,
  itemActionButtons,
  itemPopupActionButtons,
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {I18n.t('general.header.blog')}
    </div>

    <div className={s.content}>
    {
      (postsAreLoading && <Loader sm />) || (
        <PostsSliderContainer
          postsList={postsList}
          onComponentWillUnmount={
            onItemComponentWillUnmount
          }
          onPopupComponentWillUnmount={
            onItemPopupComponentWillUnmount
          }
          actionButtons={itemActionButtons}
          popupActionButtons={itemPopupActionButtons}
        />
      )
    }
    </div>
  </div>
);

export default withStyles(s)(FeaturedPosts);
