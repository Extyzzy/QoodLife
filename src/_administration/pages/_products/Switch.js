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

class ProductsSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/products" exact component={ListBundle} />
        <Route path="/administration/products/:productId/promotions" exact component={PromotionsListBundle} />
        <Route path="/administration/products/:productId/promotions/create" exact component={CreatePromotionBundle} />
        <Route path="/administration/products/:productId/promotions/:intervalId/edit" exact component={EditPromotionBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default ProductsSwitch;
