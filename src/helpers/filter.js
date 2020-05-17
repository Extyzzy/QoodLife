import { isNil } from 'lodash';

import {
  SIDEBAR_GROUP_RELATED,
  SIDEBAR_GROUP_FOR_CHILDRENS,
} from '../actions/navigation';

export const FILTER_FAVORITE = 'favorite';
export const FILTER_OWNED = 'owned';
export const FILTER_USER_RELATED = 'user-related';
export const FILTER_FEATURED = 'featured';
export const FILTER_RELATED = 'related';

function getNavigationGetPart({
  group,
  navigation,
  navigation: {
    selectedHobby,
    selectedCategory,
    selectedFilter,
    selectedTitle,
  },
}) {
  const __GET = selectedHobby
    ? {
        hobbies: [selectedHobby],
          ...(selectedFilter
            ? {filters: [selectedFilter]}
            : {}
          ),
          ...(selectedTitle
            ? {titles: [selectedTitle]}
            : {}
          ),
      }
    : (selectedCategory
      ? {categories: [selectedCategory]}
      : {});

  if (navigation) {
    switch (group) {
      case FILTER_OWNED:
        return __GET;
      case FILTER_USER_RELATED:
        return __GET;
      case FILTER_FEATURED:
        return {};
      default:
        return navigation.sidebarOpenedGroup === SIDEBAR_GROUP_RELATED
        && ! navigation.selectedHobby
        && ! navigation.selectedCategory
          ? {} : __GET;
    }
  }

  return {};
}

function getQueryDataParams(_params = {}, keyPrefix) {
  let params = {};
  for (let k in _params) {
    if (_params.hasOwnProperty(k)) {
      const v = _params[k];

      /**
       * Skip null or undefined values.
       */
      if ( ! isNil(v)) {
        if (keyPrefix) {
          k = `${keyPrefix}[${k}]`;
        }

        if (v instanceof Object && v.constructor.name === 'Object') {
          const __params = getQueryDataParams(v, k);

            for (let i in __params) {
              if (__params.hasOwnProperty(i)) {
                params[i] = __params[i];
              }
            }
        }
        else {
          params[k] = v;
        }
      }
    }
  }

  return params;
}

/**
 * Before processing params we'll transform it
 * in a single level object, this means that
 * nested objects will be converted.
 *
 * Note! Nil values will be skipped.
 *
 * @param _params
 * @returns {string}
 */
export function getQueryData(_params = {}) {
  const params = getQueryDataParams(_params);

  return Object.keys(params).map(k => (
    params[k] instanceof Array
      ? params[k].map((v, i) => (
        `${k}[]=${encodeURIComponent(params[k][i])}`
      )).join('&')
      : `${k}=${encodeURIComponent(params[k])}`
  )).join('&');
}

function getGETPart({group, navigation = {}, __GET = {}}) {
  const queryData = getQueryData({
    ...getNavigationGetPart({group, navigation}),
    ...__GET,
  });


  const childrenNav =
    navigation.sidebarOpenedGroup === SIDEBAR_GROUP_FOR_CHILDRENS
      ? 'children=true&' : '';

  return queryData ? `?${childrenNav}${queryData}` : childrenNav
    ? `?children=true` : '';
}

function getNavigationPart({group, navigation = {}}) {
  if (navigation) {
    switch (group) {
      case FILTER_OWNED:
      case FILTER_USER_RELATED:
      case FILTER_FEATURED:
        return '';
      default:
        return (navigation.sidebarOpenedGroup === SIDEBAR_GROUP_RELATED
          || navigation.sidebarOpenedGroup === SIDEBAR_GROUP_FOR_CHILDRENS)
          && ! navigation.selectedHobby
          && ! navigation.selectedCategory
            ? `/${FILTER_RELATED}` : '';
    }
  }

  return '';
}

function getGroupPart({group}) {
  switch (group) {
    case FILTER_FAVORITE:
    case FILTER_OWNED:
    case FILTER_USER_RELATED:
    case FILTER_FEATURED:
      return `/${group}`;
    default:
      return '';
  }
}

/**
 *
 *
 * {url} [/favorite] [/related]
 * {url} [/favorite] [?[hobbies[]=][&categories[]=]]
 * {url} [/owned] [?[hobbies[]=][&categories[]=]]
 *
 * @param url
 * @param filter
 * @returns {string}
 */
export function getUrlWithFilter(url, filter) {
  return url
    + getGroupPart(filter)
    + getNavigationPart(filter)
    + getGETPart(filter);
}
