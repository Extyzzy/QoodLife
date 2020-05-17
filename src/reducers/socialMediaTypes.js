import {
  FETCH_SOCIALMEDIATYPES_REQUEST,
  FETCH_SOCIALMEDIATYPES_SUCCESS,
  FETCH_SOCIALMEDIATYPES_FAILURE,
} from '../actions/socialMediaTypes';

export default function socialMediaTypes(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_SOCIALMEDIATYPES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_SOCIALMEDIATYPES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_SOCIALMEDIATYPES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
