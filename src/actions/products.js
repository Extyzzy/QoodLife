import { fetchAuthorizedApiRequest } from '../fetch';
import { getUrlWithFilter } from '../helpers/filter';
import { SilencedError } from "../exceptions/errors";

/*----------------------- FETCH PRODUCTS -----------------------*/

export const FETCH_PRODUCTS_REQUEST = 'FETCH_PRODUCTS_REQUEST';
export const FETCH_PRODUCTS_SUCCESS = 'FETCH_PRODUCTS_SUCCESS';
export const FETCH_PRODUCTS_FAILURE = 'FETCH_PRODUCTS_FAILURE';
export const CLEAR_PRODUCTS = 'CLEAR_PRODUCTS';
export const SET_PRODUCTS_FILTER_SIDEBAR = 'SET_PRODUCTS_FILTER_SIDEBAR';

function requestFetchProducts() {
  return {
    type: FETCH_PRODUCTS_REQUEST,
  };
}

export function setProductsFilterSidebar(boolean) {
  return {
    type: SET_PRODUCTS_FILTER_SIDEBAR,
    boolean,
  };
}

export function receiveFetchProducts(data) {
  return {
    type: FETCH_PRODUCTS_SUCCESS,
    data,
  };
}

function fetchProductsError() {
  return {
    type: FETCH_PRODUCTS_FAILURE,
  };
}

export function clearProducts() {
  return {
    type: CLEAR_PRODUCTS,
  };
}

export function fetchProductsWithStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchProducts(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestFetchProducts());
        },
        onSuccess: data => {
          dispatch(receiveFetchProducts(data));
        },
        onError: () => {
          dispatch(fetchProductsError());
        },
      })
    );
  };
}

export function fetchProducts(accessToken, filter = {}, {beforeFetch, onSuccess, onError} = {}) {
  return dispatch => {
    if (beforeFetch instanceof Function) {
      beforeFetch();
    }

    return dispatch(
      fetchAuthorizedApiRequest(
        getUrlWithFilter('/v1/products', filter),
        {
          ...(accessToken ? {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          } : {})
        })
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
            new SilencedError('Failed to fetch products.')
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

/*------------------------ LOAD MORE PRODUCTS -----------------------*/

export const LOAD_MORE_PRODUCTS_REQUEST = 'LOAD_MORE_PRODUCTS_REQUEST';
export const LOAD_MORE_PRODUCTS_SUCCESS = 'LOAD_MORE_PRODUCTS_SUCCESS';
export const LOAD_MORE_PRODUCTS_FAILURE = 'LOAD_MORE_PRODUCTS_FAILURE';

export function requestLoadMoreProducts() {
  return {
    type: LOAD_MORE_PRODUCTS_REQUEST,
  };
}

export function receiveLoadMoreProducts(data) {
  return {
    type: LOAD_MORE_PRODUCTS_SUCCESS,
    data,
  };
}

export function loadMoreProductsError() {
  return {
    type: LOAD_MORE_PRODUCTS_FAILURE,
  };
}

export function loadMoreProductsUsingStore(accessToken, filter) {
  return dispatch => {
    return dispatch(
      fetchProducts(accessToken, filter, {
        beforeFetch: () => {
          dispatch(requestLoadMoreProducts());
        },
        onSuccess: data => {
          dispatch(receiveLoadMoreProducts(data));
        },
        onError: () => {
          dispatch(loadMoreProductsError());
        },
      })
    );
  };
}

/*---------------------- ADD PRODUCTS TO FAVORITES ---------------------*/

export const ADD_PRODUCT_TO_FAVORITES_SUCCESS = 'ADD_PRODUCT_TO_FAVORITES_SUCCESS';

export function receiveAddToFavorites(productId) {
  return {
    type: ADD_PRODUCT_TO_FAVORITES_SUCCESS,
    productId,
  };
}

export function addToFavorites(accessToken, productId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/products/${productId}/favorite`,
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
              new SilencedError('Failed to add product to favorites.')
            );

        }
      });
  };
}


/*---------------------- REMOVE PRODUCT FROM FAVORITES ---------------------*/

export const REMOVE_PRODUCT_FROM_FAVORITES_SUCCESS = 'REMOVE_PRODUCT_FROM_FAVORITES_SUCCESS';

export function receiveRemoveFromFavorites(productId) {
  return {
    type: REMOVE_PRODUCT_FROM_FAVORITES_SUCCESS,
    productId,
  };
}

export function removeFromFavorites(accessToken, productId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/products/${productId}/favorite`,
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
              new SilencedError('Failed to remove product from favorites.')
            );

        }
      });
  };
}

/*--------------------------- DELETE PRODUCT --------------------------*/

export const DELETE_PRODUCT_SUCCESS = 'DELETE_PRODUCT_SUCCESS';

export function receiveDeleteProduct(productId) {
  return {
    type: DELETE_PRODUCT_SUCCESS,
    productId,
  };
}

export function deleteProduct(accessToken, productId) {
  return dispatch => {
    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/products/${productId}`,
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
              new SilencedError('Failed to delete product.')
            );

        }
      });
  };
}

/*--------------------------- CREATE PRODUCT --------------------------*/

export const ADD_NEW_PRODUCT_SUCCESS = 'ADD_NEW_PRODUCT_SUCCESS';

export function receiveAddNewProduct(product) {
  return {
    type: ADD_NEW_PRODUCT_SUCCESS,
    product,
  };
}

/*---------------------------- EDIT PRODUCT ---------------------------*/

export const EDIT_PRODUCT_SUCCESS = 'EDIT_PRODUCT_SUCCESS';

export function receiveEditProduct(product) {
  return {
    type: EDIT_PRODUCT_SUCCESS,
    product,
  };
}

/*------------------ REMOVE PRODUCT FROM REDUX STORE ------------------*/

export const REMOVE_PRODUCT_FROM_LIST = 'REMOVE_PRODUCT_FROM_LIST';

export function removeProductFromList(productId) {
  return {
    type: REMOVE_PRODUCT_FROM_LIST,
    productId,
  };
}
