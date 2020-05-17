import { getUrlWithFilter } from '../helpers/filter';
import {fetchAuthorizedApiRequest} from "../fetch";
import { SilencedError } from "../exceptions/errors";

/*------------------------ FETCH BLOG POSTS ------------------------*/

export const FETCH_POSTS_REQUEST = 'FETCH_POSTS_REQUEST';
export const FETCH_POSTS_SUCCESS = 'FETCH_POSTS_SUCCESS';
export const FETCH_POSTS_FAILURE = 'FETCH_POSTS_FAILURE';
export const CLEAR_POSTS = 'CLEAR_POSTS';

function requestFetchPosts() {
  return {
    type: FETCH_POSTS_REQUEST,
  };
}

export function receiveFetchPosts(data) {
  return {
    type: FETCH_POSTS_SUCCESS,
    data,
  };
}

function fetchPostsError() {
  return {
    type: FETCH_POSTS_FAILURE,
  };
}

export function clearPosts() {
  return {
    type: CLEAR_POSTS,
  };
}

/**
 * A wrapper for fetchPosts where data is
 * fetched with redux store.
 *
 * @param accessToken
 * @param filter
 * @returns {function(*)}
 */
export function fetchPostsWithStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchPosts(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchPosts());
        },
        onSuccess: data => {
          dispatch(receiveFetchPosts(data));
        },
        onError: () => {
          dispatch(fetchPostsError());
        },
      })
    );
  };
}

/**
 * General fetcher for posts where can pass beforeFetch,
 * onSuccess and onError and manage the request.
 *
 * @param accessToken
 * @param {object} filter
 * @param {object} actions, {{function(*)} beforeFetch, {function(*)} onSuccess, {function(*)} onError}
 * @returns {function(*)}
 */
export function fetchPosts(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/posts', filter),
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
            new SilencedError('Failed to fetch posts.')
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

/*------------------------ LOAD MORE POSTS ------------------------*/

export const LOAD_MORE_POSTS_REQUEST = 'LOAD_MORE_POSTS_REQUEST';
export const LOAD_MORE_POSTS_SUCCESS = 'LOAD_MORE_POSTS_SUCCESS';
export const LOAD_MORE_POSTS_FAILURE = 'LOAD_MORE_POSTS_FAILURE';

export function requestLoadMorePosts() {
  return {
    type: LOAD_MORE_POSTS_REQUEST,
  };
}

export function receiveLoadMorePosts(data) {
  return {
    type: LOAD_MORE_POSTS_SUCCESS,
    data,
  };
}

export function loadMorePostsError() {
  return {
    type: LOAD_MORE_POSTS_FAILURE,
  };
}

export function loadMorePostsUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchPosts(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMorePosts());
        },
        onSuccess: data => {
          dispatch(receiveLoadMorePosts(data));
        },
        onError: () => {
          dispatch(loadMorePostsError());
        },
      })
    );
  };
}

/*---------------------- ADD POST TO FAVORITES ---------------------*/

export const ADD_POST_TO_FAVORITES_SUCCESS = 'ADD_POST_TO_FAVORITES_SUCCESS';

export function receiveAddToFavorites(postId) {
  return {
    type: ADD_POST_TO_FAVORITES_SUCCESS,
    postId,
  };
}

export function addToFavorites(accessToken, postId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/posts/${postId}/favorite`,
        {
          method: 'POST',
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
            new SilencedError('Failed to add post to favorites.')
          );

      }
    });
  };
}

/*-------------------- REMOVE POST FROM FAVORITES ------------------*/

export const REMOVE_POST_FROM_FAVORITES_SUCCESS = 'REMOVE_POST_FROM_FAVORITES_SUCCESS';

export function receiveRemoveFromFavorites(postId) {
  return {
    type: REMOVE_POST_FROM_FAVORITES_SUCCESS,
    postId,
  };
}

export function removeFromFavorites(accessToken, postId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/posts/${postId}/favorite`,
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
            new SilencedError('Failed to remove post from favorites.')
          );

      }
    });
  };
}

/*--------------------------- DELETE POST --------------------------*/

export const DELETE_POST_SUCCESS = 'DELETE_POST_SUCCESS';

export function receiveDeletePost(postId) {
  return {
    type: DELETE_POST_SUCCESS,
    postId,
  };
}

export function deletePost(accessToken, postId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/posts/${postId}`,
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
            new SilencedError('Failed to delete post.')
          );

      }
    });
  };
}
/*--------------------------- CREATE POST --------------------------*/

export const ADD_NEW_POST_SUCCESS = 'ADD_NEW_POST_SUCCESS';

export function receiveAddNewPost(post) {
  return {
    type: ADD_NEW_POST_SUCCESS,
    post,
  };
}

/*---------------------------- EDIT POST ---------------------------*/

export const EDIT_POST_SUCCESS = 'EDIT_POST_SUCCESS';

export function receiveEditPost(post) {
  return {
    type: EDIT_POST_SUCCESS,
    post,
  };
}

/*---------------------- REMOVE POST FROM STORE ---------------------*/

export const REMOVE_POST_FROM_LIST = 'REMOVE_POST_FROM_LIST';

export function removePostFromList(postId) {
  return {
    type: REMOVE_POST_FROM_LIST,
    postId,
  };
}
