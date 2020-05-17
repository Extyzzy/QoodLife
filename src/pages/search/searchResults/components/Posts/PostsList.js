import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import PostsListItem from '../../../../_blog/Blog/components/ListItem';
import s from "../../SearchResults.scss";

const PostsList = ({
  list,
  isLoaded,
  itemPopupActionButtonsForPosts,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={PostsListItem}
          list={list}
          showOwnerDetails
          popupActionButtons={itemPopupActionButtonsForPosts}
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          actionButtons={
            this.listItemActionButtons
          }
        />
      )) || I18n.t('posts.postsNotFound')
    }
  </div>
);

export default withStyles(s)(PostsList);
