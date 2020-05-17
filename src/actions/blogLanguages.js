import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_BLOGLANGUAGES_REQUEST = 'FETCH_BLOGLANGUAGES_REQUEST';
export const FETCH_BLOGLANGUAGES_SUCCESS = 'FETCH_BLOGLANGUAGES_SUCCESS';
export const FETCH_BLOGLANGUAGES_FAILURE = 'FETCH_BLOGLANGUAGES_FAILURE';

function requestFetchBlogLanguages() {
  return {
    type: FETCH_BLOGLANGUAGES_REQUEST,
  };
}

export function receiveFetchBlogLanguages(data) {
  return {
    type: FETCH_BLOGLANGUAGES_SUCCESS,
    data,
  };
}

function fetchBlogLanguagesError() {
  return {
    type: FETCH_BLOGLANGUAGES_FAILURE,
  };
}

/**
 * Fetch Languages list.
 * Save data in store to load only once.
 *
 * Note! This method must be dispatched.
 *
 * @returns {function(*)}
 */
export function fetchBlogLanguages() {
  return dispatch => {
    dispatch(requestFetchBlogLanguages());

    return fetchApiRequest('/v1/blog/languages')
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchBlogLanguagesError());

            return Promise.reject(
              new SilencedError('Failed to fetch languages.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchBlogLanguages(data));

        return Promise.resolve();
      });
  };
}
