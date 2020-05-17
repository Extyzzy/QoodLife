import React from 'react';
import { Switch, Route } from 'react-router';

import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadList from 'bundle-loader?lazy!./List';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const ListBundle = Bundle.generateBundle(loadList);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class GroupsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/groups" exact component={ListBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default GroupsSwitch;
