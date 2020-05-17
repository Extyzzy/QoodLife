import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from "react-redux-i18n";
import s from './ProfessionalsList.scss';
import Layout from '../../../../../components/_layout/Layout';
import ProfessionalsListContainer from './ProfessionalsList';

const ProfessionalsListSinglePage = () => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <h4>{I18n.t('agent.professionalsPlaces')}</h4>
    <ProfessionalsListContainer />
  </Layout>
);

export { ProfessionalsListSinglePage as EventWithoutStyles };
export default withStyles(s)(ProfessionalsListSinglePage);
