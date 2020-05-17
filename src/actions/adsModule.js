import {fetchApiRequest, fetchAuthorizedApiRequest} from '../fetch';
import { getUrlWithFilter } from '../helpers/filter';
import { SilencedError } from "../exceptions/errors";

export const FETCH_ADS_BLOCKS_REQUEST = 'FETCH_ADS_BLOCKS_REQUEST';
export const FETCH_ADS_BLOCKS_SUCCESS = 'FETCH_ADS_BLOCKS_SUCCESS';
export const FETCH_ADS_BLOCKS_FAILURE = 'FETCH_ADS_BLOCKS_FAILURE';

function requestFetchAdsBlocks() {
  return {
    type: FETCH_ADS_BLOCKS_REQUEST,
  };
}

export function receiveFetchAdsBlocks(data) {
  return {
    type: FETCH_ADS_BLOCKS_SUCCESS,
    data,
  };
}

function fetchAdsBlocksError() {
  return {
    type: FETCH_ADS_BLOCKS_FAILURE,
  };
}

export function fetchAdsBlocks(accessToken, filter = {}, placeId) {
  return dispatch => {
    dispatch(requestFetchAdsBlocks());

    let fetch;

    if (accessToken) {
      fetch = dispatch(
        fetchAuthorizedApiRequest(
          getUrlWithFilter(`/v1/products/featured-right`, filter),
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )
      );
    } else {
      fetch = fetchApiRequest(getUrlWithFilter('/v1/products/featured-right', filter));
    }

    if (placeId) {
      fetch = fetchApiRequest(getUrlWithFilter('/v1/products', filter));
    }

    return fetch
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchAdsBlocksError());

            return Promise.reject(
              new SilencedError('Failed to fetch products.')
            );

        }
      })
      .then(data => {
        dispatch(receiveFetchAdsBlocks(data));

        return Promise.resolve();
      });
  };
}


export const LOAD_MORE_ADS_BLOCKS_SUCCES = 'LOAD_MORE_ADS_BLOCKS_SUCCES';
export const LOAD_MORE_ADS_BLOCKS_FAILURE = 'LOAD_MORE_ADS_BLOCKS_FAILURE';

function fetchLoadMoreAdsBlocksError() {
  return {
    type: LOAD_MORE_ADS_BLOCKS_FAILURE
  }
}

function receiveFetchLoadMoreAdsBlocks(data) {
  return {
    type: LOAD_MORE_ADS_BLOCKS_SUCCES,
    data
  }
}

export function loadMoreAdsBlocks(filter = {}) {
  return dispatch => {
    return fetchApiRequest(getUrlWithFilter('/v1/products/featured-right', filter))
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            dispatch(fetchLoadMoreAdsBlocksError());
            return Promise.reject(
              new SilencedError('Failed to fetch products.')
            );
        }
      })
      .then(data => {
        dispatch(receiveFetchLoadMoreAdsBlocks(data));

        return Promise.resolve();
      });
  };
}
