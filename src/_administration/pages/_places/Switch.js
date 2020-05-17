import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadList from 'bundle-loader?lazy!./List';
import loadPromotionsList from 'bundle-loader?lazy!./PromotionsList';
import loadCreatePromotion from 'bundle-loader?lazy!./CreatePromotion';
import loadEditPromotion from 'bundle-loader?lazy!./EditPromotion';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const ListBundle = Bundle.generateBundle(loadList);
const PromotionsListBundle = Bundle.generateBundle(loadPromotionsList);
const CreatePromotionBundle = Bundle.generateBundle(loadCreatePromotion);
const EditPromotionBundle = Bundle.generateBundle(loadEditPromotion);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class PlacesSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/places" exact component={ListBundle} />
        <Route path="/administration/places/:placeId/promotions" exact component={PromotionsListBundle} />
        <Route path="/administration/places/:placeId/promotions/create" exact component={CreatePromotionBundle} />
        <Route path="/administration/places/:placeId/promotions/:intervalId/edit" exact component={EditPromotionBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default PlacesSwitch;
