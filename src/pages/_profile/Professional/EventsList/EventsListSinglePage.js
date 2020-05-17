import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './EventsList.scss';
import Layout from '../../../../components/_layout/Layout';
import EventsListContainer from './EventsList';
import { connect } from 'react-redux';

const EventsListSinglePage = proName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('events.eventsEditProfile')} {I18n.t('help.by')}{' '}
      {proName.proName.firstName} {proName.proName.lastName}
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
