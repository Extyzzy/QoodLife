import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import policies from 'bundle-loader?lazy!./policies';
import privacy from 'bundle-loader?lazy!./privacy';
import usingTerms from 'bundle-loader?lazy!./usingTerms';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const policiesBundle = Bundle.generateBundle(policies);
const privacyBundle = Bundle.generateBundle(privacy);
const usingTermsBundle = Bundle.generateBundle(usingTerms);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class PrivacyPolicySwitch extends React.PureComponent {
  render() {

    return (
      <Switch>
        <Route path="/policies" exact component={policiesBundle} />
        <Route path="/policies/using-terms" component={usingTermsBundle} />
        <Route path="/policies/privacy-policy" component={privacyBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(PrivacyPolicySwitch);
