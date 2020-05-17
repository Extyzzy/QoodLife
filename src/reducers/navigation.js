import {
  CHANGE_SIDEBAR_GROUP,
  SIDEBAR_GROUP_ALL,
  SET_SELECTED_SIDEBAR_HOBBY,
  CLEAR_SELECTED_SIDEBAR_HOBBY,
  SET_SELECTED_SIDEBAR_CATEGORY,
  CLEAR_SELECTED_SIDEBAR_CATEGORY,
  SET_SIDEBAR_PRODUCT_FILTER,
  CLEAR_SIDEBAR_PRODUCT_FILTER,
  CHANGE_MYPROFILE_STATE,
  CHANGE_CHILDRENS_BLOCK_STATE,
  SET_SIDEBAR_PLACE_TITLE,
  CLEAR_SIDEBAR_PLACE_TITLE,
  SET_SIDEBAR_PROS_TITLE,
  CLEAR_SIDEBAR_PROS_TITLE,
  SET_SEARCH_BOX_QERY,
  CLEAR_SEARCH_BOX_QERY,
  SET_FILTER_CALENDAR,
  CLEAR_FILTER_CALENDAR,
} from '../actions/navigation';

export default function runtime(state = {
  searchQery: '',
  oneWord: false,
  sidebarOpenedGroup: SIDEBAR_GROUP_ALL,
  selectedFilterCalendar: null,
  selectedHobby: null,
  selectedCategory: null,
  selectedFilter: null,
  selectedPlaceTitle: null,
  selectedProsTitle: null,
  Childrens: true,
  MyProfile: true,
}, action) {
  switch (action.type) {
    case SET_FILTER_CALENDAR:
      return Object.assign({}, state, {
        selectedFilterCalendar: action.selectedFilter,
      });
    case CLEAR_FILTER_CALENDAR:
      return Object.assign({}, state, {
        selectedFilterCalendar: null,
      });
    case SET_SEARCH_BOX_QERY:
      return Object.assign({}, state, {
        searchQery: action.query,
        oneWord: action.oneWord
      });
    case CLEAR_SEARCH_BOX_QERY:
      return Object.assign({}, state, {
        searchQery: '',
      });
    case CHANGE_MYPROFILE_STATE:
      return Object.assign({}, state, {
        MyProfile: action.state,
      });
    case CHANGE_CHILDRENS_BLOCK_STATE:
      return Object.assign({}, state, {
        Childrens: action.state,
      });
    case CHANGE_SIDEBAR_GROUP:
      return Object.assign({}, state, {
        sidebarOpenedGroup: action.sidebarOpenedGroup,
        selectedHobby: null,
        selectedCategory: null,
      });
    case SET_SIDEBAR_PLACE_TITLE:
      return Object.assign({}, state, {
        selectedPlaceTitle: action.selectedTitle,
      });
    case CLEAR_SIDEBAR_PLACE_TITLE:
      return Object.assign({}, state, {
        selectedPlaceTitle: null,
      });
      case SET_SIDEBAR_PROS_TITLE:
        return Object.assign({}, state, {
          selectedProsTitle: action.selectedTitle,
        });
      case CLEAR_SIDEBAR_PROS_TITLE:
        return Object.assign({}, state, {
          selectedProsTitle: null,
        });
    case SET_SIDEBAR_PRODUCT_FILTER:
      return Object.assign({}, state, {
        selectedFilter: action.selectedFilter,
      });
    case CLEAR_SIDEBAR_PRODUCT_FILTER:
      return Object.assign({}, state, {
        selectedFilter: null,
      });
    case SET_SELECTED_SIDEBAR_HOBBY:
      return Object.assign({}, state, {
        selectedHobby: action.selectedHobby,
        selectedPlaceTitle: null,
        selectedProsTitle: null,
        selectedFilter: null,
      });
    case CLEAR_SELECTED_SIDEBAR_HOBBY:
      return Object.assign({}, state, {
        selectedHobby: null,
      });
    case SET_SELECTED_SIDEBAR_CATEGORY:
      return Object.assign({}, state, {
        selectedCategory: action.selectedCategory,
        selectedHobby: null,
      });
    case CLEAR_SELECTED_SIDEBAR_CATEGORY:
      return Object.assign({}, state, {
        selectedHobby: null,
        selectedCategory: null,
      });
    default:
      return state;
  }
}
