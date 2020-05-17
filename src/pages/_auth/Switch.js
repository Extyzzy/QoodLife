import React from 'react';
import { Route } from 'react-router';

import Bundle from '../../core/Bundle';

/* eslint-disable */
import loadSignUp from 'bundle-loader?lazy!./SignUp';
import loadConfirmAccount from 'bundle-loader?lazy!./ConfirmAccount';
import loadResetAccount from 'bundle-loader?lazy!./ResetPassword';
import loadResetSuccessAccount from 'bundle-loader?lazy!./ResetPassword/ResetPasswordSucces';
/* eslint-enable */
import LoginComponent from './Login';
import LogoutComponent from './Logout';

const SignUpBundle = Bundle.generateBundle(loadSignUp);
const ConfirmAccountBundle = Bundle.generateBundle(loadConfirmAccount);
const ResetAccountBundle = Bundle.generateBundle(loadResetAccount);
const ResetSuccessAccountBundle = Bundle.generateBundle(loadResetSuccessAccount);

export const AuthRoutes = [
  <Route
    key="login"
    path="/login"
    exact
    component={LoginComponent}
  />,
  <Route
    key="logout"
    path="/logout"
    exact
    component={LogoutComponent}
  />,
  <Route
    key="signup"
    path="/signup"
    exact
    component={SignUpBundle}
  />,
  <Route
    key="confirm-account"
    path="/account/confirm/:token"
    exact
    component={ConfirmAccountBundle}
  />,
  <Route
    key="reset-password"
    path="/resetPassword"
    exact
    component={ResetAccountBundle}
  />,
  <Route
    key="reset-success"
    path="/reset-password/:userId/:recordId"
    exact
    component={ResetSuccessAccountBundle}
  />,
];
