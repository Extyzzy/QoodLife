import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_ROLES_REQUEST = 'FETCH_ROLES_REQUEST';
export const FETCH_ROLES_SUCCESS = 'FETCH_ROLES_SUCCESS';
export const FETCH_ROLES_FAILURE = 'FETCH_ROLES_FAILURE';

function requestFetchRoles() {
  return {
    type: FETCH_ROLES_REQUEST,
  };
}

export function receiveFetchRoles(data) {
  return {
    type: FETCH_ROLES_SUCCESS,
    data,
  };
}

function fetchRolesError() {
  return {
    type: FETCH_ROLES_FAILURE,
  };
}

/**
 * Fetch Roles list.
 * Save data in store to load only once.
 *
 * Note! This method must be dispatched.
 *
 * @returns {function(*)}
 */
export function fetchRoles() {
  return dispatch => {
    dispatch(requestFetchRoles());

    return fetchApiRequest('/v1/roles')
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchRolesError());

            return Promise.reject(
              new SilencedError('Failed to fetch roles.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchRoles(data));

        return Promise.resolve();
      });
  };
}
