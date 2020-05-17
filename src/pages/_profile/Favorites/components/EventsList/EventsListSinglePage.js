import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from "react-redux-i18n";
import s from './EventsList.scss';
import Layout from '../../../../../components/_layout/Layout';
import EventsListContainer from './EventsList';

const EventsListSinglePage = () => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <h4>{I18n.t('events.favoriteEvents')}</h4>
    <EventsListContainer />
  </Layout>
);

export { EventsListSinglePage as EventWithoutStyles };
export default withStyles(s)(EventsListSinglePage);
