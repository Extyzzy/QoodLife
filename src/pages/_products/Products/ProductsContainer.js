import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import moment from 'moment';

import Products from './Products';

import {
  fetchProductsWithStore,
  clearProducts,
  loadMoreProductsUsingStore,
  setProductsFilterSidebar,
} from '../../../actions/products';

import {audience} from "../../../helpers/sideBarAudience";

class ProductsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      viewMode: 'icons',
    };

    this.createdAt = moment().utcOffset(0);

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
            navigation: nextNavigation,
            __GET: {
              take: 9,
              audience: audience(nextNavigation),
            },
          }
        )
      );
    }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;
      dispatch(
        setProductsFilterSidebar(false)
      );

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

    dispatch(
      setProductsFilterSidebar(true)
    );

    this.fetchProductsListFetcher = dispatch(
      fetchProductsWithStore(
        accessToken,
        {
          navigation,
          __GET: {
            take: 9,
            audience: audience(navigation),
          },
        },
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
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: 9,
              skip: productsList.length,
              audience: audience(navigation),
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

    const { isLoaded, viewMode } = this.state;

    return (
      <Products
        isFetching={isFetching}
        isLoaded={isLoaded}
        products={productsList}
        onChangeViewMode={(m) => {
          if (m !== viewMode) {
            this.setState({
              viewMode: m,
            });
          }
        }}
        viewMode={viewMode}
        onLoadMore={this.loadMore}
        showLoadMore={couldLoadMore}
        loadingMore={loadingMore}
      />
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

export default connect(mapStateToProps)(ProductsContainer);
