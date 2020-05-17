import {
  FETCH_BRANDS_REQUEST,
  FETCH_BRANDS_SUCCESS,
  FETCH_BRANDS_FAILURE,
  CLEAR_BRANDS,
} from '../actions/brands';

export default function brands(state = {
  isFetching: false,
  loaded: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_BRANDS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_BRANDS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
        list: action.list,
      });
    case FETCH_BRANDS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
      });
    case CLEAR_BRANDS:
      return Object.assign({}, state, {
        loaded: false,
        list: [],
      });
    default:
      return state;
  }
}
