import React, { Component } from 'react';
import classes from 'classnames';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';

import Bundle from '../../../../core/Bundle';
import Header from '../Header';
import Sidebar from '../Sidebar/Sidebar';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';

import {
  actionIsAllowed,
  atLeastOneActionIsAllowed,
} from '../../../../helpers/permissions';

/* eslint-disable */
import loadPageNotFound from 'bundle-loader?lazy!../../../../pages/_errors/PageNotFound';
import loadDashboard from 'bundle-loader?lazy!../../../pages/Dashboard';
/* eslint-enable */

import UsersSwitch from '../../../pages/_users/Switch';
import EventsSwitch from '../../../pages/_events/Switch';
import GroupsSwitch from '../../../pages/_groups/Switch';
import ProductsSwitch from '../../../pages/_products/Switch';
import PlacesSwitch from '../../../pages/_places/Switch';
import ProfessionalsSwitch from '../../../pages/_professionals/Switch';
import BlogSwitch from '../../../pages/_blog/Switch';
import BrandsSwitch from '../../../pages/_brands/Switch';
import FiltersSwitch from '../../../pages/_filters/Switch';
import HobbiesSwitch from '../../../pages/_hobbies/Switch';
import AdsSwitch from '../../../pages/_ads/Switch';
import GallerySwitch from '../../../pages/HomeGallery/Switch';
import ExcelSwitch from '../../../pages/_excel/Switch';

const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);
const DashboardBundle = Bundle.generateBundle(loadDashboard);

class Layout extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      sidebarOpen: false,
    };
  }

  render() {
    const {
      permissions,
    } = this.props;

    const {hobbies, ...rest} = permissions;

    /**
     * Improve the way we check if user has access to
     * administration panel.
     */

    if ( ! atLeastOneActionIsAllowed(rest, {
      module: '*',
      action: 'view-all-stored',
    }) &&
    ! actionIsAllowed(permissions, {
      module: 'hobbies',
      action: 'manage-everything',
    })) {
      return (
        <Forbidden />
      );
    }


    const {
      sidebarOpen,
    } = this.state;

    return (
      <div className={s.root}>
        <Sidebar />
        <div
          className={
            classes(
              s.wrap, {
                [s.sidebarOpen]: sidebarOpen,
              }
            )
          }
        >
          <Header
            sidebarToggle={() => {
              this.setState({ sidebarOpen: ! sidebarOpen });
            }}
          />
          <main className={s.content}>
            <Switch>
              <Route path="/administration" exact component={DashboardBundle} />
              <Route path="/administration/brands" component={BrandsSwitch} />
              <Route path="/administration/filters" component={FiltersSwitch} />
              <Route path="/administration/ads" component={AdsSwitch} />
              <Route path="/administration/users" component={UsersSwitch} />
              <Route path="/administration/events" component={EventsSwitch} />
              <Route path="/administration/groups" component={GroupsSwitch} />
              <Route path="/administration/products" component={ProductsSwitch} />
              <Route path="/administration/places" component={PlacesSwitch} />
              <Route path="/administration/excel"  component={ExcelSwitch} />
              <Route path="/administration/blog" component={BlogSwitch} />
              <Route path="/administration/professionals" component={ProfessionalsSwitch} />
              <Route path="/administration/hobbies" component={HobbiesSwitch} />
              <Route patch="/administration/home-gallery" component={GallerySwitch} />
              <Route component={PageNotFoundBundle} />
            </Switch>
          </main>
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    permissions: store.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Layout)));
