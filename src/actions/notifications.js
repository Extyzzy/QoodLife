import { fetchAuthorizedApiRequest, fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";
import { appendToFormData } from '../helpers/form';

export const FETCH_NOTIFICATIONS_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';
export const CLEAR_GROUPS_NOTIFICATIONS = 'CLEAR_GROUPS_NOTIFICATIONS';
export const CLEAR_INVITATIONS_NOTIFICATIONS = 'CLEAR_INVITATIONS_NOTIFICATIONS';
export const FETCH_CHAT_NOTIFICATIONS_SUCCESS = 'FETCH_CHAT_NOTIFICATIONS_SUCCESS';
export const CLEAR_SPECIFIC_CHAT_NOTIFICATION = 'CLEAR_SPECIFIC_CHAT_NOTIFICATION';
export const FETCH_REST_NOTIFICATIONS = 'FETCH_REST_NOTIFICATIONS';
export const FETCH_NOTIFICATION_TYPES_REQEST = 'FETCH_NOTIFICATION_TYPES_REQEST';
export const FETCH_NOTIFICATION_TYPES_ERROR = 'FETCH_NOTIFICATION_TYPES_ERROR';
export const FETCH_NOTIFICATION_TYPES_SUCCES = 'FETCH_NOTIFICATION_TYPES_SUCCES';
export const CLEAR_VIEWED_NOTIFICATIONS = 'CLEAR_VIEWED_NOTIFICATIONS';

export function reqestFetchNotificationTypes() {
  return {
    type: FETCH_NOTIFICATION_TYPES_REQEST
  };
}
export function fetchNotificationTypesError() {
  return {
    type: FETCH_NOTIFICATION_TYPES_ERROR
  };
}
export function receiveFetchNotificationTypes(data) {
  return {
    type: FETCH_NOTIFICATION_TYPES_SUCCES,
    data
  };
}

export function receiveFetchRestNotifications(data) {
  return {
    type: FETCH_REST_NOTIFICATIONS,
    data
  };
}

export function receiveFetchNotifications(data) {
  return {
    type: FETCH_NOTIFICATIONS_SUCCESS,
    data,
  };
}

export function receiveChatNotifications(data) {
  return {
    type: FETCH_CHAT_NOTIFICATIONS_SUCCESS,
    data,
  };
}

export function clearGroupsNotifications() {
  return {
    type: CLEAR_GROUPS_NOTIFICATIONS
  };
}

export function clearInvitationsNotifications() {
  return {
    type: CLEAR_INVITATIONS_NOTIFICATIONS
  };
}

export function clearChatUserNotification(userId) {
  return {
    type: CLEAR_SPECIFIC_CHAT_NOTIFICATION,
    userId
  };
}

export function removeNotificationsFromStore(identifiers, fromGroups = false) {
  return {
    type: CLEAR_VIEWED_NOTIFICATIONS,
    fromGroups,
    identifiers
  }
}

export function setViewedNotification(dispatch, accessToken, list, fromGroups) {
  if(!!list.length) {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/notifications/viewed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: appendToFormData(
            new FormData(), {
              encodedNotificationIds: list.map(n => n.id)
            }
          )
        }
      )
    )
    .then(response => {
      switch(response.status) {
        case 201:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to set viewed notification.')
          );
      }
    })
    .then(() => {
      dispatch(removeNotificationsFromStore(list.map(n => n.id), fromGroups))
    });
  }
}

export function fetchNotifications(dispatch, accessToken, activeModule= false) {
  if(accessToken) {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/notifications?type=onlyUnViewed${activeModule? '&module=' : ''}${activeModule? activeModule : ''}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
    .then(response => {
      switch(response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch hobbies.')
          );
      }
    });
  }

  return null;
}


export function fetchUnviewedMessages(dispatch, accessToken) {
  if(accessToken) {
    return dispatch(
      fetchAuthorizedApiRequest(`/v1/messages/unviewed`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
    .then(response => {
      switch(response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch hobbies.')
          );
      }
    });
  }

  return null;
}

export function fetchNotificationTypes() {
  return dispatch => {
    dispatch(reqestFetchNotificationTypes());

    return fetchApiRequest('/v1/notifications/details')
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:

            dispatch(fetchNotificationTypesError());

            return Promise.reject(
              new SilencedError('Failed to fetch notification types.')
            );
        }
      })
      .then(data => {
        dispatch(receiveFetchNotificationTypes(data));

        return Promise.resolve();
      });
  };
}
