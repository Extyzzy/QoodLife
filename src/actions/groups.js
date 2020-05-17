import { getUrlWithFilter } from '../helpers/filter';
import { fetchAuthorizedApiRequest} from "../fetch";
import { SilencedError } from "../exceptions/errors";

/*------------------------ FETCH GROUPS ------------------------*/

export const FETCH_GROUPS_REQUEST = 'FETCH_GROUPS_REQUEST';
export const FETCH_GROUPS_SUCCESS = 'FETCH_GROUPS_SUCCESS';
export const FETCH_GROUPS_FAILURE = 'FETCH_GROUPS_FAILURE';
export const CLEAR_GROUPS = 'CLEAR_GROUPS';


function requestFetchGroups() {
  return {
    type: FETCH_GROUPS_REQUEST,
  };
}

export function receiveFetchGroups(data) {
  return {
    type: FETCH_GROUPS_SUCCESS,
    data,
  };
}

function fetchGroupsError() {
  return {
    type: FETCH_GROUPS_FAILURE,
  };
}

export function clearGroups() {
  return {
    type: CLEAR_GROUPS,
    list: [],
  };
}

/**
 * A wrapper for fetchGroups where data is
 * fetched with redux store.
 *
 * @param accessToken
 * @param filter
 * @returns {function(*)}
 */
export function fetchGroupsWithStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchGroups(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchGroups());
        },
        onSuccess: data => {
          dispatch(receiveFetchGroups(data));
        },
        onError: () => {
          dispatch(fetchGroupsError());
        },
      })
    );
  };
}

/**
 * General fetcher for groups where can pass beforeFetch,
 * onSuccess and onError and manage the request.
 *
 * @param accessToken
 * @param {object} filter
 * @param {object} actions, {{function(*)} beforeFetch, {function(*)} onSuccess, {function(*)} onError}
 * @returns {function(*)}
 */
export function fetchGroups(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {

  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/groups', filter),
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
              new SilencedError('Failed to fetch groups.')
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

/*---------------------- Join group ---------------------*/

export const JOIN_GROUP_SUCCESS = 'JOIN_GROUP_SUCCESS';

export function receiveJoinGroup(groupId, user) {
  return {
    type: JOIN_GROUP_SUCCESS,
    groupId,
    user,
  };
}

export function joinGroup(accessToken, groupId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/groups/${groupId}/join`,
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
              new SilencedError('Failed to join group.')
            );

        }
      });
  };
}

/*------------------------ LOAD MORE GROUPS -----------------------*/

export const LOAD_MORE_GROUPS_REQUEST = 'LOAD_MORE_GROUPS_REQUEST';
export const LOAD_MORE_GROUPS_SUCCESS = 'LOAD_MORE_GROUPS_SUCCESS';
export const LOAD_MORE_GROUPS_FAILURE = 'LOAD_MORE_GROUPS_FAILURE';

export function requestLoadMoreGroups() {
  return {
    type: LOAD_MORE_GROUPS_REQUEST,
  };
}

export function receiveLoadMoreGroups(data) {
  return {
    type: LOAD_MORE_GROUPS_SUCCESS,
    data,
  };
}

export function loadMoreGroupsError() {
  return {
    type: LOAD_MORE_GROUPS_FAILURE,
  };
}

export function loadMoreGroupsUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchGroups(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMoreGroups());
        },
        onSuccess: data => {
          dispatch(receiveLoadMoreGroups(data));
        },
        onError: () => {
          dispatch(loadMoreGroupsError());
        },
      })
    );
  };
}

/*---------------------- Leave group ---------------------*/

export const LEAVE_GROUP_SUCCESS = 'LEAVE_GROUP_SUCCESS';

export function receiveLeaveGroup(groupId, userId) {
  return {
    type: LEAVE_GROUP_SUCCESS,
    groupId,
    userId
  };
}

export function leaveGroup(accessToken, groupId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/groups/${groupId}/leave`,
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
              new SilencedError('Failed to leave group.')
            );

        }
      });
  };
}

/*--------------------------- DELETE GROUP --------------------------*/

export const DELETE_GROUP_SUCCESS = 'DELETE_GROUP_SUCCESS';

export function receiveDeleteGroup(groupId) {
  return {
    type: DELETE_GROUP_SUCCESS,
    groupId,
  };
}

export function deleteGroup(accessToken, groupId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/groups/${groupId}`,
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
              new SilencedError('Failed to delete group.')
            );

        }
      });
  };
}

/*--------------------------- CREATE GROUP --------------------------*/

export const ADD_NEW_GROUP_SUCCESS = 'ADD_NEW_GROUP_SUCCESS';

export function receiveAddNewGroup(group) {
  return {
    type: ADD_NEW_GROUP_SUCCESS,
    group,
  };
}

/*---------------------------- EDIT GROUP ---------------------------*/

export const EDIT_GROUP_SUCCESS = 'EDIT_GROUP_SUCCESS';

export function receiveEditGroup(group) {
  return {
    type: EDIT_GROUP_SUCCESS,
    group,
  };
}

