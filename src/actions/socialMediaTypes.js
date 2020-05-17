import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_SOCIALMEDIATYPES_REQUEST = 'FETCH_SOCIALMEDIATYPES_REQUEST';
export const FETCH_SOCIALMEDIATYPES_SUCCESS = 'FETCH_SOCIALMEDIATYPES_SUCCESS';
export const FETCH_SOCIALMEDIATYPES_FAILURE = 'FETCH_SOCIALMEDIATYPES_FAILURE';

export function receiveFetchSocialMediaTypes(data) {
  return {
    type: FETCH_SOCIALMEDIATYPES_SUCCESS,
    data,
  };
}

export function fetchSocialMediaTypes() {
  return fetchApiRequest('/v1/social-media-types')
    .then(response => {
      switch (response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch Social Media Types.')
          );
      }
    })
}
