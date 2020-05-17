import {
  SET_USER_DATA,
  EDIT_USER_SUCCESS,
  UPDATE_PENDING_STATUS,
  UPDATE_CONFIRMED,
  SET_INVITED_USERS_LIST,
  APPENT_USER_TO_INVITED_LIST,
  UPDATE_INVOICE_USER,
  UPDATE_CALENDAR_FILTER,
} from '../actions/user';

import {
  ATTACH_HOBBY_SUCCESS,
  DETACH_HOBBY_SUCCESS,
} from '../actions/hobbies';

import { SWITCH_PLACE_AVATAR } from '../actions/places';
import { SWITCH_PROFESSIONAL_AVATAR } from '../actions/professionals';
import { SWITCH_USER_AVATAR } from '../actions/user';

import update from "immutability-helper";

export default function user(state = {
  invitedUsers: [],
}, action) {
  switch (action.type) {
    case UPDATE_PENDING_STATUS:
      return updatePendingStatus(state, action);
    case UPDATE_INVOICE_USER:
      return updateInvoiceUser(state, action);
    case UPDATE_CONFIRMED:
      return update(state, {
        confirmed: {$set: true}
      });
    case SET_USER_DATA:
      return Object.assign({}, state, {
        ...action.data
      });
    case SWITCH_USER_AVATAR:
      return Object.assign({}, state, {
        avatar: action.avatar
      });
    case UPDATE_CALENDAR_FILTER:
      return update(state, {
        placeDetails: {calendar: {filters: {$set: action.filters}}}
      });
    case SWITCH_PLACE_AVATAR:
      return update(state, {
        placeDetails: {logo: {$set: action.avatar}}
      });
    case SWITCH_PROFESSIONAL_AVATAR:
      return update(state, {
        profDetails: {avatar: {$set: action.avatar}}
      });
    case EDIT_USER_SUCCESS:
      return updateStoreOnEditUserSuccess(state, action);
    case SET_INVITED_USERS_LIST:
      return Object.assign({}, state, {
        invitedUsers: action.invitedUsers
      });
    case APPENT_USER_TO_INVITED_LIST:
      return update(state, {
          invitedUsers: {
              $push: [action.user],
          }
      });
    case ATTACH_HOBBY_SUCCESS:
      if(action.childAudience) {
        return updateStoreAttachHobbySuccessForChildren(state, action.hobby);
      }

      return updateStoreAttachHobbySuccess(state, action.hobby);
    case DETACH_HOBBY_SUCCESS:
      if(action.childAudience) {
        return updateStoreDetachHobbySuccessForChildren(state, action.hobby);
      }

      return updateStoreDetachHobbySuccess(state, action.hobby);
    default:
      return state;
  }
}

const updateInvoiceUser = (state, {invoiceDetails}) => {
  return update(state, {
    invoiceDetails: {$set: invoiceDetails}
  });
};

const updatePendingStatus = (state, {status, role}) => {

  if (role === 'professional') {
    return update(state, {
      profPending: {$set: status}
    });
  }

  if (role === 'place') {
    return update(state, {
      placePending: {$set: status}
    });
  }
};

const updateStoreOnEditUserSuccess = (state, {user}) => {
  return Object.assign({}, state, {
    ...user
  });
};

const updateStoreDetachHobbySuccess = (state, hobby) => {
  const hobbyIndex = state.hobbies.findIndex(({id}) => id === hobby.id);

  if (hobbyIndex === -1) {
    return state;
  }

  return update(state, {
         hobbies: {
            $splice: [[hobbyIndex, 1]],
        }
    });
};

const updateStoreDetachHobbySuccessForChildren = (state, hobby) => {
  const hobbyIndex = state.childrenHobbies.findIndex(({id}) => id === hobby.id);

  if (hobbyIndex === -1) {
    return state;
  }

  return update(state, {
         childrenHobbies: {
            $splice: [[hobbyIndex, 1]],
        }
    });
};

const updateStoreAttachHobbySuccess = (state, hobby) => {
  return update(state, {
      hobbies: {
          $push: [hobby],
      }
  });
};

const updateStoreAttachHobbySuccessForChildren = (state, hobby) => {
  return update(state, {
      childrenHobbies: {
          $push: [hobby],
      }
  });
};
