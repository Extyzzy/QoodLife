import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadExcel from 'bundle-loader?lazy!./Excel';
import loadEditPlaceExcel from 'bundle-loader?lazy!./EditPlace';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const ExcelBundle = Bundle.generateBundle(loadExcel);
const EditPlaceBundle = Bundle.generateBundle(loadEditPlaceExcel);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class PlacesSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/excel" exact component={ExcelBundle} />
        <Route path="/administration/excel/edit/:editId" exact component={EditPlaceBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default PlacesSwitch;
