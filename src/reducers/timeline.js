import {
  FETCH_TIMELINE_REQUEST,
  FETCH_TIMELINE_SUCCESS,
  FETCH_TIMELINE_FAILURE,
  CLEAR_TIMELINE,
  CLEAR_TIMELINE_DATA,
  LOAD_CLEAR_TIMELINE,
  FETCH_TIMELINE_DATA_FAILURE,
  FETCH_TIMELINE_DATA_SUCCESS,
  FETCH_TIMELINE_DATA_REQUEST,
  LOAD_MORE_TIMELINE_FAILURE,
  LOAD_MORE_TIMELINE_SUCCESS,
  LOAD_MORE_TIMEINE_REQUEST,
  REMOVE_SEEN_TIMELINE,
  SET_COULD_LOAD_MORE,
} from '../actions/timeline';

import {
  DETACH_HOBBY_SUCCESS,
} from "../actions/hobbies";

import moment from 'moment';
import update from "immutability-helper";

export default function timeline(state = {
  isFetching: false,
  isFetchingData: false,
  loadingMore: false,
  couldLoadMore: true,
  list: [],
  data: [],
  loadMoreData: [],
}, action) {
  switch (action.type) {
    case FETCH_TIMELINE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_TIMELINE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_TIMELINE_DATA_REQUEST:
      return Object.assign({}, state, {
        data: [],
        isFetchingData: true,
      });
    case FETCH_TIMELINE_DATA_FAILURE:
      return Object.assign({}, state, {
        data: [],
      });
    case FETCH_TIMELINE_DATA_SUCCESS:
      return Object.assign({}, state, {
        isFetchingData: false,
        data: action.data,
      });
    case FETCH_TIMELINE_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case LOAD_MORE_TIMEINE_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_TIMELINE_SUCCESS:
      return Object.assign({}, state, {
        loadMoreData: action.data,
        loadingMore: false,
        couldLoadMore: !!action.data.length,
      });
    case DETACH_HOBBY_SUCCESS:
      return updateStoreDetachHobbySuccess(state, action);
    case REMOVE_SEEN_TIMELINE:
      return updateStoreRemoveSeenSuccess(state, action);
    case LOAD_MORE_TIMELINE_FAILURE:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_CLEAR_TIMELINE:
      return Object.assign({}, state, {
        loadMoreData: [],
      });
    case SET_COULD_LOAD_MORE:
      return Object.assign({}, state, {
        couldLoadMore: true,
      });
    case CLEAR_TIMELINE_DATA:
      return Object.assign({}, state, {
        data: [],
      });
    case CLEAR_TIMELINE:
      return Object.assign({}, state, {
        list: [],
      });
    default:
      return state;
  }
}

const updateStoreRemoveSeenSuccess = (state, {hobby}) => {
  const hobbies = state.list.map(data => data.hobby);
  const hobbyIndex = hobbies.findIndex(({id}) => id === hobby);

  if (hobbyIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [hobbyIndex]: {
        $apply: item => update(item, {
          total: {
            $set: 0,
          },
          lastSeen: {
            $set: moment(new Date()).unix(),
          }
        })
      }
    }
  });
};

const updateStoreDetachHobbySuccess = (state, {hobby}) => {
  const hobbies = state.list.map(data => data.hobby);
  const hobbyIndex = hobbies.findIndex(({id}) => id === hobby.id);

  if (hobbyIndex === -1) {
    return state;
  }

  return update(state, {
      list: {
        $splice: [[hobbyIndex, 1]],
      }
  });
};
