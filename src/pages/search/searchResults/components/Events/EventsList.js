import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import EventsListItem from '../../../../_events/Events/components/ListItem';
import s from "../../SearchResults.scss";

const EventsList = ({
  list,
  isLoaded,
  itemPopupActionButtonsForEvents,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={EventsListItem}
          list={list}
          popupActionButtons={itemPopupActionButtonsForEvents}
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

export default withStyles(s)(EventsList);
