import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import PlacesListItem from '../../../../_places/Places/components/ListItem';
import s from "../../SearchResults.scss";

const PlacesList = ({
  list,
  isLoaded,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={PlacesListItem}
          list={list}
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          actionButtons={
            this.listItemActionButtons
          }
          showOwnerDetails
        />
      )) || I18n.t('agent.placesNotFound')
    }
  </div>
);

export default withStyles(s)(PlacesList);
