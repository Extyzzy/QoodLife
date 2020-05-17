import {
  FETCH_RELATED_EVENTS_REQUEST,
  FETCH_RELATED_EVENTS_SUCCESS,
  FETCH_RELATED_EVENTS_FAILURE,
  SET_CALENDAR,
  CLEAR_CALENDAR,
} from '../actions/calendar';

import {
  GOING_TO_EVENT_SUCCESS,
  NOT_GOING_TO_EVENT_SUCCESS,
} from '../actions/events';

import update from 'immutability-helper';
import moment from 'moment';

export default function calendar(state = {
  isFetching: false,
  isOpen: false,
  activeMonth: null,
  events: [],
  calendarPlace: null,
}, action) {
  switch (action.type) {
    case SET_CALENDAR:
      return Object.assign({}, state, {
        calendarPlace: action.calendarPlace
      });
    case CLEAR_CALENDAR:
      return Object.assign({}, state, {
        calendarPlace: null
      });
    case FETCH_RELATED_EVENTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_RELATED_EVENTS_SUCCESS:
      return updateStoreOnFetchRelatedEventsSuccess(state, action);
    case GOING_TO_EVENT_SUCCESS:
      return updateStoreOnGoingToEventSuccess(state, action);
    case NOT_GOING_TO_EVENT_SUCCESS:
      return updateStoreOnNotGoingToEventSuccess(state, action);
    case FETCH_RELATED_EVENTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
      });
    default:
      return state;
  }
}

const updateStoreOnFetchRelatedEventsSuccess = (state, action) => {
  return Object.assign({}, state, {
    isFetching: false,
    events: action.data.list,
    isOpen: action.data.details.isOpen,
    activeMonth: action.data.details.activeMonth,
  });
};

const updateStoreOnGoingToEventSuccess = (state, {event}) => {

  return update(state, {
    events: {
      $unshift: [{
        ...event,
        going: true,
        dateStart: moment().unix()
      }],
    },
  });
};

const updateStoreOnNotGoingToEventSuccess = (state, {event}) => {
  const eventIndex = state.events.findIndex(e => e.id === event.id);

  if (eventIndex === -1) {
    return state;
  }

  return update(state, {
    events:{
      $splice: [[eventIndex, 1]]
    }
  });
};
