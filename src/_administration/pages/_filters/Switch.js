import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadFilters from 'bundle-loader?lazy!./filters';
import loadFilterForm from 'bundle-loader?lazy!./form';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const FiltersBundle = Bundle.generateBundle(loadFilters);
const AddFilterBundle = Bundle.generateBundle(loadFilterForm);
const EditFilterBundle = Bundle.generateBundle(loadFilterForm);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class AdsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/filters" exact component={FiltersBundle} />
        <Route path="/administration/filters/new" exact component={AddFilterBundle} />
        <Route path="/administration/filters/:filterId" exact component={EditFilterBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default AdsSwitch;
