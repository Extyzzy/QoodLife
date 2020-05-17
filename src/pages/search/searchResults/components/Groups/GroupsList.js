import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import GroupsListItem from '../../../../_groups/Groups/components/ListItem';
import s from "../../SearchResults.scss";

const GroupsList = ({
  list,
  isLoaded,
  itemPopupActionButtonsGroups
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={GroupsListItem}
          list={list}
          showOwnerDetails
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          popupActionButtons={itemPopupActionButtonsGroups}
          actionButtons={
            this.listItemActionButtons
          }
        />
      )) || I18n.t('groups.groupsNotFound')
    }
  </div>
);

export default withStyles(s)(GroupsList);
