import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './PlacesList.scss';
import Layout from '../../../../components/_layout/Layout';
import PlacesListContainer from './PlacesList';
import { connect } from 'react-redux';

const PlacesListSinglePage = placeName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('agent.placesEditProfile')} {I18n.t('help.by')}{' '}
      {placeName.placeName.name}
    </h4>
    <PlacesListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    placeName: state.user.placeDetails
  };
}

export { PlacesListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(PlacesListSinglePage));
