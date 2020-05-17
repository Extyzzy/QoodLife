import React, { Component } from "react";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Groups.scss';
import CreateGroupButton from '../../_groups/Groups/components/CreateGroupButton';
import Layout from '../../../components/_layout/Layout';
import GroupsList from "./components/GroupsList";

class Groups extends Component {

  render() {

    return (
      <Layout
        hasSidebar
        hasAds
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div className={s.root}>
          <CreateGroupButton />
          <GroupsList />
        </div>
      </Layout>
    );
  }
}

export default withStyles(s)(Groups);
