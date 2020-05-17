import React from 'react';
import { Route, Redirect } from 'react-router';

/* eslint-disable */
export const PrivateRoute = ({ component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      isAuthenticated
        ? React.createElement(component, props)
        : (
        <Redirect
          to={{
            pathname: '/login',
            state: { from: props.location },
          }}
        />
    )
  )}
  />
);

export const CreateEventRoute = ({
  component, isNotSimpleUser, isAuthenticated, ...rest
}) => (
  <Route
    {...rest}
    render={props => (
      isNotSimpleUser
        ? React.createElement(component, props)
        : (
          <Redirect
          to={{
            pathname: '/events',
            state: { from: props.location },
          }}
        />
      )
  )}
  />
);

export const GuestRoute = ({ component, isAuthenticated, ...rest }) => (
  <Route
    {...rest} render={props => (
    !isAuthenticated
      ? React.createElement(component, props)
      : (
      <Redirect
        to={{
          pathname: '/',
          state: { from: props.location },
        }}
      />
    )
  )}
  />
);
/* eslint-enable */
