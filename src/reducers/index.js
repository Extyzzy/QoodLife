import { combineReducers } from 'redux';
import { LOGOUT } from '../actions/user';
import { pick } from 'lodash';

import app from './app';
import auth from './auth';
import runtime from './runtime';
import adsModule from './adsModule';
import navigation from './navigation';
import user from './user';
import hobbies from './hobbies';
import events from './events';
import calendar from './calendar'
import places from './places';
import professionals from './professionals';
import groups from './groups';
import products from './products';
import posts from './posts';
import brands from './brands';
import positions from './positions';
import genders from './genders';
import languages from './languages';
import notifications from './notifications';
import blogLanguages from './blogLanguages';
import socialMediaTypes from './socialMediaTypes';
import roles from './roles';
import timeline from './timeline';
import { i18nReducer as i18n } from 'react-redux-i18n';

const combinedReducers = combineReducers({
  app,
  auth,
  runtime,
  navigation,
  adsModule,
  notifications,
  user,
  hobbies,
  events,
  calendar,
  places,
  professionals,
  groups,
  products,
  posts,
  brands,
  positions,
  genders,
  languages,
  blogLanguages,
  socialMediaTypes,
  roles,
  timeline,
  i18n,
});

/**
 * Extend combined reducers and define a global action
 * LOGOUT that will reset app state on user Logout.
 *
 * @param state
 * @param action
 * @returns {any}
 */
export default (state, action) => {
  if (action.type === LOGOUT) {
    state = Object.assign({}, {}, pick(state, ['app', 'hobbies', 'i18n', 'languages']));
  }

  return combinedReducers(state, action);
};
