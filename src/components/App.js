import React, { Component } from 'react';
import PropTypes from 'prop-types';
import config from '../config'
import { Switch, Route, withRouter } from 'react-router';
import { connect, Provider as ReduxProvider } from 'react-redux';
import {
  fetchInitialState,
  MOBILE_VERSION,
  DESKTOP_VERSION,
  switchUIVersion,
  getClientDetails
} from '../actions/app';

import { PrivateRoute } from "../core/Router";
import Loader from './Loader';
import Bundle from '../core/Bundle';
/* eslint-disable */
import PageNotFound from 'bundle-loader?lazy!../pages/_errors/PageNotFound';
import Home from 'bundle-loader?lazy!../pages/Home';
import PlacesAndPros from 'bundle-loader?lazy!../pages/PlacesAndPros/PlacesAndProsContainer';
/* eslint-enable */


import AdministrationLayout from '../_administration/components/_layout/Layout';
import ProfileSwitch from '../pages/_profile/Switch';
import BlogSwitch from '../pages/_blog/Switch';
import EventsSwitch from '../pages/_events/Switch';
import { AuthRoutes } from '../pages/_auth/Switch';
import GroupsSwitch from '../pages/_groups/Switch';
import ProductsSwitch from '../pages/_products/Switch';
import PlacesSwitch from '../pages/_places/Switch';
import ProfessionalsSwitch from '../pages/_professionals/Switch';
import HobbiesSwitch from '../pages/_hobbies/Switch';
import PoliciesSwitch from '../pages/policies/Switch';
import AboutSwitch from '../pages/about/Switch';
import HelpSwitch from '../pages/help/Switch';
import SearchOptionsSwitch from '../pages/search/Switch';
import MemberSwitch from '../pages/_memberPublicProfile/Switch';
import {getCurrentPositionByIp} from "../helpers/geo";
import ForbiddenCountries from '../pages/_errors/ForbiddenCountries';

const PageNotFoundBundle = Bundle.generateBundle(PageNotFound);
const HomeBundle = Bundle.generateBundle(Home);
const PlacesAndProsBundle = Bundle.generateBundle(PlacesAndPros);

const ContextType = {
  // Enables critical path CSS rendering
  // https://github.com/kriasoft/isomorphic-style-loader
  insertCss: PropTypes.func.isRequired,
  // Integrate Redux
  // http://redux.js.org/docs/basics/UsageWithReact.html
  ...ReduxProvider.childContextTypes,
};

export const determineUIVersion = () => {
  if (window.innerWidth <= 768) {
    return MOBILE_VERSION;
  }

  return DESKTOP_VERSION;
};

class App extends Component {
  static propTypes = {
    context: PropTypes.shape(ContextType),
    store: PropTypes.any,
  };

  static defaultProps = {
    context: null,
  };

  static contextTypes = {
    router: PropTypes.any,
    store: PropTypes.any,
  };

  static childContextTypes = ContextType;

  constructor(props, context) {
    super(props, context);

    this.state = {
      countryCode: null
    };

    this.handleResize = this.handleResize.bind(this);
  }

  getChildContext() {
    const { context } = this.props;
    const { staticContext } = this.context.router;

    return context || staticContext;
  }

  componentWillMount() {
    const { dispatch } = this.props;

    this.switchUIVersionIfNeeded();

    dispatch(
      fetchInitialState()
    );
  }

  componentDidMount() {
    const { dispatch } = this.props;
      getCurrentPositionByIp().then(({ countryCode, city, lat, lon, zip }) => {
        this.setState({ countryCode });
        dispatch(
          getClientDetails(
            {
              city,
              lat,
              lon,
              zip
            }
          )
        );
      });

    window.addEventListener('resize', this.handleResize);
    window.ga('create', config.googleAnalyticsKey, 'auto');
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  setPageAndSendToGA(url) {
    window.ga('set', 'page', url);
    window.ga('send', 'pageview');
  };

  trackGoogleAnalytics(location) {
    if (window.ga) {
      let url = location.pathname;
      this.setPageAndSendToGA(url);
    }
  };

  switchUIVersionIfNeeded() {
    const {
      UIVersion,
      dispatch,
    } = this.props;

    const DUIVersion = determineUIVersion();

    if (UIVersion !== DUIVersion) {
      dispatch(
        switchUIVersion(
          DUIVersion
        )
      );
    }
  }

  handleResize(e) {
    this.switchUIVersionIfNeeded();
  }

  routes() {
    const {
      countryCode,
    } = this.state;

    let routes = [];

    if (countryCode === `MD`) {
      return AuthRoutes
    } else {
      routes.push(
        <Route
          key="login"
          path="/login"
          exact
          component={ForbiddenCountries}
        />
      )
    }

    return routes;
  }

  render() {
    const {
      isFetching,
      isAuthenticated,
      location
    } = this.props;

    const {
      countryCode
    } = this.state;

    if (isFetching || ! countryCode) {
      return (
        <Loader />
      );
    }
    this.trackGoogleAnalytics(location);

    return (
      <Switch>
        <Route path="/" exact component={HomeBundle} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/administration" component={AdministrationLayout} />
        <PrivateRoute isAuthenticated={isAuthenticated} path="/profile" component={ProfileSwitch} />
        <Route path="/products" component={ProductsSwitch} />,
        <Route path="/events" component={EventsSwitch} />,
        <Route path="/blog" component={BlogSwitch} />
        <Route path="/places" component={PlacesSwitch} />
        <Route path="/professionals" component={ProfessionalsSwitch} />
        <Route path="/policies" component={PoliciesSwitch} />
        <Route path="/about" component={AboutSwitch} />
        <Route path="/help" component={HelpSwitch} />
        <Route path="/member" component={MemberSwitch} />
        <Route path="/hobbies" component={HobbiesSwitch} />,
        <Route path="/places-and-pros" exact component={PlacesAndProsBundle} />,
        <Route path="/groups" component={GroupsSwitch} />,
        <Route path="/search" component={SearchOptionsSwitch} />,
        {this.routes()}
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    isFetching: store.app.isFetching,
    isAuthenticated: store.auth.isAuthenticated,
    userType: store.user.roles,
    demo: store.app.demo,
    policy: store.app.policy,
    userInfo: store.app.userInfoFetched
  };
}

export default withRouter(connect(mapStateToProps)(App));
