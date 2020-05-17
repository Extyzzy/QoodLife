import {fetchAuthorizedApiRequest} from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_TIMELINE_REQUEST = 'FETCH_TIMELINE_REQUEST';
export const FETCH_TIMELINE_SUCCESS = 'FETCH_TIMELINE_SUCCESS';
export const FETCH_TIMELINE_FAILURE = 'FETCH_TIMELINE_FAILURE';

export const FETCH_TIMELINE_DATA_REQUEST = 'FETCH_TIMELINE_DATA_REQUEST';
export const FETCH_TIMELINE_DATA_SUCCESS = 'FETCH_TIMELINE_DATA_SUCCESS';
export const FETCH_TIMELINE_DATA_FAILURE = 'FETCH_TIMELINE_DATA_FAILURE';

export const CLEAR_TIMELINE = 'CLEAR_TIMELINE';
export const CLEAR_TIMELINE_DATA = 'CLEAR_TIMELINE_DATA';

export const SET_COULD_LOAD_MORE = 'SET_COULD_LOAD_MORE';

export const REMOVE_SEEN_TIMELINE = 'REMOVE_SEEN_TIMELINE';


export function removeHobbyTimeline(list, hobby) {

  return {
    type: REMOVE_SEEN_TIMELINE,
    list,
    hobby,
  };
}

export function clearTimeline() {
  return {
    type: CLEAR_TIMELINE,
    list: [],
  };
}

export function clearTimelineData() {
  return {
    type: CLEAR_TIMELINE_DATA,
    data: [],
  };
}

export function setCouldLoadMore() {
  return {
    type: SET_COULD_LOAD_MORE,
    couldLoadMore: true,
  };
}

function requestFetchTimeline() {
  return {
    type: FETCH_TIMELINE_REQUEST,
  };
}

export function receiveFetchTimeline(data) {
  return {
    type: FETCH_TIMELINE_SUCCESS,
    data,
  };
}

function fetchTimelineError() {
  return {
    type: FETCH_TIMELINE_FAILURE,
  };
}

export function timeline(accessToken, children) {
  return dispatch => {

    let url = children ? '/v1/account/timeline?children=true' : '/v1/account/timeline';
    dispatch(requestFetchTimeline());

    return dispatch(fetchAuthorizedApiRequest(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchTimelineError());

            return Promise.reject(
              new SilencedError('Failed to fetch timeline.')
            );

        }
      })
      .then(data => {

        dispatch(receiveFetchTimeline(data));

        return Promise.resolve();
      });
  };
}


function requestFetchTimelineData() {
  return {
    type: FETCH_TIMELINE_DATA_REQUEST,
  };
}

export function receiveFetchTimelineData(data) {
  return {
    type: FETCH_TIMELINE_DATA_SUCCESS,
    data,
  };
}

function fetchTimelineErrorData() {
  return {
    type: FETCH_TIMELINE_DATA_FAILURE,
  };
}

export function timelineData(accessToken, hobbyId, skip, children) {
  return dispatch => {
    let url = children ? `/v1/account/timeline/${hobbyId}?children=true&take=3&skip=${skip}`
      : `/v1/account/timeline/${hobbyId}?&take=3&skip=${skip}`;

    dispatch(requestFetchTimelineData());

    return dispatch(fetchAuthorizedApiRequest(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(fetchTimelineErrorData());

            return Promise.reject(
              new SilencedError('Failed to fetch timelineData.')
            );

        }
      })
      .then(data => {
        data.events.map(data => data.type = 'event');
        data.posts.map(data => data.type = 'post');
        data.groups.map(data => data.type = 'group');
        data.products.map(data => data.type = 'product');

        const AllData = [...data.events, ...data.posts, ...data.groups, ...data.products];

        dispatch(receiveFetchTimelineData(AllData));

        return Promise.resolve();
      });
  };
}

/*------------------------ LOAD MORE TIMEINE -----------------------*/

export const LOAD_MORE_TIMEINE_REQUEST = 'LOAD_MORE_TIMEINE_REQUEST';
export const LOAD_MORE_TIMELINE_SUCCESS = 'LOAD_MORE_TIMELINE_SUCCESS';
export const LOAD_MORE_TIMELINE_FAILURE = 'LOAD_MORE_TIMELINE_FAILURE';
export const LOAD_CLEAR_TIMELINE= 'LOAD_CLEAR_TIMELINE';

export function clearTimelineloadMore() {
  return {
    type: LOAD_CLEAR_TIMELINE,
    loadMoreData: [],
  };
}

export function requestLoadMoreTimeline() {
  return {
    type: LOAD_MORE_TIMEINE_REQUEST,
  };
}

export function receiveLoadMoreTimeline(data) {
  return {
    type: LOAD_MORE_TIMELINE_SUCCESS,
    data,
  };
}

export function loadMoreTimelineError() {
  return {
    type: LOAD_MORE_TIMELINE_FAILURE,
  };
}

export function LoadMoreTimelineData(accessToken, hobbyId, skip) {
  return dispatch => {

    dispatch(requestLoadMoreTimeline());

    return dispatch(fetchAuthorizedApiRequest(`/v1/account/timeline/${hobbyId}?&take=3&skip=${skip}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            dispatch(loadMoreTimelineError());

            return Promise.reject(
              new SilencedError('Failed to fetch timelineData.')
            );

        }
      })
      .then(data => {
        data.events.map(data => data.type = 'event');
        data.posts.map(data => data.type = 'post');
        data.groups.map(data => data.type = 'group');
        data.products.map(data => data.type = 'product');

        const allData = [...data.events, ...data.posts, ...data.groups, ...data.products];

        dispatch(receiveLoadMoreTimeline(allData));

        return Promise.resolve();
      });
  };
}

