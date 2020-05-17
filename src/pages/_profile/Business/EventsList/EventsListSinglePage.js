import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './EventsList.scss';
import Layout from '../../../../components/_layout/Layout';
import EventsListContainer from './EventsList';
import { connect } from 'react-redux';

const EventsListSinglePage = placeName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('events.eventsEditProfile')} {I18n.t('help.by')}{' '}
      {placeName.placeName.name}
    </h4>
    <EventsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    placeName: state.user.placeDetails
  };
}

export { EventsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(EventsListSinglePage));
