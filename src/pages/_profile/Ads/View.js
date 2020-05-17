import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../../components/_layout/Layout/Layout';
import Tabs from "../../../components/Tabs/Tabs";
import s from './Ads.scss';

const View = ({
  activeTabItemIndex,
  tabsOptions,
  setActiveTab,
}) => (
  <Layout
    hasSidebar
    whichSidebar='My Profile'
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.plansTab}>
        <Tabs
          items={tabsOptions}
          activeItemIndex={activeTabItemIndex}
          onChange={setActiveTab}
        />
      </div>
    </div>
  </Layout>
);

export default withStyles(s)(View);
