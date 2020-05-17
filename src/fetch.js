import config from './config';
import { Unauthorized } from './exceptions/http';
import { refreshAccessToken, logoutUser } from './actions/user';

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
export function createFetch({ baseUrl, cookie }) {
  const defaults = {
    method: 'GET',
    mode: 'cors',
    headers: {
      Accept: 'application/json',
      ...(cookie ? { Cookie: cookie } : null),
    },
  };

  return (url, options = {}) => (
    fetch(`${baseUrl}${url}`, {
      ...defaults,
      ...options,
      headers: {
        ...defaults.headers,
        ...(options && options.headers),
      },
    })
  );
}

/**
 * A wrapper for createFetch with the
 * default API url as baseUrl.
 *
 * @param {string} url
 * @param {object} options
 */
export function fetchApiRequest(url, options = {}) {
  return createFetch({
    baseUrl: config.apiUrl,
  })(url, options)
  /**
   * Suppress the error that is throwed, and let this
   * to be handled later.
   */
  .then(
    response => response,
    response => response
  );
}

/**
 * A wrapper for fetchApiRequest that also refresh
 * access token if 401 is received at first.
 *
 * Note! This method must be dispatched.
 *
 * @param {string} url
 * @param {object} options
 * @returns {function(*)}
 */
export function fetchAuthorizedApiRequest(url, options = {}) {
  return dispatch => {
    return fetchApiRequest(url, options)
      .then(response => {
        switch (response.status) {
          case 401:

            return dispatch(refreshAccessToken())
              .then(({accessToken}) => fetchApiRequest(url, options))
              .catch(() => {
                dispatch(logoutUser());

                return Promise.reject(
                  new Unauthorized()
                );
              });

          default:

            return response;
        }
      });
  };
}
