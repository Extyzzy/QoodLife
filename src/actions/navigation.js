export const CHANGE_SIDEBAR_GROUP = 'CHANGE_SIDEBAR_GROUP';
export const SIDEBAR_GROUP_ALL = 'SIDEBAR_GROUP_ALL';
export const SIDEBAR_GROUP_RELATED = 'SIDEBAR_GROUP_RELATED';
export const SIDEBAR_GROUP_FOR_CHILDRENS = 'SIDEBAR_GROUP_FOR_CHILDRENS';

export const SET_SELECTED_SIDEBAR_HOBBY = 'SET_SELECTED_SIDEBAR_HOBBY';
export const CLEAR_SELECTED_SIDEBAR_HOBBY = 'CLEAR_SELECTED_SIDEBAR_HOBBY';

export const SET_SELECTED_SIDEBAR_CATEGORY = 'SET_SELECTED_SIDEBAR_CATEGORY';
export const CLEAR_SELECTED_SIDEBAR_CATEGORY = 'CLEAR_SELECTED_SIDEBAR_CATEGORY';
export const CHANGE_MYPROFILE_STATE = 'CHANGE_MYPROFILE_STATE';
export const CHANGE_CHILDRENS_BLOCK_STATE = 'CHANGE_CHILDRENS_BLOCK_STATE';
export const SET_SIDEBAR_PRODUCT_FILTER = 'SET_SIDEBAR_PRODUCT_FILTER';
export const CLEAR_SIDEBAR_PRODUCT_FILTER = 'CLEAR_SIDEBAR_PRODUCT_FILTER';
export const SET_SIDEBAR_PLACE_TITLE = 'SET_SIDEBAR_PLACE_TITLE';
export const CLEAR_SIDEBAR_PLACE_TITLE = 'CLEAR_SIDEBAR_PLACE_TITLE';
export const SET_SIDEBAR_PROS_TITLE = 'SET_SIDEBAR_PROS_TITLE';
export const CLEAR_SIDEBAR_PROS_TITLE = 'CLEAR_SIDEBAR_PROS_TITLE';
export const SET_SEARCH_BOX_QERY = 'SET_SEARCH_BOX_QERY';
export const CLEAR_SEARCH_BOX_QERY = 'CLEAR_SEARCH_BOX_QERY';
export const SET_FILTER_CALENDAR = 'SET_FILTER_CALENDAR';
export const CLEAR_FILTER_CALENDAR = 'CLEAR_FILTER_CALENDAR';

export function setFilterCalendar(selectedFilter) {
  return {
    type: SET_FILTER_CALENDAR,
    selectedFilter,
  };
}

export function clearFilterCalendar() {
  return {
    type: CLEAR_FILTER_CALENDAR,
  };
}

export function setSearchBoxQery(query, oneWord) {
  return {
    type: SET_SEARCH_BOX_QERY,
    query,
    oneWord
  }
}

export function clearSearchBoxQery() {
  return {
    type: CLEAR_SEARCH_BOX_QERY,
  }
}

export function myProfileBlockChange(state) {
  return {
    type: CHANGE_MYPROFILE_STATE,
    state,
  };
}

export function childrensBlockStateChange(state) {
  return {
    type: CHANGE_CHILDRENS_BLOCK_STATE,
    state,
  };
}

export function changeSidebarGroup(sidebarOpenedGroup) {
  return {
    type: CHANGE_SIDEBAR_GROUP,
    sidebarOpenedGroup,
  };
}

export function setSelectedSidebarHobby(selectedHobby) {
  return {
    type: SET_SELECTED_SIDEBAR_HOBBY,
    selectedHobby,
  };
}

export function setSidebarProductFilter(selectedFilter) {
  return {
    type: SET_SIDEBAR_PRODUCT_FILTER,
    selectedFilter,
  };
}

export function clearSidebarProductFilter() {
  return {
    type: CLEAR_SIDEBAR_PRODUCT_FILTER,
  };
}

export function setSidebarPlacesTitle(selectedTitle) {
  return {
    type: SET_SIDEBAR_PLACE_TITLE,
    selectedTitle,
  };
}

export function clearSidebarPlacesTitle() {
  return {
    type: CLEAR_SIDEBAR_PLACE_TITLE,
  };
}

export function setSidebarProsTitle(selectedTitle) {
  return {
    type: SET_SIDEBAR_PROS_TITLE,
    selectedTitle,
  };
}

export function clearSidebarProsTitle() {
  return {
    type: CLEAR_SIDEBAR_PROS_TITLE,
  };
}

export function clearSelectedSidebarHobby() {
  return {
    type: CLEAR_SELECTED_SIDEBAR_HOBBY,
  };
}

export function setSelectedSidebarCategory(selectedCategory) {
  return {
    type: SET_SELECTED_SIDEBAR_CATEGORY,
    selectedCategory,
  };
}

export function clearSelectedSidebarCategory() {
  return {
    type: CLEAR_SELECTED_SIDEBAR_CATEGORY,
  };
}
