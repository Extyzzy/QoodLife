import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from "react-redux-i18n";
import s from './ProductsList.scss';
import Layout from '../../../../../components/_layout/Layout';
import ProductsListContainer from './ProductsList';

const ProductsListSinglePage = () => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <h4>{I18n.t('products.favoriteProducts')}</h4>
    <ProductsListContainer />
  </Layout>
);

export { ProductsListSinglePage as EventWithoutStyles };
export default withStyles(s)(ProductsListSinglePage);
