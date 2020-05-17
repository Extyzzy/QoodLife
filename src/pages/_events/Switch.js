import React from 'react';
import { Switch, Route, withRouter } from 'react-router';
import { CreateEventRoute } from "../../core/Router";
import { connect } from 'react-redux';
import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadEvents from 'bundle-loader?lazy!./Events';
import loadEvent from 'bundle-loader?lazy!./Event';
import loadEventCreate from 'bundle-loader?lazy!./Create/CreateEvent';
import loadEventEdit from 'bundle-loader?lazy!./Edit';
import loadPageNotFound from 'bundle-loader?lazy!../../pages/_errors/PageNotFound';
import HobbiesSwitch from "../_hobbies/Switch";
import GroupsSwitch from "../_groups/Switch";
import SearchOptionsSwitch from "../search/Switch";
/* eslint-enable */

const EventsBundle = Bundle.generateBundle(loadEvents);
const EventBundle = Bundle.generateBundle(loadEvent);
const EventCreateBundle = Bundle.generateBundle(loadEventCreate);
const EventEditBundle = Bundle.generateBundle(loadEventEdit);
const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class EventsSwitch extends React.PureComponent {

  route() {
    const {
      isAuthenticated,
      userType,
      demo,
    } = this.props;

    const admin = isAuthenticated && !!userType.find(role =>  role.code === 'admin');

    const routes = [];

    if (!!admin || !demo) {
      routes.push(
        <Route key='events' path="/events" exact component={EventsBundle} />
      )
    }

    return routes
  }

  render() {
    const { isAuthenticated, userType } = this.props;

    const userEventsCreate = isAuthenticated && !!userType.find(role =>
      role.code === 'admin' ||
      role.code === 'place' ||
      role.code === 'professional'
    );

    return (
      <Switch>
        {this.route()}
        <CreateEventRoute
          isNotSimpleUser={userEventsCreate}
          isAuthenticated={isAuthenticated}
          path="/events/create"
          component={EventCreateBundle} />
        <CreateEventRoute
          isNotSimpleUser={userEventsCreate}
          isAuthenticated={isAuthenticated}
          path="/events/edit/:eventId"
          component={EventEditBundle} />
        <Route path="/events/:eventId" exact component={EventBundle} />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
    userType: store.user.roles,
    demo: store.app.demo,
  };
}

export default withRouter(connect(mapStateToProps)(EventsSwitch));
