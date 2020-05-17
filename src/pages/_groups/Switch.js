import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { PrivateRoute } from "../../core/Router";
import { connect } from 'react-redux';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadGroups from 'bundle-loader?lazy!./Groups';
import loadGroup from 'bundle-loader?lazy!./Group';

import loadGroupCreate from 'bundle-loader?lazy!./Create';
import loadGroupEdit from 'bundle-loader?lazy!./Edit';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const GroupsBundle = Bundle.generateBundle(loadGroups);
const GroupBundle = Bundle.generateBundle(loadGroup);
const GroupCreateBundle = Bundle.generateBundle(loadGroupCreate);
const GroupEditBundle = Bundle.generateBundle(loadGroupEdit);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class GroupsSwitch extends React.PureComponent {
  render() {
    const {isAuthenticated} = this.props;
    return (
      <Switch>
        <Route path="/groups" exact component={GroupsBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/groups/create" component={GroupCreateBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/groups/edit/:groupId" component={GroupEditBundle} />
        <Route path="/groups/:groupId" exact component={GroupBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(GroupsSwitch));
