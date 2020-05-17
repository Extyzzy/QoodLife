import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadBrands from 'bundle-loader?lazy!./brands';
import loadBrandForm from 'bundle-loader?lazy!./form';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const BrandsBundle = Bundle.generateBundle(loadBrands);
const AddBrandBundle = Bundle.generateBundle(loadBrandForm);
const EditBrandBundle = Bundle.generateBundle(loadBrandForm);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class AdsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/brands" exact component={BrandsBundle} />
        <Route path="/administration/brands/new" exact component={AddBrandBundle} />
        <Route path="/administration/brands/:brandId" exact component={EditBrandBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default AdsSwitch;
