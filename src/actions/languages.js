import { forEach } from 'lodash';
import { fetchApiRequest } from '../fetch';
import { SilencedError } from "../exceptions/errors";

export const FETCH_LANGUAGES_REQUEST = 'FETCH_LANGUAGES_REQUEST';
export const FETCH_LANGUAGES_SUCCESS = 'FETCH_LANGUAGES_SUCCESS';
export const FETCH_LANGUAGES_FAILURE = 'FETCH_LANGUAGES_FAILURE';

export function receiveFetchLanguages(data) {
  return {
    type: FETCH_LANGUAGES_SUCCESS,
    data,
  };
}

/**
 * Fetch Languages list.
 * Save data in store to load only once.
 *
 * Note! This method must be dispatched.
 *
 * @returns {function(*)}
 */
export function fetchLanguages() {
  return fetchApiRequest('/v1/languages')
    .then(response => {
      switch (response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch languages.')
          );
      }
    })
}

export function languageFromLocalStorage(avalableLanguages) {
  const localStorageLang = localStorage.getItem('USER_LANGUAGE');

  return avalableLanguages.find(lang => lang.short === localStorageLang) || null
}

export function getDefaultLanguage(avalableLanguages) {
  const browserLang = (navigator.userLanguage || navigator.language).substring(0, 2);

  let defaultLang = avalableLanguages.find(lang => lang.default);

  forEach(avalableLanguages, language => {
    if(language.short === browserLang) {
      defaultLang = language;
    }
  });

  return  defaultLang;
}
