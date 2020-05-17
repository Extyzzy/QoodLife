import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import results from 'bundle-loader?lazy!./searchResults';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const resultsBundle = Bundle.generateBundle(results);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class SearchOptionsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/search" exact component={resultsBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(SearchOptionsSwitch);
