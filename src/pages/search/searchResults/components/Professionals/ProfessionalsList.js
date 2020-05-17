import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import ProfessionalsListItem from '../../../../_professionals/Professionals/components/ListItem';
import s from "../../SearchResults.scss";

const ProfessionalsList = ({
  list,
  isLoaded,
  itemPopupActionButtonsGroups,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={ProfessionalsListItem}
          list={list}
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          popupActionButtons={itemPopupActionButtonsGroups}
          actionButtons={
            this.listItemActionButtons
          }
          showOwnerDetails
        />
      )) || I18n.t('professionals.professionalsNotfound')
    }
  </div>
);

export default withStyles(s)(ProfessionalsList);
