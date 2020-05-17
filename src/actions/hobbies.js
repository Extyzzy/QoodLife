import { fetchApiRequest, fetchAuthorizedApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const SET_HOBBIES = 'SET_HOBBIES';
export const SET_HOBBIES_FOR_CHILDREN = 'SET_HOBBIES_FOR_CHILDREN';

export function setHobbies(data) {
  return {
    type: SET_HOBBIES,
    data,
  };
}

export function setHobbiesForChildren(data) {
  return {
    type: SET_HOBBIES_FOR_CHILDREN,
    data,
  };
}

export function fetchHobbies() {
  const localStorageLang = localStorage.getItem('USER_LANGUAGE');

  return fetchApiRequest(`/v1/hobbies?lang=${localStorageLang ? localStorageLang : 'en'}`)
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

export function fetchAuthUserHobbies(dispatch, accessToken) {
  return dispatch(
    fetchAuthorizedApiRequest(
      `/v1/hobbies`,
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

export function getHobbiesForChildrensOptions() {
  return fetchApiRequest(`/v1/hobbies/for-children`)
  .then(response => {
    switch(response.status) {
      case 200:

        return response.json();

      default:

        return Promise.reject(
          new SilencedError('Failed to fetch hobbies for children.')
        );
    }
  });
}

export default function fetchHobbiesOwned(accessToken, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/owned`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return response.json();

          default:

            if (onError instanceof Function) {
              onError();
            }

            return Promise.reject(
              new SilencedError('Failed fetch hobby.')
            );

        }
      })
      .then(data => {
        if (onSuccess instanceof Function) {
          onSuccess(data);
        }

        return Promise.resolve();
      });
  };
}


export const ATTACH_HOBBY_SUCCESS = 'ATTACH_HOBBY_SUCCESS';

export function receiveattachHobby(hobby, childAudience) {
  return {
    type: ATTACH_HOBBY_SUCCESS,
    hobby,
    childAudience
  };
}

export function attachHobby(accessToken, hobby, childAudience) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/${hobby.id}/attach${childAudience? '?children=true' : ''}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 204:
            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed add hobby.')
            );

        }
      });
  };
}

export const DETACH_HOBBY_SUCCESS = 'DETACH_HOBBY_SUCCESS';

export function receivedetachHobby(hobby, childAudience) {
  return {
    type: DETACH_HOBBY_SUCCESS,
    hobby,
    childAudience
  };
}

export function detachHobby(accessToken, hobby, childAudience) {

  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/${hobby.id}/detach${childAudience? '?children=true' : ''}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 204:

            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed to detach hobby.')
            );

        }
      });
  };
}
