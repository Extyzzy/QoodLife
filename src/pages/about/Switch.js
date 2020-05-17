import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import about from 'bundle-loader?lazy!./about';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const aboutBundle = Bundle.generateBundle(about);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class AboutSwitch extends React.PureComponent {
  render() {

    return (
      <Switch>
        <Route path="/about" exact component={aboutBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(AboutSwitch);
