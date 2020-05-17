import {
  FETCH_ROLES_REQUEST,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_FAILURE,
} from '../actions/roles';

export default function roles(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_ROLES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ROLES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_ROLES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    default:
      return state;
  }
}
