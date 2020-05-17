import React from 'react';
import { Switch, Route, withRouter } from 'react-router';

import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadHobbies from 'bundle-loader?lazy!./Hobbies';
import loadHobbiesFooter from 'bundle-loader?lazy!./Hobbies_Footer';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
/* eslint-enable */

const HobbiesBundle = Bundle.generateBundle(loadHobbies);
const HobbiesFooterBundle = Bundle.generateBundle(loadHobbiesFooter);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class HobbiesSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/hobbies/footer" exact component={HobbiesFooterBundle} />
        <Route path="/hobbies/:categoryId?" exact component={HobbiesBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default withRouter(HobbiesSwitch);
