import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadProfessional from 'bundle-loader?lazy!./Professional';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const ProfessionalBundle = Bundle.generateBundle(loadProfessional);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class ProfessionalsSwitch extends React.PureComponent {
  render() {

    return (
      <Switch>
        <Route path="/professionals/:professionalId" exact component={ProfessionalBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}


export default withRouter(ProfessionalsSwitch);
