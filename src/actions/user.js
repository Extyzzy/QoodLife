import {fetchAuthUserHobbies, fetchHobbies, setHobbies} from './hobbies';
import { InvalidRefreshToken } from '../exceptions/auth';
import { UnprocessableEntity } from '../exceptions/http';
import { fetchApiRequest, fetchAuthorizedApiRequest } from "../fetch";
import { SilencedError } from "../exceptions/errors";
import { fetchNotificationTypes } from './notifications';
import { getDefaultLanguage } from './languages';
import { setLocale } from 'react-redux-i18n';
import moment from 'moment';

import {
  fetchSocialMediaTypes,
  receiveFetchSocialMediaTypes
} from './socialMediaTypes';

/*---------------------- SWITCH USER AVATAR ---------------------*/

export const SWITCH_USER_AVATAR = 'SWITCH_USER_AVATAR';

export function switchUserAvatar(avatar) {
  return {
    type: SWITCH_USER_AVATAR,
    avatar,
  };
}

/*---------------------------- SIGN UP -----------------------------*/

export const SIGNUP_REQUEST = 'SIGNUP_REQUEST';
export const SIGNUP_SUCCESS = 'SIGNUP_SUCCESS';
export const SIGNUP_FAILURE = 'SIGNUP_FAILURE';
export const CLEAR_SIGNUP_ERRORS = 'CLEAR_SIGNUP_ERRORS';
export const SET_INVITED_USERS_LIST = 'SET_INVITED_USERS_LIST';
export const APPENT_USER_TO_INVITED_LIST = 'APPENT_USER_TO_INVITED_LIST';

function requestSignUp() {
  return {
    type: SIGNUP_REQUEST,
    isFetching: true,
  };
}

function receiveSignUp(accessToken, accessTokenExpiresOn) {
  return {
    type: SIGNUP_SUCCESS,
    accessToken,
    accessTokenExpiresOn,
  };
}

function signUpError(errors) {
  return {
    type: SIGNUP_FAILURE,
    errors,
  };
}

export function clearSignUpErrors() {
  return {
    type: CLEAR_SIGNUP_ERRORS,
  };
}

export function setInvitedUsersList(invitedUsers) {
  return {
    type: SET_INVITED_USERS_LIST,
    invitedUsers,
  };
}

export function addNewUserToInvitedList(user) {
  return {
    type: APPENT_USER_TO_INVITED_LIST,
    user,
  }
}

export function fetchUsersThatWasInvitedToBePros(accessToken, dispatch) {
  dispatch(
    fetchAuthorizedApiRequest('/v1/account/invitations/sent', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
  )
    .then(response => {
      switch(response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch personal details.')
          );
      }
    })
    .then(data => {
      dispatch(setInvitedUsersList(data));
      return Promise.resolve();
    })
}

/**
 * Sign up the user using provided information.
 * Automatically authenticate user after a
 * successful registration.
 *
 * Note! This method must be dispatched.
 *
 * @param {FormData} creds
 * @returns {function(*=)}
 */
export function signUpUser(creds) {
  return dispatch => {
    dispatch(requestSignUp());

    return fetchApiRequest('/v1/account/register', {
      method: 'POST',
      credentials: 'include',
      body: creds,
    })
      .then(response => {
        switch(response.status) {
          case 201:

            return response.json().then(({
                                           access_token: accessToken,
                                           expires_in: expiresIn
                                         }) => {
              let now = new Date();
              let expiresOn = now.setSeconds(
                now.getSeconds() + expiresIn
              );

              return {
                accessToken,
                expiresOn,
              };
            });

          case 422:

            return response.json().then(({errors}) => {
              dispatch(signUpError(errors));

              return Promise.reject(
                new UnprocessableEntity()
              );
            });

          default:

            dispatch(signUpError(
              ['Sign up process failed.']
            ));

            return Promise.reject(
              new SilencedError('Sign up process failed.')
            );

        }
      })
      .then(auth => Promise.all([
        auth,
        fetchHobbies(false),
        fetchHobbies(true),
        fetchSocialMediaTypes(),
        dispatch(fetchPersonalData(auth.accessToken)),
      ]))
      .then(([auth, hobbiesData, hobbiesDataMirror, mediaTypes, userData]) => {
        localStorage.setItem('ACCESS_TOKEN', auth.accessToken);
        localStorage.setItem('ACCESS_TOKEN_EXPIRES_ON', auth.expiresOn);

        // Set required data & dispatch the success action
        dispatch(setLocale(userData.language.short));
        moment.locale(userData.language.short);
        dispatch(setHobbies(hobbiesData));
        dispatch(receiveFetchSocialMediaTypes(mediaTypes));
        dispatch(setUserData(userData));

        if(userData.profPending === 'ok') {
          fetchUsersThatWasInvitedToBePros(auth.accessToken, dispatch);
        }

        dispatch(receiveSignUp(
          auth.accessToken,
          auth.expiresOn
        ));

        return Promise.resolve();
      });
  };
}

