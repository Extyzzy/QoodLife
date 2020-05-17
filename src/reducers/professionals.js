import {
  SWITCH_PROFESSIONALS_ACTIVE_STATUS,
  FETCH_PROFESSIONALS_REQUEST,
  FETCH_PROFESSIONALS_SUCCESS,
  FETCH_PROFESSIONALS_FAILURE,
  CLEAR_PROFESSIONALS,
  LOAD_MORE_PROFESSIONALS_REQUEST,
  LOAD_MORE_PROFESSIONALS_SUCCESS,
  LOAD_MORE_PROFESSIONALS_FAILURE,
  ADD_NEW_PROFESSIONAL_SUCCESS,
  DELETE_PROFESSIONAL_SUCCESS,
  EDIT_PROFESSIONAL_SUCCESS,
  FOLLOW_THE_PROFESSIONAL_SUCCESS,
  UNFOLLOW_THE_PROFESSIONAL_SUCCESS,
  REMOVE_PROFESSIONAL_FROM_LIST,
} from '../actions/professionals';

import update from 'immutability-helper';

export default function professionals(state = {
  active: true,
  isFetching: false,
  loadingMore: false,
  couldLoadMore: true,
  totalNrOfItems: 0,
  list: [],
}, action) {
  switch (action.type) {
    case SWITCH_PROFESSIONALS_ACTIVE_STATUS:
      return Object.assign({}, state, {
        active: action.status,
      });
    case REMOVE_PROFESSIONAL_FROM_LIST:
      return updateStoreOnRemoveProfessionalFromList(state, action);
    case FETCH_PROFESSIONALS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PROFESSIONALS_SUCCESS:
      return updateStoreOnFetchProfessionalsSuccess(state, action);
    case FETCH_PROFESSIONALS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case CLEAR_PROFESSIONALS:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_PROFESSIONALS_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_PROFESSIONALS_SUCCESS:
      return updateStoreOnLoadMoreProfessionalsSuccess(state, action);
    case LOAD_MORE_PROFESSIONALS_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case FOLLOW_THE_PROFESSIONAL_SUCCESS:
      return updateStoreOnFollowTheProfessionalSuccess(state, action);
    case UNFOLLOW_THE_PROFESSIONAL_SUCCESS:
      return updateStoreOnUnfollowTheProfessionalSuccess(state, action);
    case DELETE_PROFESSIONAL_SUCCESS:
      return updateStoreOnRemoveProfessionalFromList(state, action);
    case ADD_NEW_PROFESSIONAL_SUCCESS:
      return updateStoreOnAddNewProfessionalSuccess(state, action);
    case EDIT_PROFESSIONAL_SUCCESS:
      return updateStoreOnEditProfessionalSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchProfessionalsSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMoreProfessionalsSuccess = (state, action) => {
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

const updateStoreOnFollowTheProfessionalSuccess = (state, {professionalId}) => {
  const professionalIndex = state.list
    .findIndex(({id}) => id === professionalId);

  if (professionalIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [professionalIndex]: {
        $apply: (professional) => update(professional, {
          follow: {
            $set: true,
          },
          followers: {
            $set: professional.followers + 1,
          },
        }),
      },
    },
  });
};

const updateStoreOnUnfollowTheProfessionalSuccess = (state, {professionalId}) => {
  const professionalIndex = state.list
    .findIndex(({id}) => id === professionalId);

  if (professionalIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [professionalIndex]: {
        $apply: (professional) => update(professional, {
          follow: {
            $set: false,
          },
          followers: {
            $set: professional.followers - 1,
          },
        }),
      },
    },
  });
};

const updateStoreOnRemoveProfessionalFromList = (state, {profId}) => {
  const professionalIndex = state.list
    .findIndex(({id}) => id === profId);

  if (professionalIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      $splice: [[professionalIndex, 1]],
    },
  });
};

const updateStoreOnAddNewProfessionalSuccess = (state, {professional}) => {
  return update(state, {
    list: {
      $unshift: [professional],
    },
  });
};

const updateStoreOnEditProfessionalSuccess = (state, {professional}) => {
  const professionalIndex = state.list
    .findIndex(({id}) => id === professional.id);

  if (professionalIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [professionalIndex]: {
        $set: professional,
      },
    },
  });
};
