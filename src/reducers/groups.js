import {
  FETCH_GROUPS_FAILURE,
  FETCH_GROUPS_REQUEST,
  FETCH_GROUPS_SUCCESS,
  CLEAR_GROUPS,
  LOAD_MORE_GROUPS_REQUEST,
  LOAD_MORE_GROUPS_SUCCESS,
  LOAD_MORE_GROUPS_FAILURE,
  JOIN_GROUP_SUCCESS,
  LEAVE_GROUP_SUCCESS,
  DELETE_GROUP_SUCCESS,
  ADD_NEW_GROUP_SUCCESS,
  EDIT_GROUP_SUCCESS,
} from "../actions/groups";

import update from "immutability-helper";

export default function groups(state = {
  isFetching: false,
  loadingMore: false,
  couldLoadMore: false,
  totalNrOfItems: 0,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_GROUPS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_GROUPS_SUCCESS:
      return updateStoreOnFetchGroupsSuccess(state, action);
    case FETCH_GROUPS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case CLEAR_GROUPS:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_GROUPS_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_GROUPS_SUCCESS:
      return updateStoreOnLoadMoreGroupsSuccess(state, action);
    case LOAD_MORE_GROUPS_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case JOIN_GROUP_SUCCESS:
      return updateStoreOnJoinToGroupSuccess(state, action);
    case LEAVE_GROUP_SUCCESS:
      return updateStoreOnLeaveGroupSuccess(state, action);
    case DELETE_GROUP_SUCCESS:
      return updateStoreOnDeleteGroupSuccess(state, action);
    case ADD_NEW_GROUP_SUCCESS:
      return updateStoreOnAddNewGroupSuccess(state, action);
    case EDIT_GROUP_SUCCESS:
      return updateStoreOnEditGroupSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchGroupsSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMoreGroupsSuccess = (state, action) => {
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

const updateStoreOnJoinToGroupSuccess = (state, {groupId, user}) => {

  const userData = {
    id: user.id,
    fullName: user.fullName,
    owner: false,
    avatar: user.avatar? user.avatar : null,
  };

  const groupIndex = state.list
    .findIndex(({id}) => id === groupId);

  if (groupIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [groupIndex]: {
        $apply: (group) => update(group, {
          members: {
            $push: [userData],
          },
        }),
      },
    },
  });

};

const updateStoreOnLeaveGroupSuccess = (state, {groupId, userId}) => {
  const groupIndex = state.list
    .findIndex(({id}) => id === groupId);

  if (groupIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [groupIndex]: {
        $apply: (group) => update(group, {
          members: {
            $splice: [[group.members.findIndex(m =>
              m.id === userId
            ), 1]],
          },
        }),
      },
    },
  });
};

const updateStoreOnDeleteGroupSuccess = (state, action) => {
  const groupIndex = state.list
    .findIndex(e => e.id === action.groupId);

  if (groupIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      $splice: [[groupIndex, 1]]
    }
    ,
  });
};

const updateStoreOnAddNewGroupSuccess = (state, {group}) => {
  return update(state, {
    list: {
      $unshift: [group],
    },
  });
};

const updateStoreOnEditGroupSuccess = (state, {group}) => {
  const groupIndex = state.list
    .findIndex(({id}) => id === group.id);

  if (groupIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [groupIndex]: {
        $set: group,
      },
    },
  });
};
