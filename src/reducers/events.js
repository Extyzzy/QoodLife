import {
  FETCH_EVENTS_REQUEST,
  FETCH_EVENTS_SUCCESS,
  FETCH_EVENTS_FAILURE,
  CLEAR_EVENTS,
  LOAD_MORE_EVENTS_REQUEST,
  LOAD_MORE_EVENTS_SUCCESS,
  LOAD_MORE_EVENTS_FAILURE,
  GOING_TO_EVENT_SUCCESS,
  NOT_GOING_TO_EVENT_SUCCESS,
  DELETE_EVENT_SUCCESS,
  ADD_NEW_EVENT_SUCCESS,
  EDIT_EVENT_SUCCESS,
  REMOVE_EVENT_FROM_LIST,
  FETCH_HOBBIES_EVENTS_SUCCESS,
  CLEAR_HOBBIES_EVENTS,
} from '../actions/events';

import update from 'immutability-helper';

export default function events(state = {
  isFetching: false,
  loadingMore: false,
  couldLoadMore: false,
  totalNrOfItems: 0,
  list: [],
  listHobbiesEvents: [],
}, action, rules) {
  switch (action.type) {
    case FETCH_EVENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_EVENTS_SUCCESS:
      return updateStoreOnFetchEventsSuccess(state, action);
    case FETCH_EVENTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
      });
    case CLEAR_EVENTS:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_EVENTS_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case FETCH_HOBBIES_EVENTS_SUCCESS:
      return Object.assign({}, state, {
        listHobbiesEvents: action.data.list,
      });
    case CLEAR_HOBBIES_EVENTS:
      return Object.assign({}, state, {
        listHobbiesEvents: [],
      });
    case LOAD_MORE_EVENTS_SUCCESS:
      return updateStoreOnLoadMoreEventsSuccess(state, action);
    case LOAD_MORE_EVENTS_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case REMOVE_EVENT_FROM_LIST:
      return updateStoreOnDeleteEventSuccess(state, action);
    case GOING_TO_EVENT_SUCCESS:
      return updateStoreOnGoingToEventSuccess(state, action);
    case NOT_GOING_TO_EVENT_SUCCESS:
      return updateStoreOnNotGoingToEventSuccess(state, action);
    case DELETE_EVENT_SUCCESS:
      return updateStoreOnDeleteEventSuccess(state,action);
    case ADD_NEW_EVENT_SUCCESS:
      return updateStoreOnAddNewEventSuccess(state, action);
    case EDIT_EVENT_SUCCESS:
      return updateStoreOnEditEventSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchEventsSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;
  // const allEventsOrdered = action.data.list.sort((s, v) => {
  //   return s.going === v.going? 0 : s.going? -1 : 1
  // });

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMoreEventsSuccess = (state, action) => {
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

const updateStoreOnGoingToEventSuccess = (state, {event}) => {
  const eventIndex = state.list
    .findIndex(({id}) => id === event.id);

  if (eventIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [eventIndex]: {
        $apply: (e) => update(e, {
          going: {
            $set: true,
          },
        }),
      },
    },
  });
};

const updateStoreOnNotGoingToEventSuccess = (state, {event}) => {
  const eventIndex = state.list
    .findIndex(({id}) => id === event.id);

  if (eventIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [eventIndex]: {
        $apply: (e) => update(e, {
          going: {
            $set: false,
          },
          favorite: {
            $set: false,
          },
        }),
      },
    },
  });
};

const updateStoreOnDeleteEventSuccess = (state, action) => {
  const eventIndex = state.list.findIndex(e => e.id === action.eventId);

  if (eventIndex === -1) {
    return state;
  }

  return update(state, {
    list:{
      $splice: [[eventIndex, 1]]
    }
    ,
  });
};

const updateStoreOnAddNewEventSuccess = (state, {event}) => {
  return update(state, {
    list: {
      $unshift: [event],
    },
  });
};

const updateStoreOnEditEventSuccess = (state, {event}) => {
  const eventIndex = state.list
    .findIndex(({id}) => id === event.id);

  if (eventIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [eventIndex]: {
        $set: event,
      },
    },
  });
};
