import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from "react-redux-i18n";
import s from './PlacesList.scss';
import Layout from '../../../../../components/_layout/Layout';
import PlacesListContainer from './PlacesList';

const PlacesListSinglePage = () => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <h4>{I18n.t('agent.favoritePlaces')}</h4>
    <PlacesListContainer />
  </Layout>
);

export { PlacesListSinglePage as EventWithoutStyles };
export default withStyles(s)(PlacesListSinglePage);
