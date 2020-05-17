import React from "react";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ComponentsList from "../../../../../components/ComponentsList";
import ProductsListItem from '../../../../_products/Products/components/ListItem';
import s from "../../SearchResults.scss";

const ProductsList = ({
  list,
  isLoaded,
}) => (
  <div>
    {
      (list && isLoaded && (
        <ComponentsList
          component={ProductsListItem}
          list={list}
          onComponentWillUnmount={
            this.onListItemComponentWillUnmount
          }
          actionButtons={
            this.listItemActionButtons
          }
          showOwnerDetails
        />
      )) || I18n.t('products.productsNotfound')
    }
  </div>
);

export default withStyles(s)(ProductsList);