/*----------------------------- LOGIN ------------------------------*/

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const CLEAR_LOGIN_ERRORS = 'CLEAR_LOGIN_ERRORS';

function requestLogin() {
  return {
    type: LOGIN_REQUEST,
  };
}

export function receiveLogin(accessToken, accessTokenExpiresOn) {
  return {
    type: LOGIN_SUCCESS,
    accessToken,
    accessTokenExpiresOn,
  };
}

function loginError(errors) {
  return {
    type: LOGIN_FAILURE,
    errors,
  };
}

export function clearLoginErrors() {
  return {
    type: CLEAR_LOGIN_ERRORS,
  };
}

/**
 * Log in the user using provided credentials.
 *
 * Note! This method must be dispatched.
 *
 * @param {FormData} creds
 * @param {function(*=)} onAuthFail
 * @returns {function(*=)}
 */
export function loginUser(creds, onAuthFail = null) {
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin());

    return fetchApiRequest('/v1/login', {
      method: 'POST',
      credentials: 'include',
      body: creds,
    })
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json().then(({
               access_token: accessToken,
               expires_in: expiresIn
             }) => {
              localStorage.removeItem('USER_LANGUAGE');
              let now = new Date();
              let expiresOn = now.setSeconds(
                now.getSeconds() + expiresIn
              );

              return {
                accessToken,
                expiresOn,
              };
            });

          case 422:

            return response.json().then(({errors}) => {
              dispatch(loginError(errors));

              return Promise.reject(
                new UnprocessableEntity()
              );
            });

          default:

            dispatch(loginError(
              ['Invalid Credentials.']
            ));

            return Promise.reject(
              new SilencedError('Invalid Credentials.')
            );
        }
      })
      .then(auth => Promise.all([
        auth,
        fetchAuthUserHobbies(dispatch, auth.accessToken),
        fetchAuthUserHobbies(dispatch, auth.accessToken),
        fetchSocialMediaTypes(),
        dispatch(fetchPersonalData(auth.accessToken)),
      ]), () => {
        if (onAuthFail instanceof Function) {
          onAuthFail();
        }

        return Promise.reject(
          new SilencedError('Authorization Failed.')
        );
      })
      .then(([auth, hobbiesData, hobbiesDataMirror, mediaTypes, userData]) => {
        localStorage.setItem('ACCESS_TOKEN', auth.accessToken);
        localStorage.setItem('ACCESS_TOKEN_EXPIRES_ON', auth.expiresOn);

        // Set required data & dispatch the success action
        dispatch(setLocale(userData.language.short));
        moment.locale(userData.language.short);
        dispatch(setHobbies(hobbiesData));
        dispatch(setUserData(userData));
        dispatch(receiveFetchSocialMediaTypes(mediaTypes));
        dispatch(fetchNotificationTypes());

        if(userData.profPending === 'ok') {
          fetchUsersThatWasInvitedToBePros(auth.accessToken, dispatch);
        }

        dispatch(receiveLogin(
          auth.accessToken,
          auth.expiresOn
        ));

        return Promise.resolve();
      });
  };
}

/*---------------------------- LOGOUT ------------------------------*/

export const LOGOUT = 'LOGOUT';

function logout() {
  return {
    type: LOGOUT,
  };
}

/**
 * Revoke the users access token.
 *
 * Note! This method must be dispatched.
 *
 * @param accessToken
 * @param accessTokenExpiresOn
 * @returns {function(*)}
 */
