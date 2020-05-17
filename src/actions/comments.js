import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";
import { getQueryData } from '../helpers/filter';

export const FETCH_COMMENTS_REQUEST = 'FETCH_COMMENTS_REQUEST';
export const FETCH_COMMENTS_SUCCESS = 'FETCH_COMMENTS_SUCCESS';
export const FETCH_COMMENTS_FAILURE = 'FETCH_COMMENTS_FAILURE';

/*------------------------ FEATCH COMMENTS -----------------------*/

export function fetchComments(identifier, commentId, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  if (beforeFetch instanceof Function) {
    beforeFetch();
  }

  return fetchApiRequest(`/v1/comments/` +
    (commentId !== null? `${identifier}/${commentId}` : `${identifier}`) + `?` + getQueryData(filter), {
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
          new SilencedError('Failed to fetch comments.')
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
