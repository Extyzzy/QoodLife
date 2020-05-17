import React from 'react';
import { Switch, Route, withRouter } from 'react-router';

import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadPublicProfile from 'bundle-loader?lazy!./PublicProfile';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const PublicProfileBundle = Bundle.generateBundle(loadPublicProfile);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class PublicProfileSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/member/:userId" exact component={PublicProfileBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(PublicProfileSwitch);
