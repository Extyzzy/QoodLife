import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_GENDERS_REQUEST = 'FETCH_GENDERS_REQUEST';
export const FETCH_GENDERS_SUCCESS = 'FETCH_GENDERS_SUCCESS';
export const FETCH_GENDERS_FAILURE = 'FETCH_GENDERS_FAILURE';

function requestFetchGenders() {
  return {
    type: FETCH_GENDERS_REQUEST,
  };
}

export function receiveFetchGenders(data) {
  return {
    type: FETCH_GENDERS_SUCCESS,
    data,
  };
}

function fetchGendersError() {
  return {
    type: FETCH_GENDERS_FAILURE,
  };
}

export function fetchGenders() {
  return dispatch => {
    dispatch(requestFetchGenders());

    return fetchApiRequest('/v1/genders')
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchGendersError());

            return Promise.reject(
              new SilencedError('Failed to fetch genders.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchGenders(data));

        return Promise.resolve();
      });
  };
}
