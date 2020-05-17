import {
  FETCH_BLOGLANGUAGES_REQUEST,
  FETCH_BLOGLANGUAGES_SUCCESS,
  FETCH_BLOGLANGUAGES_FAILURE,
} from '../actions/blogLanguages';

export default function blogLanguages(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_BLOGLANGUAGES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_BLOGLANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_BLOGLANGUAGES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
