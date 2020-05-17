import {
  FETCH_GENDERS_REQUEST,
  FETCH_GENDERS_SUCCESS,
  FETCH_GENDERS_FAILURE,
} from '../actions/genders';

export default function genders(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_GENDERS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_GENDERS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_GENDERS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
