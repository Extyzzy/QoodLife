import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from './GroupsList.scss';
import Layout from '../../../../components/_layout/Layout';
import GroupsListContainer from './GroupsList';
import { connect } from 'react-redux';

const GroupsListSinglePage = memberName => (
  <Layout hasSidebar whichSidebar="My Profile" contentHasBackground>
    <h4>
      {I18n.t('groups.groupsEditProfile')} {I18n.t('help.by')}{' '}
      {memberName.memberName}
    </h4>
    <GroupsListContainer />
  </Layout>
);

function mapStateToProps(state) {
  return {
    memberName: state.user.fullName
  };
}

export { GroupsListSinglePage as EventWithoutStyles };
export default connect(mapStateToProps)(withStyles(s)(GroupsListSinglePage));
