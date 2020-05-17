import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ProductsList.scss";

import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import ProductListItem from "../../../../_products/Products/components/ListItem";
import { FILTER_FAVORITE } from '../../../../../helpers/filter';
import { confirm } from '../../../../../components/_popup/Confirm';

import {
  clearProducts,
  fetchProductsWithStore,
  removeFromFavorites,
  removeProductFromList,
  loadMoreProductsUsingStore,
} from "../../../../../actions/products";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {I18n} from "react-redux-i18n";

class ProductList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);

    this.listItemActionButtons = this.listItemActionButtons.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(
      clearProducts()
    );
  }

  componentDidMount() {
    this.fetchProductsList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchProductsWithStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation: nextNavigation,
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchProductsListFetcher instanceof Promise) {
      this.fetchProductsListFetcher.cancel();
    }
  }

  fetchProductsList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    this.fetchProductsListFetcher = dispatch(
      fetchProductsWithStore(
        accessToken,
        {
          group: FILTER_FAVORITE,
          navigation,
        }
      )
    );

    this.fetchProductsListFetcher
      .finally(() => {
        if ( ! this.fetchProductsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      })
  }

  onListItemComponentWillUnmount(_this) {
    if (_this.removeFromFavoritesFetcher instanceof Promise) {
      _this.removeFromFavoritesFetcher.cancel();
    }
  }

  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken
    } = this.props;

    const {
      isRemovingFromFavorites,
    } = _this.state;

    const {
      id: productId,
    } = _this.props.data;

    return [
      <button
        key="RemoveFromFavorites"
        className="round-button remove"
        onClick={() => {
          if (!isRemovingFromFavorites) {
            confirm(I18n.t('general.components.confirmFavorite'))
              .then(() => {
                _this.setState({
                  isRemovingFromFavorites: true,
                }, () => {

                  _this.removeFromFavoritesFetcher = dispatch(
                    removeFromFavorites(
                      accessToken,
                      productId
                    )
                  );

                  _this.removeFromFavoritesFetcher
                    .then(() => {
                      _this.setState({
                        isRemovingFromFavorites: false,
                      }, () => {
                        dispatch(
                          removeProductFromList(productId)
                        );
                      });
                    });
                });
              });
          }
        }}
      />,
    ];
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      productsList,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreProductsUsingStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: productsList.length,
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      productsList,
    } = this.props;

    if (isFetching) {
      return (
        <Loader sm contrast />
      );
    }

    const { isLoaded } = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!productsList && !!productsList.length && (
              <ComponentsList
                list={productsList}
                component={ProductListItem}
                onComponentWillUnmount={
                  this.onListItemComponentWillUnmount
                }
                actionButtons={
                  this.listItemActionButtons
                }
                popupActionButtons={() => []}
              />
            )) || I18n.t('products.productsNotfound')
          )
        }

        {
          couldLoadMore && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {
                  loadingMore ?
                    I18n.t('general.elements.loading') :
                    I18n.t('general.elements.loadMore')
                }
              </button>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    isFetching: state.products.isFetching,
    loadingMore: state.products.loadingMore,
    couldLoadMore: state.products.couldLoadMore,
    productsList: state.products.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,  
      selectedFilter: state.navigation.selectedFilter,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default connect(mapStateToProps)(withStyles(s)(ProductList));
