import { fetchAuthorizedApiRequest } from '../fetch';
import { getUrlWithFilter } from '../helpers/filter';
import {SilencedError} from "../exceptions/errors";

/*---------------------- SWITCH PLACES AVATAR ---------------------*/

export const SWITCH_PLACE_AVATAR = 'SWITCH_PLACE_AVATAR';

export function switchPlaceAvatar(avatar) {
  return {
    type: SWITCH_PLACE_AVATAR,
    avatar,
  };
}


/*---------------------- SWITCH PLACES ACTIVE STATUS ---------------------*/

export const SWITCH_PLACES_ACTIVE_STATUS = 'SWITCH_PLACES_ACTIVE_STATUS';

export function switchPlacesActiveStatus(status) {
  return {
    type: SWITCH_PLACES_ACTIVE_STATUS,
    status,
  };
}

/*---------------------- ADD PLACE TO FAVORITES ---------------------*/

export const ADD_PLACE_TO_FAVORITES_SUCCESS = 'ADD_PLACE_TO_FAVORITES_SUCCESS';

export function receiveAddToFavorites(placeId) {
  return {
    type: ADD_PLACE_TO_FAVORITES_SUCCESS,
    placeId,
  };
}

export function addToFavorites(accessToken, placeId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/${placeId}/favorite`,
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
            new SilencedError('Failed to add place to favorites.')
          );

      }
    });
  };
}

/*-------------------- REMOVE PLACE FROM FAVORITES ------------------*/

export const REMOVE_PLACE_FROM_FAVORITES_SUCCESS = 'REMOVE_PLACE_FROM_FAVORITES_SUCCESS';

export function receiveRemoveFromFavorites(placeId) {
  return {
    type: REMOVE_PLACE_FROM_FAVORITES_SUCCESS,
    placeId,
  };
}

export function removeFromFavorites(accessToken, placeId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/${placeId}/favorite`,
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
              new SilencedError('Failed to remove place from favorites.')
            );

        }
      });
  };
}

/*--------------------------- DELETE PLACE --------------------------*/

export const DELETE_PLACE_SUCCESS = 'DELETE_PLACE_SUCCESS';

export function receiveDeletePlace(placeId) {
  return {
    type: DELETE_PLACE_SUCCESS,
    placeId,
  };
}

export function deletePlace(accessToken, placeId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/${placeId}`,
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
              new SilencedError('Failed to delete place.')
            );

        }
      });
  };
}


/*------------------------ FETCH PLACES ------------------------*/

export const FETCH_PLACES_REQUEST = 'FETCH_PLACES_REQUEST';
export const FETCH_PLACES_SUCCESS = 'FETCH_PLACES_SUCCESS';
export const FETCH_PLACES_FAILURE = 'FETCH_PLACES_FAILURE';
export const CLEAR_PLACES = 'CLEAR_PLACES';

export function requestFetchPlaces() {
  return {
    type: FETCH_PLACES_REQUEST,
  };
}

export function receiveFetchPlaces(data) {
  return {
    type: FETCH_PLACES_SUCCESS,
    data,
  };
}

export function fetchPlacesError() {
  return {
    type: FETCH_PLACES_FAILURE,
  };
}

export function clearPlaces() {
  return {
    type: CLEAR_PLACES,
  };
}

export function fetchPlacesWithStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchPlaces(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchPlaces());
        },
        onSuccess: data => {
          dispatch(receiveFetchPlaces(data));
        },
        onError: () => {
          dispatch(fetchPlacesError());
        },
      })
    );
  };
}

export function fetchPlaces(accessToken, filter, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/places', filter),
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
            new SilencedError('Failed to fetch places.')
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

/*------------------------ LOAD MORE PLACES -----------------------*/

export const LOAD_MORE_PLACES_REQUEST = 'LOAD_MORE_PLACES_REQUEST';
export const LOAD_MORE_PLACES_SUCCESS = 'LOAD_MORE_PLACES_SUCCESS';
export const LOAD_MORE_PLACES_FAILURE = 'LOAD_MORE_PLACES_FAILURE';

export function requestLoadMorePlaces() {
  return {
    type: LOAD_MORE_PLACES_REQUEST,
  };
}

export function receiveLoadMorePlaces(data) {
  return {
    type: LOAD_MORE_PLACES_SUCCESS,
    data,
  };
}

export function loadMorePlacesError() {
  return {
    type: LOAD_MORE_PLACES_FAILURE,
  };
}

export function loadMorePlacesUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchPlaces(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMorePlaces());
        },
        onSuccess: data => {
          dispatch(receiveLoadMorePlaces(data));
        },
        onError: () => {
          dispatch(loadMorePlacesError());
        },
      })
    );
  };
}

/*--------------------------- CREATE PLACE --------------------------*/

export const ADD_NEW_PLACE_SUCCESS = 'ADD_NEW_PLACE_SUCCESS';

export function receiveAddNewPlace(place) {
  return {
    type: ADD_NEW_PLACE_SUCCESS,
    place,
  };
}

/*---------------------------- EDIT PLACE ---------------------------*/

export const EDIT_PLACE_SUCCESS = 'EDIT_PLACE_SUCCESS';

export function receiveEditPlace(place) {
  return {
    type: EDIT_PLACE_SUCCESS,
    place,
  };
}

/*----------------------- REMOVE PLACE FROM STORE --------------------*/

export const REMOVE_PLACE_FROM_LIST = 'REMOVE_PLACE_FROM_LIST';

export function removePlaceFromList(placeId) {
  return {
    type: REMOVE_PLACE_FROM_LIST,
    placeId,
  };
}
