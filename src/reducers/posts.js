import {
  FETCH_POSTS_FAILURE,
  FETCH_POSTS_REQUEST,
  FETCH_POSTS_SUCCESS,
  CLEAR_POSTS,
  LOAD_MORE_POSTS_REQUEST,
  LOAD_MORE_POSTS_SUCCESS,
  LOAD_MORE_POSTS_FAILURE,
  ADD_POST_TO_FAVORITES_SUCCESS,
  REMOVE_POST_FROM_FAVORITES_SUCCESS,
  REMOVE_POST_FROM_LIST,
  DELETE_POST_SUCCESS,
  ADD_NEW_POST_SUCCESS,
  EDIT_POST_SUCCESS,
} from "../actions/posts";

import update from "immutability-helper";

export default function posts(state = {
  isFetching: false,
  loadingMore: false,
  couldLoadMore: false,
  totalNrOfItems: 0,
  list: [],
}, action) {
  switch (action.type) {
    case FETCH_POSTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_POSTS_SUCCESS:
      return updateStoreOnFetchPostsSuccess(state, action);
    case FETCH_POSTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
      });
    case CLEAR_POSTS:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_POSTS_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_POSTS_SUCCESS:
      return updateStoreOnLoadMorePostsSuccess(state, action);
    case LOAD_MORE_POSTS_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case ADD_POST_TO_FAVORITES_SUCCESS:
      return updateStoreOnAddToFavoritesSuccess(state, action);
    case REMOVE_POST_FROM_FAVORITES_SUCCESS:
      return updateStoreOnRemoveFromFavoritesSuccess(state, action);
    case REMOVE_POST_FROM_LIST:
      return updateStoreOnRemovePostFromList(state, action);
    case DELETE_POST_SUCCESS:
      return updateStoreOnRemovePostFromList(state, action);
    case ADD_NEW_POST_SUCCESS:
      return updateStoreOnAddNewPostSuccess(state, action);
    case EDIT_POST_SUCCESS:
      return updateStoreOnEditPostSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchPostsSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMorePostsSuccess = (state, action) => {
  const couldLoadMore = state.totalNrOfItems > state.list.length +
    action.data.list.length;

  return Object.assign({}, state, {
    loadingMore: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: update(state.list, {
      $push: action.data.list,
    }),
  });
};

const updateStoreOnAddToFavoritesSuccess = (state, {postId}) => {
  const postIndex = state.list
    .findIndex(({id}) => id === postId);

  if (postIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [postIndex]: {
        $apply: (post) => update(post, {
          favorite: {
            $set: true,
          },
        }),
      },
    },
  });
};

const updateStoreOnRemoveFromFavoritesSuccess = (state, {postId}) => {
  const postIndex = state.list
    .findIndex(({id}) => id === postId);

  if (postIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [postIndex]: {
        $apply: (post) => update(post, {
          favorite: {
            $set: false,
          },
        }),
      },
    },
  });
};

const updateStoreOnRemovePostFromList = (state, {postId}) => {
  const postIndex = state.list
    .findIndex(({id}) => id === postId);

  if (postIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      $splice: [[postIndex, 1]],
    },
  });
};

const updateStoreOnAddNewPostSuccess = (state, {post}) => {
  return update(state, {
    list: {
      $unshift: [post],
    },
  });
};

const updateStoreOnEditPostSuccess = (state, {post}) => {
  const postIndex = state.list
    .findIndex(({id}) => id === post.id);

  if (postIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [postIndex]: {
        $set: post,
      },
    },
  });
};
