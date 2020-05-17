import moment from 'moment';

import {
  refreshAccessToken,
  fetchPersonalData,
  setUserData,
  receiveLogin,
  fetchUsersThatWasInvitedToBePros,
} from './user';

import {
  fetchLanguages,
  getDefaultLanguage,
  receiveFetchLanguages,
  languageFromLocalStorage,
} from './languages';

import {
  fetchNotifications,
  receiveFetchNotifications,
  receiveChatNotifications,
  fetchUnviewedMessages,
  fetchNotificationTypes,
} from './notifications';

import {
  InvalidRefreshToken,
  UndefinedAccessToken,
} from '../exceptions/auth';

import {
  setHobbies,
  setHobbiesForChildren
} from './hobbies';

import {
  fetchHobbies,
  fetchAuthUserHobbies,
  getHobbiesForChildrensOptions
} from './hobbies';

import {
  fetchSocialMediaTypes,
  receiveFetchSocialMediaTypes
} from './socialMediaTypes';

import {
  loadTranslations,
  setLocale,
} from 'react-redux-i18n';

import translations from '../translations';

export const FETCH_INITIAL_STATE_REQUEST = 'FETCH_INITIAL_STATE_REQUEST';
export const FETCH_INITIAL_STATE_COMPLETE = 'FETCH_INITIAL_STATE_COMPLETE';
export const FETCH_INITIAL_STATE_FAILURE = 'FETCH_INITIAL_STATE_FAILURE';
export const SWITCH_UIVERSION = 'SWITCH_UIVERSION';
export const GET_CLIENT_DETAILS = 'GET_CLIENT_DETAILS';

export const MOBILE_VERSION = 'MOBILE_VERSION';
export const DESKTOP_VERSION = 'DESKTOP_VERSION';

export const POLICY = 'POLICY';

export function setPolicyPrivateData(boolean) {
  return dispatch => {
    dispatch(setPolicy(boolean))
  }
}

export function setPolicy(boolean) {
  return {
    type: POLICY,
    boolean,
  };
}

export function switchUIVersion(version) {
  return {
    type: SWITCH_UIVERSION,
    UIVersion: version,
  };
}

export function getClientDetails(details) {
  return {
    type: GET_CLIENT_DETAILS,
    city: details.city,
    lat: details.lat,
    lon: details.lon,
    zip: details.zip
  };
}

export function requestFetchInitialState() {
  return {
    type: FETCH_INITIAL_STATE_REQUEST,
    isFetching: true,
  };
}

export function receiveInitialState() {
  return {
    type: FETCH_INITIAL_STATE_COMPLETE,
    isFetching: false,
    hasErrors: false,
  };
}

export function fetchInitialStateError() {
  return {
    type: FETCH_INITIAL_STATE_FAILURE,
    isFetching: false,
    hasErrors: true,
  };
}

/**
 * Fetch auth state. Method is meant to be
 * used in a new Promise.
 *
 * Note! This method must be dispatched.
 *
 * @param resolve
 * @param reject
 * @returns {function(*)}
 */
function fetchAuthState(resolve, reject) {
  const accessToken = localStorage.getItem('ACCESS_TOKEN');
  const expiresOn = localStorage.getItem('ACCESS_TOKEN_EXPIRES_ON');

  return dispatch => {
    if (accessToken && expiresOn) {
      if (parseInt(expiresOn, 10) > (new Date()).getTime()) {
        dispatch(receiveLogin(accessToken, expiresOn));

        resolve();
      }
      else {
        return dispatch(refreshAccessToken())
          .then(() => resolve())
          .catch(e => {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('ACCESS_TOKEN_EXPIRES_ON');

            reject(new InvalidRefreshToken());
          });
      }
    }

    reject(new UndefinedAccessToken());
  };
}

/**
 * Fetch initial app state.
 *
 * Note! This method must be dispatched.
 *
 * @returns {function(*)}
 */

 export function fetchInitialState() {
   return dispatch => {
     dispatch(requestFetchInitialState());

     return Promise.all([
        fetchHobbies(),
        fetchLanguages(),
        fetchSocialMediaTypes(),
        getHobbiesForChildrensOptions(),

       // Try to fetch user data if is authed
       new Promise((resolve, reject) => {
         dispatch(fetchAuthState(resolve, reject));
       })
       .then(() => dispatch(fetchPersonalData(
         localStorage.getItem('ACCESS_TOKEN')
       )))
       .then(data => ({data, status: 'RESOLVED'}))
       .catch(e => Promise.resolve({e, status: 'REJECTED'}))
     ])
     .then(([hobbiesData, languages, mediaTypes, childrenHobbiesData, {data: userData, status: userStatus}]) => {
       const defaultLanguage = getDefaultLanguage(languages.list);
       const languageFromStorage = languageFromLocalStorage(languages.list);

       /**
        * TODO
        * Load translations from api.
        */
       dispatch(loadTranslations(translations));
       dispatch(receiveFetchLanguages(languages));
       dispatch(setHobbies(hobbiesData));
       dispatch(setHobbiesForChildren(childrenHobbiesData));
       dispatch(receiveFetchSocialMediaTypes(mediaTypes));

       // Set user data only if we succeed in previous step
       if (userStatus === 'RESOLVED') {
         const accessToken = localStorage.getItem('ACCESS_TOKEN');
         dispatch(setUserData(userData));

         dispatch(setLocale(userData.language.short));
         moment.locale(userData.language.short);

         Promise.all([
           fetchNotifications(dispatch, accessToken, 'groups'),
           fetchNotifications(dispatch, accessToken, 'places'),
           fetchNotifications(dispatch, accessToken, 'professionals'),
           fetchUnviewedMessages(dispatch, accessToken),
           fetchAuthUserHobbies(dispatch, accessToken)
         ])
         .then(([
           groups_notifications,
           places_notifications,
           professionals_notifications,
           chatNotifications,
           authUserHobbies,
         ]) => {
           dispatch(setHobbies(authUserHobbies));
           dispatch(fetchNotificationTypes());
           dispatch(receiveChatNotifications(chatNotifications));
           dispatch(receiveFetchNotifications([
             ...groups_notifications.list,
             ...places_notifications.list,
             ...professionals_notifications.list,
           ]));
         });

         if(userData.profPending === 'ok') {
           fetchUsersThatWasInvitedToBePros(accessToken, dispatch);
         }
       } else {
         const notAuthUserLanguage = languageFromStorage
          ? languageFromStorage
          : defaultLanguage;

         dispatch(setLocale(notAuthUserLanguage.short));
         moment.locale(notAuthUserLanguage.short);
       }

       return Promise.resolve();
     })
     .then(() => {
       return dispatch(receiveInitialState());
     })
     .catch(() => {
       return dispatch(fetchInitialStateError());
     });
   };
 }
