import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './PlacesList.scss';
import Layout from '../../../../components/_layout/Layout';
import PlacesListContainer from './PlacesList';
import { connect } from 'react-redux';

const PlacesListSinglePage = proName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('agent.placesEditProfile')} {I18n.t('help.by')}{' '}
      {proName.proName.firstName} {proName.proName.lastName}
    </h4>
    <PlacesListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    proName: state.user.profDetails
  };
}

export { PlacesListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(PlacesListSinglePage));
