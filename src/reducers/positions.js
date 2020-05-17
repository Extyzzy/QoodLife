import {
  FETCH_POSITIONS_REQUEST,
  FETCH_POSITIONS_SUCCESS,
  FETCH_POSITIONS_FAILURE,
} from '../actions/positions';

export default function positions(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_POSITIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_POSITIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
        list: action.list,
      });
    case FETCH_POSITIONS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
      });
    default:
      return state;
  }
}
