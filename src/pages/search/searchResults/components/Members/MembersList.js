import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import MembersListItem from './components/ListItem';
import s from "../../SearchResults.scss";

const MembersList = ({
  list,
  isLoaded,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={MembersListItem}
          list={list}
          showOwnerDetails
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          actionButtons={
            this.listItemActionButtons
          }
        />
      )) || I18n.t('events.eventsNotFound')
    }
  </div>
);

export default withStyles(s)(MembersList);
