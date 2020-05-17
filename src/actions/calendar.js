import { getUrlWithFilter } from '../helpers/filter';
import { fetchAuthorizedApiRequest} from "../fetch";
import { SilencedError } from "../exceptions/errors";

/*------------------------ FETCH EVENTS ------------------------*/

export const FETCH_RELATED_EVENTS_REQUEST = 'FETCH_RELATED_EVENTS_REQUEST';
export const FETCH_RELATED_EVENTS_SUCCESS = 'FETCH_RELATED_EVENTS_SUCCESS';
export const FETCH_RELATED_EVENTS_FAILURE = 'FETCH_RELATED_EVENTS_FAILURE';
export const SET_CALENDAR = 'SET_CALENDAR';
export const CLEAR_CALENDAR = 'CLEAR_CALENDAR';

export function setFilterCalendar(calendarPlace) {
  return {
    type: SET_CALENDAR,
    calendarPlace
  }
}

export function clearFilterCalendar() {
  return {
    type: CLEAR_CALENDAR,
  }
}

function requestFetchEvents() {
  return {
    type: FETCH_RELATED_EVENTS_REQUEST,
  };
}

export function receiveFetchEvents(data, details) {
  return {
    type: FETCH_RELATED_EVENTS_SUCCESS,
    data: {
      list: data.list,
      details
    },
  };
}

function fetchEventsError() {
  return {
    type: FETCH_RELATED_EVENTS_FAILURE,
  };
}


/**
 * A wrapper for fetchEvents where data is
 * fetched with redux store.
 *
 * @param accessToken
 * @param filter
 * @returns {function(*)}
 */
export function fetchRelatedEventsWithStore(accessToken, details, filter) {
  return dispatch => {
    return dispatch(
      fetchRelatedEvents(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchEvents());
        },
        onSuccess: data => {
          dispatch(receiveFetchEvents(data, details));
        },
        onError: () => {
          dispatch(fetchEventsError());
        },
      })
    );
  };
}

/**
 * General fetcher for events where can pass beforeFetch,
 * onSuccess and onError and manage the request.
 *
 * @param accessToken
 * @param {object} filter
 * @param {object} actions, {{function(*)} beforeFetch, {function(*)} onSuccess, {function(*)} onError}
 * @returns {function(*)}
 */

export function fetchRelatedEvents(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/events', filter),
        {
           headers: accessToken ? {
              'Authorization': `Bearer ${accessToken}`,
            } : null
        })
    )
    .then(response => {
      switch (response.status) {
        case 200:

          return response.json();

        default:

          if (onError instanceof Function) {
            onError();
          }

          return Promise.reject(
            new SilencedError('Failed to fetch events.')
          );

      }
    })
    .then(data => {
      if (onSuccess instanceof Function) {
        onSuccess(data);
      }

      return Promise.resolve();
    });
  };
}
