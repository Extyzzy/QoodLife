import { fetchApiRequest } from '../fetch';
import {SilencedError} from "../exceptions/errors";

export const FETCH_POSITIONS_REQUEST = 'FETCH_POSITIONS_REQUEST';
export const FETCH_POSITIONS_SUCCESS = 'FETCH_POSITIONS_SUCCESS';
export const FETCH_POSITIONS_FAILURE = 'FETCH_POSITIONS_FAILURE';

function requestFetchPositions() {
  return {
    type: FETCH_POSITIONS_REQUEST,
    isFetching: true,
  };
}

export function receiveFetchPositions(positions) {
  return {
    type: FETCH_POSITIONS_SUCCESS,
    isFetching: false,
    list: positions.list,
  };
}

function fetchPositionsError() {
  return {
    type: FETCH_POSITIONS_FAILURE,
    isFetching: false,
  };
}


export function fetchPositions() {
  return dispatch => {
    dispatch(requestFetchPositions());

    return fetchApiRequest('/v1/positions')
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchPositionsError());

            return Promise.reject(
              new SilencedError('Failed to fetch positions.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchPositions(data));

        return Promise.resolve();
      });
  };
}
