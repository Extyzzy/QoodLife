import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  CLEAR_PRODUCTS,
  LOAD_MORE_PRODUCTS_REQUEST,
  LOAD_MORE_PRODUCTS_SUCCESS,
  LOAD_MORE_PRODUCTS_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  ADD_NEW_PRODUCT_SUCCESS,
  EDIT_PRODUCT_SUCCESS,
  ADD_PRODUCT_TO_FAVORITES_SUCCESS,
  REMOVE_PRODUCT_FROM_FAVORITES_SUCCESS,
  REMOVE_PRODUCT_FROM_LIST,
  SET_PRODUCTS_FILTER_SIDEBAR,
} from '../actions/products';

import update from 'immutability-helper';

export default function products(state = {
  isFetching: false,
  loadingMore: false,
  couldLoadMore: false,
  filterSideBar: false,
  totalNrOfItems: 0,
  list: [],
}, action) {
  switch (action.type) {
    case SET_PRODUCTS_FILTER_SIDEBAR:
      return Object.assign({}, state, {
        filterSideBar: action.boolean,
      });
    case FETCH_PRODUCTS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_PRODUCTS_SUCCESS:
      return updateStoreOnFetchProductsSuccess(state, action);
    case FETCH_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        loaded: true,
      });
    case CLEAR_PRODUCTS:
      return Object.assign({}, state, {
        couldLoadMore: false,
        totalNrOfItems: 0,
        list: [],
      });
    case LOAD_MORE_PRODUCTS_REQUEST:
      return Object.assign({}, state, {
        loadingMore: true,
      });
    case LOAD_MORE_PRODUCTS_SUCCESS:
      return updateStoreOnLoadMoreProductsSuccess(state, action);
    case LOAD_MORE_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        loadingMore: false,
      });
    case DELETE_PRODUCT_SUCCESS:
      return updateStoreOnDeleteProductSuccess(state,action);
    case ADD_NEW_PRODUCT_SUCCESS:
      return updateStoreOnAddNewProductSuccess(state, action);
    case EDIT_PRODUCT_SUCCESS:
      return updateStoreOnEditProductSuccess(state, action);
    case ADD_PRODUCT_TO_FAVORITES_SUCCESS:
      return updateStoreOnAddToFavoritesSuccess(state, action);
    case REMOVE_PRODUCT_FROM_LIST:
      return updateStoreOnRemoveProductFromList(state, action);
    case REMOVE_PRODUCT_FROM_FAVORITES_SUCCESS:
      return updateStoreOnRemoveFromFavoritesSuccess(state, action);
    default:
      return state;
  }
}

const updateStoreOnFetchProductsSuccess = (state, action) => {
  const couldLoadMore = action.data.totalNOFRecords > action.data.list.length;

  return Object.assign({}, state, {
    isFetching: false,
    couldLoadMore,
    totalNrOfItems: action.data.totalNOFRecords,
    list: action.data.list,
  });
};

const updateStoreOnLoadMoreProductsSuccess = (state, action) => {
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

const updateStoreOnDeleteProductSuccess = (state, action) => {
  const productIndex = state.list
    .findIndex(e => e.id === action.productId);

  if (productIndex === -1) {
    return state;
  }

  return update(state, {
    list:{
      $splice: [[productIndex, 1]]
    }
    ,
  });
};

const updateStoreOnAddNewProductSuccess = (state, {product}) => {
  return update(state, {
    list: {
      $unshift: [product],
    },
  });
};

const updateStoreOnEditProductSuccess = (state, {product}) => {
  const productIndex = state.list
    .findIndex(({id}) => id === product.id);

  if (productIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [productIndex]: {
        $set: product,
      },
    },
  });
};

const updateStoreOnAddToFavoritesSuccess = (state, {productId}) => {
  const productIndex = state.list
    .findIndex(({id}) => id === productId);

  if (productIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [productIndex]: {
        $apply: (product) => update(product, {
          favorite: {
            $set: true,
          },
        }),
      },
    },
  });
};

const updateStoreOnRemoveProductFromList = (state, {productId}) => {
  const productIndex = state.list
    .findIndex(({id}) => id === productId);

  if (productIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      $splice: [[productIndex, 1]],
    },
  });
};

const updateStoreOnRemoveFromFavoritesSuccess = (state, {productId}) => {
  const productIndex = state.list
    .findIndex(({id}) => id === productId);

  if (productIndex === -1) {
    return state;
  }

  return update(state, {
    list: {
      [productIndex]: {
        $apply: (post) => update(post, {
          favorite: {
            $set: false,
          },
        }),
      },
    },
  });
};
