import { getUrlWithFilter } from '../helpers/filter';
import {fetchApiRequest, fetchAuthorizedApiRequest} from "../fetch";
import { SilencedError } from "../exceptions/errors";
import {appendToFormData} from "../helpers/form";

/*------------------------ FETCH HOBBIES EVENTS RELATED PROF/PLACE------------------------*/

export const FETCH_HOBBIES_EVENTS_REQUEST = 'FETCH_HOBBIES_EVENTS_REQUEST';
export const FETCH_HOBBIES_EVENTS_SUCCESS = 'FETCH_HOBBIES_EVENTS_SUCCESS';
export const FETCH_HOBBIES_EVENTS_FAILURE = 'FETCH_HOBBIES_EVENTS_FAILURE';
export const CLEAR_HOBBIES_EVENTS = 'CLEAR_HOBBIES_EVENTS';

export function clearHobbiesEvents() {
  return {
    type: CLEAR_HOBBIES_EVENTS,
    list: [],
  };
}

function requestFetchAdsBlocks() {
  return {
    type: FETCH_HOBBIES_EVENTS_REQUEST,
  };
}

export function receiveFetchHobbiesEvents(data) {
  return {
    type: FETCH_HOBBIES_EVENTS_SUCCESS,
    data,
  };
}

function fetchHobbiesEventsError() {
  return {
    type: FETCH_HOBBIES_EVENTS_FAILURE,
  };
}

export function fetchEventsHobbiesUser(filter = {}) {
  return dispatch => {
    dispatch(requestFetchAdsBlocks());

    return fetchApiRequest(getUrlWithFilter('/v1/events/added-hobbies', filter))
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchHobbiesEventsError());

            return Promise.reject(
              new SilencedError('Failed to fetch products.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchHobbiesEvents(data));

        return Promise.resolve();
      });
  };
}

/*------------------------ FETCH EVENTS ------------------------*/

export const FETCH_EVENTS_REQUEST = 'FETCH_EVENTS_REQUEST';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';
export const CLEAR_EVENTS = 'CLEAR_EVENTS';

function requestFetchEvents() {
  return {
    type: FETCH_EVENTS_REQUEST,
  };
}

export function receiveFetchEvents(data, rules) {
  return {
    type: FETCH_EVENTS_SUCCESS,
    data,
    rules,
  };
}

function fetchEventsError() {
  return {
    type: FETCH_EVENTS_FAILURE,
  };
}

export function clearEvents() {
  return {
    type: CLEAR_EVENTS,
    list: [],
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
export function fetchEventsWithStore(accessToken, filter, rules) {
  return dispatch => {
    return dispatch(
      fetchEvents(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchEvents());
        },
        onSuccess: data => {
          dispatch(receiveFetchEvents(data, rules));
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
export function fetchEvents(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/events', filter),
        {
          ...(accessToken ? {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          } : {})
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

/*------------------------ LOAD MORE EVENTS -----------------------*/

export const LOAD_MORE_EVENTS_REQUEST = 'LOAD_MORE_EVENTS_REQUEST';
export const LOAD_MORE_EVENTS_SUCCESS = 'LOAD_MORE_EVENTS_SUCCESS';
export const LOAD_MORE_EVENTS_FAILURE = 'LOAD_MORE_EVENTS_FAILURE';

export function requestLoadMoreEvents() {
  return {
    type: LOAD_MORE_EVENTS_REQUEST,
  };
}

export function receiveLoadMoreEvents(data) {
  return {
    type: LOAD_MORE_EVENTS_SUCCESS,
    data,
  };
}

export function loadMoreEventsError() {
  return {
    type: LOAD_MORE_EVENTS_FAILURE,
  };
}

export function loadMoreEventsUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchEvents(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMoreEvents());
        },
        onSuccess: data => {
          dispatch(receiveLoadMoreEvents(data));
        },
        onError: () => {
          dispatch(loadMoreEventsError());
        },
      })
    );
  };
}

/*---------------------- GOING TO EVENT ---------------------*/

export const GOING_TO_EVENT_SUCCESS = 'GOING_TO_EVENT_SUCCESS';

export function receiveGoingToEvent(event) {
  return {
    type: GOING_TO_EVENT_SUCCESS,
    event,
  };
}

export function goingToEvent(accessToken, eventId, dateStart) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/events/${eventId}/going`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: appendToFormData(
            new FormData(),
            {
              date: dateStart
            }
          )
        }
      )
    )
    .then(response => {
      switch (response.status) {
        case 204:

          return Promise.resolve();

        default:

          return Promise.reject(
            new SilencedError('Failed to set go to event.')
          );
      }
    });
  };
}

/*---------------------- REMOVE EVENT FROM STORE ---------------------*/

export const REMOVE_EVENT_FROM_LIST = 'REMOVE_EVENT_FROM_LIST';

export function removeEventFromList(eventId) {
  return {
    type: REMOVE_EVENT_FROM_LIST,
    eventId,
  };
}

/*-------------------- NOT GOING TO EVENT ------------------*/

export const NOT_GOING_TO_EVENT_SUCCESS = 'NOT_GOING_TO_EVENT_SUCCESS';

export function receiveNotGoingToEvent(event) {
  return {
    type: NOT_GOING_TO_EVENT_SUCCESS,
    event,
  };
}

export function notGoingToEvent(accessToken, eventId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/events/${eventId}/going`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 204:

            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed to set not go to event.')
            );

        }
      });
  };
}

/*--------------------------- DELETE EVENT --------------------------*/

export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';

export function receiveDeleteEvent(eventId) {
  return {
    type: DELETE_EVENT_SUCCESS,
    eventId,
  };
}

export function deleteEvent(accessToken, eventId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 204:

            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed to delete event.')
            );

        }
      });
  };
}

/*--------------------------- CREATE EVENT --------------------------*/

export const ADD_NEW_EVENT_SUCCESS = 'ADD_NEW_EVENT_SUCCESS';

export function receiveAddNewEvent(event) {
  return {
    type: ADD_NEW_EVENT_SUCCESS,
    event,
  };
}

/*---------------------------- EDIT POST ---------------------------*/

export const EDIT_EVENT_SUCCESS = 'EDIT_EVENT_SUCCESS';

export function receiveEditEvent(event) {
  return {
    type: EDIT_EVENT_SUCCESS,
    event,
  };
}
