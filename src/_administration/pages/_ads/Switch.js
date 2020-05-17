import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadAds from 'bundle-loader?lazy!./ads';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const AdsBundle = Bundle.generateBundle(loadAds);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class AdsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/ads" exact component={AdsBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default AdsSwitch;
