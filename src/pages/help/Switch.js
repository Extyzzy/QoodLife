import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import about from 'bundle-loader?lazy!./help';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const helpBundle = Bundle.generateBundle(about);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class HelpsSwitch extends React.PureComponent {
  render() {

    return (
      <Switch>
        <Route path="/help" exact component={helpBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(HelpsSwitch);
