import {
  FETCH_LANGUAGES_REQUEST,
  FETCH_LANGUAGES_SUCCESS,
  FETCH_LANGUAGES_FAILURE,
} from '../actions/languages';

export default function languages(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_LANGUAGES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_LANGUAGES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_LANGUAGES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
