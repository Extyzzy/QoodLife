import { remove } from 'lodash';

import {
  FETCH_NOTIFICATIONS_SUCCESS,
  CLEAR_GROUPS_NOTIFICATIONS,
  CLEAR_INVITATIONS_NOTIFICATIONS,
  FETCH_CHAT_NOTIFICATIONS_SUCCESS,
  CLEAR_SPECIFIC_CHAT_NOTIFICATION,
  FETCH_NOTIFICATION_TYPES_REQEST,
  FETCH_NOTIFICATION_TYPES_ERROR,
  FETCH_NOTIFICATION_TYPES_SUCCES,
  FETCH_REST_NOTIFICATIONS,
  CLEAR_VIEWED_NOTIFICATIONS
} from '../actions/notifications';

export default function notifications(state = {
  isFetching: false,
  typesIsFetching: false,
  types: {},
  rest: [],
  forGroups: [],
  forInvitations: [],
  unviewedMessages: null,
  forChat: []
}, action) {
  switch (action.type) {
    case FETCH_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        forGroups: action.data.filter(n => n.module === 'groups'),
        forInvitations: action.data.filter(n => (
          n.module === 'places' || n.module === 'professionals') && (
            n.type === 'reject-pending' || n.type === 'accept-pending'
          )
        ),
      });
    case CLEAR_GROUPS_NOTIFICATIONS:
      return Object.assign({}, state, {
        forGroups: []
      });
    case CLEAR_INVITATIONS_NOTIFICATIONS:
      return Object.assign({}, state, {
        forInvitations: []
      });
    case FETCH_REST_NOTIFICATIONS:
      return Object.assign({}, state, {
        rest: action.data,
      });
    case FETCH_CHAT_NOTIFICATIONS_SUCCESS:
      return Object.assign({}, state, {
        forChat: action.data.list,
        unviewedMessages: !!action.data.list.length
        ? action.data.list.reduce((acc, i) => acc + i.un_viewed_sms, 0)
        : 0,
      });
    case CLEAR_SPECIFIC_CHAT_NOTIFICATION:
      const withoutSpecificConversationMessages = remove(state.forChat, (n) =>
        n.partner_details === action.userId
      );

      return Object.assign({}, state, {
        unviewedMessages: withoutSpecificConversationMessages.reduce((acc, i) => acc + i.un_viewed_sms, 0),
        forChat: withoutSpecificConversationMessages
      });
    case CLEAR_VIEWED_NOTIFICATIONS:
      if(action.fromGroups) {
        return Object.assign({}, state, {
          forGroups: remove(state.forGroups, obj =>
            !action.identifiers.includes(obj.id)
          ),
        });
      } else {
        return Object.assign({}, state, {
          rest: remove(state.rest, obj =>
            !action.identifiers.includes(obj.id)
          ),
        });
      }
    case FETCH_NOTIFICATION_TYPES_REQEST:
      return Object.assign({}, state, {
        typesIsFetching: true,
      });
    case FETCH_NOTIFICATION_TYPES_ERROR:
      return Object.assign({}, state, {
        typesIsFetching: false,
        types: [],
      });
    case FETCH_NOTIFICATION_TYPES_SUCCES:
      return Object.assign({}, state, {
        typesIsFetching: false,
        types: action.data,
      });
    default:
      return state;
  }
}
