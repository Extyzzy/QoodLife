import React from 'react';
import { Switch, Route } from 'react-router';

import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadList from 'bundle-loader?lazy!./List';
import loadSuspensionsList from 'bundle-loader?lazy!./SuspensionsList';
import loadCreateSuspension from 'bundle-loader?lazy!./CreateSuspension';
import loadEditPlaceList from 'bundle-loader?lazy!./EditPlace';
import loadEditProfessionalList from 'bundle-loader?lazy!./EditProfessional';
import loadEditSuspension from 'bundle-loader?lazy!./EditSuspension';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const ListBundle = Bundle.generateBundle(loadList);
const EditPlaceBundle = Bundle.generateBundle(loadEditPlaceList);
const EditProfessionalBundle = Bundle.generateBundle(loadEditProfessionalList);
const SuspensionsListBundle = Bundle.generateBundle(loadSuspensionsList);
const CreateSuspensionBundle = Bundle.generateBundle(loadCreateSuspension);
const EditSuspensionBundle = Bundle.generateBundle(loadEditSuspension);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class UsersSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/users" exact component={ListBundle} />
        <Route path="/administration/users/place/:placeId" exact component={EditPlaceBundle} />
        <Route path="/administration/users/professional/:professionalId" exact component={EditProfessionalBundle} />
        <Route path="/administration/users/:userId/suspensions" exact component={SuspensionsListBundle} />
        <Route path="/administration/users/:userId/suspensions/create" exact component={CreateSuspensionBundle} />
        <Route path="/administration/users/:userId/suspensions/:intervalId/edit" exact component={EditSuspensionBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default UsersSwitch;