export function logoutUser(accessToken, accessTokenExpiresOn, languagesList) {
  return dispatch => {
    if (accessToken && accessTokenExpiresOn) {
      if (parseInt(accessTokenExpiresOn, 10) > (new Date()).getTime()) {
        fetchApiRequest('/v1/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
      }
    }

    const unAuthUserLang = getDefaultLanguage(languagesList);
    dispatch(setLocale(unAuthUserLang.short));
    moment.locale(unAuthUserLang.short);

    localStorage.removeItem('USER_LANGUAGE');
    localStorage.removeItem('ACCESS_TOKEN');
    localStorage.removeItem('ACCESS_TOKEN_EXPIRES_ON');

    dispatch(logout());
  };
}

/*---------------------- REFRESH ACCESS TOKEN ----------------------*/

export const REFRESH_ACCESS_TOKEN_SUCCESS = 'REFRESH_ACCESS_TOKEN_SUCCESS';

function receiveNewToken(accessToken, accessTokenExpiresOn) {
  return {
    type: REFRESH_ACCESS_TOKEN_SUCCESS,
    accessToken,
    accessTokenExpiresOn,
  };
}

/**
 * Refresh access token.
 * Use it when current access token is expired,
 * or a 401 status code is received.
 *
 * Note! Do not repeat this if will receive again 401.
 *
 * Note! This method must be dispatched.
 *
 *
 * @returns {function(*)}
 */
export function refreshAccessToken() {
  return dispatch => {
    return fetchApiRequest('/v1/login/refresh', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
    })
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json()
              .then(({
                       access_token: accessToken,
                       expires_in: expiresIn
                     }) => {
                let now = new Date();
                let expiresOn = now.setSeconds(
                  now.getSeconds() + expiresIn
                );

                return {
                  accessToken,
                  expiresOn,
                };
              });

          default:

            return Promise.reject(
              new InvalidRefreshToken()
            );

        }
      })
      .then(({accessToken, expiresOn}) => {
        localStorage.setItem('ACCESS_TOKEN', accessToken);
        localStorage.setItem('ACCESS_TOKEN_EXPIRES_ON', expiresOn);

        dispatch(receiveNewToken(accessToken, expiresOn));

        return {
          accessToken,
          expiresOn,
        };
      });
  };
}

/*--------------------- FETCH PERSONAL DETAILS ---------------------*/

export const SET_USER_DATA = 'SET_USER_DATA';

export function setUserData(data) {
  return {
    type: SET_USER_DATA,
    data,
  };
}

/**
 * Fetch authed user details
 *
 * @param accessToken
 * @returns {function(*)}
 */
export function fetchPersonalData(accessToken) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest('/v1/account/details', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch(response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new SilencedError('Failed to fetch personal details.')
            );
        }
      })
  };
}

/*---------------------------- EDIT USER ---------------------------*/

export const EDIT_USER_SUCCESS = 'EDIT_USER_SUCCESS';

export function receiveEditUser(user) {
  return {
    type: EDIT_USER_SUCCESS,
    user,
  };
}

/*---------------------------- UPDATE PENDING ---------------------------*/

export const UPDATE_PENDING_STATUS = 'UPDATE_PENDING_STATUS';

export function updatePendingStatus(status, role) {
  return {
    type: UPDATE_PENDING_STATUS,
    status,
    role,
  };
}

/*---------------------------- UPDATE CONFIRMED ---------------------------*/

export const UPDATE_CONFIRMED = 'UPDATE_CONFIRMED';

export function updateConfirmed() {
  return {
    type: UPDATE_CONFIRMED,
  };
}

/*---------------------------- UPDATE INVOICE_USER ---------------------------*/

export const UPDATE_INVOICE_USER = 'UPDATE_INVOICE_USER';

export function updateInvoiceUser(invoiceDetails) {
  return {
    type: UPDATE_INVOICE_USER,
    invoiceDetails
  };
}

/*---------------------------- UPDATE CALENDAR_FILTER ---------------------------*/

export const UPDATE_CALENDAR_FILTER = 'UPDATE_CALENDAR_FILTER';

export function updateCalendarFilterUser(filters) {
  return {
    type: UPDATE_CALENDAR_FILTER,
    filters
  };
}
