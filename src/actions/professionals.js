import { getUrlWithFilter } from '../helpers/filter';
import { fetchAuthorizedApiRequest } from "../fetch";
import { SilencedError } from '../exceptions/errors';

/*---------------------- SWITCH PROFESSIONALS AVATAR ---------------------*/

export const SWITCH_PROFESSIONAL_AVATAR = 'SWITCH_PROFESSIONAL_AVATAR';

export function switchProfessionalAvatar(avatar) {
  return {
    type: SWITCH_PROFESSIONAL_AVATAR,
    avatar,
  };
}

/*------------ SWITCH PROFESSIONALS ACTIVE STATUS ---------------------*/

export const SWITCH_PROFESSIONALS_ACTIVE_STATUS = 'SWITCH_PROFESSIONALS_ACTIVE_STATUS';

export function switchProsActiveStatus(status) {
  return {
    type: SWITCH_PROFESSIONALS_ACTIVE_STATUS,
    status,
  };
}

/*---------------------- FOLLOW THE PROFESSIONAL ---------------------*/

export const FOLLOW_THE_PROFESSIONAL_SUCCESS = 'FOLLOW_THE_PROFESSIONAL_SUCCESS';

export function receiveFollowTheProfessional(professionalId) {
  return {
    type: FOLLOW_THE_PROFESSIONAL_SUCCESS,
    professionalId,
  };
}

export function follow(accessToken, professionalId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/professionals/${professionalId}/follow`,
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
            new SilencedError('Failed to follow the professional.')
          );

      }
    });
  };
}

/*-------------------- UNFOLLOW THE PROFESSIONAL ------------------*/

export const UNFOLLOW_THE_PROFESSIONAL_SUCCESS = 'UNFOLLOW_THE_PROFESSIONAL_SUCCESS';

export function receiveUnfollowTheProfessional(professionalId) {
  return {
    type: UNFOLLOW_THE_PROFESSIONAL_SUCCESS,
    professionalId,
  };
}

export function unfollow(accessToken, professionalId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/professionals/${professionalId}/unfollow`,
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
            new SilencedError('Failed to unfollow the professional.')
          );

      }
    });
  };
}

/*--------------------------- CREATE PROFESSIONAL --------------------------*/

export const ADD_NEW_PROFESSIONAL_SUCCESS = 'ADD_NEW_PROFESSIONAL_SUCCESS';

export function receiveAddNewProfessional(professional) {
  return {
    type: ADD_NEW_PROFESSIONAL_SUCCESS,
    professional,
  };
}

/*--------------------------- FETCH PROFESSIONALS --------------------------*/

export const FETCH_PROFESSIONALS_REQUEST = 'FETCH_PROFESSIONALS_REQUEST';
export const FETCH_PROFESSIONALS_SUCCESS = 'FETCH_PROFESSIONALS_SUCCESS';
export const FETCH_PROFESSIONALS_FAILURE = 'FETCH_PROFESSIONALS_FAILURE';
export const CLEAR_PROFESSIONALS = 'CLEAR_PROFESSIONALS';

export function requestFetchProfessionals() {
  return {
    type: FETCH_PROFESSIONALS_REQUEST
  };
}

export function receiveFetchProfessionals(data) {
  return {
    type: FETCH_PROFESSIONALS_SUCCESS,
    data,
  };
}

export function fetchProfessionalsError() {
  return {
    type: FETCH_PROFESSIONALS_FAILURE
  };
}

export function clearProfessionals() {
  return {
    type: CLEAR_PROFESSIONALS
  };
}

export function fetchProfessionalsWithStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchProfessionals(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchProfessionals());
        },
        onSuccess: data => {
          dispatch(receiveFetchProfessionals(data));
        },
        onError: () => {
          dispatch(fetchProfessionalsError());
        },
      })
    );
  };
}

export function fetchProfessionals(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/professionals', filter),
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
            new SilencedError('Failed to fetch professionals.')
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

/*------------------------ LOAD MORE PROFESSIONALS -----------------------*/

export const LOAD_MORE_PROFESSIONALS_REQUEST = 'LOAD_MORE_PROFESSIONALS_REQUEST';
export const LOAD_MORE_PROFESSIONALS_SUCCESS = 'LOAD_MORE_PROFESSIONALS_SUCCESS';
export const LOAD_MORE_PROFESSIONALS_FAILURE = 'LOAD_MORE_PROFESSIONALS_FAILURE';

export function requestLoadMoreProfessionals() {
  return {
    type: LOAD_MORE_PROFESSIONALS_REQUEST,
  };
}

export function receiveLoadMoreProfessionals(data) {
  return {
    type: LOAD_MORE_PROFESSIONALS_SUCCESS,
    data,
  };
}

export function loadMoreProfessionalsError() {
  return {
    type: LOAD_MORE_PROFESSIONALS_FAILURE,
  };
}

export function loadMoreProfessionalsUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchProfessionals(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMoreProfessionals());
        },
        onSuccess: data => {
          dispatch(receiveLoadMoreProfessionals(data));
        },
        onError: () => {
          dispatch(loadMoreProfessionalsError());
        },
      })
    );
  };
}

/*--------------------------- DELETE PROFESSIONAL --------------------------*/

export const DELETE_PROFESSIONAL_SUCCESS = 'DELETE_PROFESSIONAL_SUCCESS';

export function receiveDeleteProfessional(professionalId) {
  return {
    type: DELETE_PROFESSIONAL_SUCCESS,
    professionalId,
  };
}

export function deleteProfessional(accessToken, professionalId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/professionals/${professionalId}`,
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
            new SilencedError('Failed to delete professional.')
          );
      }
    });
  };
}

/*---------------------------- EDIT PROFESSIONAL ---------------------------*/

export const EDIT_PROFESSIONAL_SUCCESS = 'EDIT_PROFESSIONAL_SUCCESS';

export function receiveEditProfessional(professional) {
  return {
    type: EDIT_PROFESSIONAL_SUCCESS,
    professional,
  };
}

/*----------------------- PROFESSIONAL FROM STORE --------------------*/

export const REMOVE_PROFESSIONAL_FROM_LIST = 'REMOVE_PROFESSIONAL_FROM_LIST';

export function removeProfessionalFromList(profId) {
  return {
    type: REMOVE_PROFESSIONAL_FROM_LIST,
    profId,
  };
}
