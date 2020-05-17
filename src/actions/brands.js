import { fetchApiRequest } from '../fetch';
import { SilencedError } from '../exceptions/errors';

export const FETCH_BRANDS_REQUEST = 'FETCH_BRANDS_REQUEST';
export const FETCH_BRANDS_SUCCESS = 'FETCH_BRANDS_SUCCESS';
export const FETCH_BRANDS_FAILURE = 'FETCH_BRANDS_FAILURE';
export const CLEAR_BRANDS = 'CLEAR_BRANDS';

function requestFetchBrands() {
  return {
    type: FETCH_BRANDS_REQUEST,
    isFetching: true,
  };
}

export function receiveFetchBrands(brands) {
  return {
    type: FETCH_BRANDS_SUCCESS,
    isFetching: false,
    list: brands.list,
  };
}

function fetchBrandsError() {
  return {
    type: FETCH_BRANDS_FAILURE,
    isFetching: false,
  };
}

export function clearBrands() {
  return {
    type: CLEAR_BRANDS,
    list: [],
  };
}

export function fetchBrandsWithStore(accessToken) {
  return dispatch => {
    return fetchBrands({
      beforeFetch: () => {
        dispatch(requestFetchBrands());
      },
      onSuccess: data => {
        dispatch(receiveFetchBrands(data));
      },
      onError: () => {
        dispatch(fetchBrandsError());
      },
    });
  };
}

export function fetchBrands({beforeFetch, onSuccess, onError} = {}) {
  if (beforeFetch instanceof Function) {
    beforeFetch();
  }

  return fetchApiRequest('/v1/brands', {
    method: 'GET',
    mode: 'cors',
  })
  .then(response => {
    switch (response.status) {
      case 200:

        return response.json();

      default:

        if (onError instanceof Function) {
          onError();
        }

        return Promise.reject(
          new SilencedError('Failed to fetch brands.')
        );

    }
  })
  .then(data => {
    if (onSuccess instanceof Function) {
      onSuccess(data);
    }

    return Promise.resolve();
  });
}
