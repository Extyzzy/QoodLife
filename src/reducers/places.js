import {
  SWITCH_PLACES_ACTIVE_STATUS,
  FETCH_PLACES_REQUEST,
  FETCH_PLACES_SUCCESS,
  FETCH_PLACES_FAILURE,
  CLEAR_PLACES,
  LOAD_MORE_PLACES_REQUEST,
  LOAD_MORE_PLACES_SUCCESS,
  LOAD_MORE_PLACES_FAILURE,
  ADD_NEW_PLACE_SUCCESS,
  EDIT_PLACE_SUCCESS,
  DELETE_PLACE_SUCCESS,
  ADD_PLACE_TO_FAVORITES_SUCCESS,
  REMOVE_PLACE_FROM_FAVORITES_SUCCESS,
  REMOVE_PLACE_FROM_LIST,
} from '../actions/places';

import update from 'immutability-helper';

export default function places(state = {
  active: true,
  isFetching: false,
  loadingMore: false,
  couldLoadMore: true,
  totalNrOfItems: 0,
  list: [],
}, action) {
  switch (action.type) {
    case SWITCH_PLACES_ACTIVE_STATUS:
      return Object.assign({}, state, {
        active: action.status,
      });
    case FETCH_PLACES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PLACES_SUCCESS:
      return updateStoreOnFetchPlacesSuccess(state, action);
    case FETCH_PLACES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case CLEAR_PLACES:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_PLACES_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_PLACES_SUCCESS:
      return updateStoreOnLoadMorePlacesSuccess(state, action);
    case LOAD_MORE_PLACES_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case ADD_PLACE_TO_FAVORITES_SUCCESS:
      return updateStoreOnAddToFavoritesSuccess(state, action);
    case REMOVE_PLACE_FROM_FAVORITES_SUCCESS:
      return updateStoreOnRemoveFromFavoritesSuccess(state, action);
    case REMOVE_PLACE_FROM_LIST:
      return updateStoreOnRemovePlaceFromList(state, action);
    case DELETE_PLACE_SUCCESS:
      return updateStoreOnDeletePlaceSuccess(state,action);
    case ADD_NEW_PLACE_SUCCESS:
      return updateStoreOnAddNewPlaceSuccess(state, action);
    case EDIT_PLACE_SUCCESS:
      return updateStoreOnEditPlaceSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchPlacesSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMorePlacesSuccess = (state, action) => {
  const couldLoadMore = state.totalNrOfItems > state.list.length +
    action.data.list.length;

  return Object.assign({}, state, {
    loadingMore: false,
    couldLoadMore,
    list: update(state.list, {
      $push: action.data.list,
    }),
  });
};

const updateStoreOnDeletePlaceSuccess = (state, action) => {
  const placeIndex = state.list
    .findIndex(e => e.id === action.placeId);

  if (placeIndex === -1) {
    return state;
  }

  return update(state, {
    list:{
      $splice: [[placeIndex, 1]]
    }
    ,
  });
};

const updateStoreOnAddToFavoritesSuccess = (state, {placeId}) => {
  const placeIndex = state.list
    .findIndex(({id}) => id === placeId);

  if (placeIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [placeIndex]: {
        $apply: (place) => update(place, {
          favorite: {
            $set: true,
          },
          followers: {
            $set: place.followers + 1,
          },
        }),
      },
    },
  });
};

const updateStoreOnRemovePlaceFromList = (state, {placeId}) => {
  const placeIndex = state.list
    .findIndex(({id}) => id === placeId);

  if (placeIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      $splice: [[placeIndex, 1]],
    },
  });
};

const updateStoreOnRemoveFromFavoritesSuccess = (state, {placeId}) => {
  const placeIndex = state.list
    .findIndex(({id}) => id === placeId);

  if (placeIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [placeIndex]: {
        $apply: (place) => update(place, {
          favorite: {
            $set: false,
          },
          followers: {
            $set: place.followers - 1,
          },
        }),
      },
    },
  });
};

const updateStoreOnAddNewPlaceSuccess = (state, {place}) => {
  return update(state, {
    list: {
      $unshift: [place],
    },
  });
};

const updateStoreOnEditPlaceSuccess = (state, {place}) => {
  const placeIndex = state.list
    .findIndex(({id}) => id === place.id);

  if (placeIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [placeIndex]: {
        $set: place,
      },
    },
  });
};
