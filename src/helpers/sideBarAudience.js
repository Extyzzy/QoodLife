import {SIDEBAR_GROUP_FOR_CHILDRENS, SIDEBAR_GROUP_RELATED} from "../actions/navigation";

export function audience(navigation) {
  let hobbiesAudience = '';

  switch (navigation.sidebarOpenedGroup) {
    case SIDEBAR_GROUP_RELATED:
      hobbiesAudience = 'adults';
      break;
    case SIDEBAR_GROUP_FOR_CHILDRENS:
      hobbiesAudience = 'children';
      break;
    default:
      hobbiesAudience = 'all';
  }

    return hobbiesAudience;
}
