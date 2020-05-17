import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './ProfessionalsList.scss';
import Layout from '../../../../components/_layout/Layout/Layout';
import EventsListContainer from './ProfessionalsList';
import { connect } from 'react-redux';

const EventsListSinglePage = proName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('administration.menuDropDown.professionals')}
    </h4>
    <EventsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    proName: state.user.profDetails
  };
}

export { EventsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(EventsListSinglePage));
