import {
  SET_HOBBIES,
  SET_HOBBIES_FOR_CHILDREN,
} from '../actions/hobbies';


export default function hobbies(state = {
  list: [],
  forChildren: [],
}, action) {
  switch (action.type) {
    case SET_HOBBIES:
      return Object.assign({}, state, {
        list: action.data.list,
      });
    case SET_HOBBIES_FOR_CHILDREN:
      return Object.assign({}, state, {
        forChildren: action.data.list,
      });
    default:
      return state;
  }
}
