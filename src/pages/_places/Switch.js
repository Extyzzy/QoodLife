import React from 'react';
import { Switch, Route, withRouter } from 'react-router';

import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadPlace from 'bundle-loader?lazy!./Place';
import loadBranch from 'bundle-loader?lazy!./Branch';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const PlaceBundle = Bundle.generateBundle(loadPlace);
const BranchBundle = Bundle.generateBundle(loadBranch);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class PlacesSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/places/:placeId" exact component={PlaceBundle} />
        <Route path="/places/:placeId/branch" exact component={BranchBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(PlacesSwitch);
