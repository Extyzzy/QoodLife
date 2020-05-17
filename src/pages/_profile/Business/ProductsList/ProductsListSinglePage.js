import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './ProductsList.scss';
import Layout from '../../../../components/_layout/Layout';
import ProductsListContainer from './ProductsList';
import { connect } from 'react-redux';

const ProductsListSinglePage = placeName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('products.productsEditProfile')} {I18n.t('help.by')}{' '}
      {placeName.placeName.name}
    </h4>
    <ProductsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    placeName: state.user.placeDetails
  };
}

export { ProductsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(ProductsListSinglePage));
