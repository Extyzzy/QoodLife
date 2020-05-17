import React from 'react';
import { Switch, Route } from 'react-router';

import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadGallery from 'bundle-loader?lazy!./gallery';
import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const GalleryBundle = Bundle.generateBundle(loadGallery);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class GallerySwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route path="/administration/home-gallery" exact component={GalleryBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default GallerySwitch;
