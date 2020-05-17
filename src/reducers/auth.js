import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  CLEAR_LOGIN_ERRORS,
  REFRESH_ACCESS_TOKEN_SUCCESS,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  CLEAR_SIGNUP_ERRORS,
} from '../actions/user';

export default function auth(state = {
  isAuthenticated: false,
  loginIsFetching: false,
  signUpIsFetching: false,
}, action) {
  switch (action.type) {
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        loginIsFetching: true,
        isAuthenticated: false,
      });
    case LOGIN_SUCCESS:
      return Object.assign({}, state, {
        loginIsFetching: false,
        isAuthenticated: true,
        loginErrors: null,
        accessToken: action.accessToken,
        accessTokenExpiresOn: action.accessTokenExpiresOn,
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        loginIsFetching: false,
        isAuthenticated: false,
        loginErrors: action.errors,
      });
    case CLEAR_LOGIN_ERRORS:
      return Object.assign({}, state, {
        loginErrors: null,
      });
    case REFRESH_ACCESS_TOKEN_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: true,
        accessToken: action.accessToken,
        accessTokenExpiresOn: action.accessTokenExpiresOn,
      });
    case SIGNUP_REQUEST:
      return Object.assign({}, state, {
        signUpIsFetching: true,
      });
    case SIGNUP_SUCCESS:
      return Object.assign({}, state, {
        signUpIsFetching: false,
        isAuthenticated: true,
        signUpErrors: null,
        accessToken: action.accessToken,
        accessTokenExpiresOn: action.accessTokenExpiresOn,
      });
    case SIGNUP_FAILURE:
      return Object.assign({}, state, {
        signUpIsFetching: false,
        signUpErrors: action.errors,
      });
    case CLEAR_SIGNUP_ERRORS:
      return Object.assign({}, state, {
        signUpErrors: null,
      });
    default:
      return state;
  }
}
