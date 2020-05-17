import update from 'immutability-helper';

import {
  FETCH_ADS_BLOCKS_REQUEST,
  FETCH_ADS_BLOCKS_SUCCESS,
  FETCH_ADS_BLOCKS_FAILURE,
  LOAD_MORE_ADS_BLOCKS_SUCCES
} from '../actions/adsModule';

export default function adsModule(state = {
  isFetching: false,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_ADS_BLOCKS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ADS_BLOCKS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        list: action.data.list,
      });
    case FETCH_ADS_BLOCKS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case LOAD_MORE_ADS_BLOCKS_SUCCES:
      return Object.assign({}, state, {
        list: update(state.list, {
          $push: action.data.list,
        }),
      });
    default:
      return state;
  }
}
