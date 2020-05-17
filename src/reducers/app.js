import {
  FETCH_INITIAL_STATE_REQUEST,
  FETCH_INITIAL_STATE_COMPLETE,
  SWITCH_UIVERSION,
  POLICY,
  GET_CLIENT_DETAILS,
} from '../actions/app';

import {
  determineUIVersion
} from '../components/App';

export default function app(state = {
  UIVersion: determineUIVersion(),
  isFetching: true,
  demo: false,
  ads: false,
  promotion: false,
  policy: true,
  userDetails: null,
}, action) {
  switch (action.type) {
    case FETCH_INITIAL_STATE_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_INITIAL_STATE_COMPLETE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case SWITCH_UIVERSION:
      return Object.assign({}, state, {
        UIVersion: action.UIVersion,
      });
    case POLICY:
      return Object.assign({}, state, {
        policy: action.boolean,
      });
    case GET_CLIENT_DETAILS:
      return Object.assign({}, state, {
        userDetails: {
          city: action.city,
          lon: action.lon,
          lat: action.lat,
          zip: action.zip
        }
      });
    default:
      return state;
  }
}
