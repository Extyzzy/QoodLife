import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import moment from 'moment';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ProductsList.scss";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import ProductsListItem from "../../../../../pages/_products/Products/components/ListItem";
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import ViewModeSwitcher from '../../../../../components/ViewModeSwitcher/ViewModeSwitcher';
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";
import {
  clearProducts,
  fetchProductsWithStore,
  loadMoreProductsUsingStore,
  setProductsFilterSidebar,
} from "../../../../../actions/products";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import {FILTER_OWNED} from "../../../../../helpers/filter";

class ProductsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      viewMode: 'icons'
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
      ownerID,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchProductsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
            __GET: {
              user: ownerID,
              role: 'place',
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
      ownerID,
    } = this.props;

    dispatch(
      setProductsFilterSidebar(true)
    );

    this.fetchProductsListFetcher = dispatch(
      fetchProductsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            user: ownerID,
            role: 'place',
          },
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
      });
  }

  /**
   * Function to be triggered on ListItem componentWillUnmount
   * to cancel fetcher Promise if is still fetching.
   *
   * @param _this Reference to ProductsListItem
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      productsList,
      ownerID,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreProductsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: productsList.length,
              user: ownerID,
              role: 'place',
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isMobile,
      isFetching,
      loadingMore,
      couldLoadMore,
      productsList,
      totalNrOfItems
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const { isLoaded, viewMode } = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!productsList && !!productsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  {...settingsForListitem}
                >
                  {
                    productsList.map(item => {
                      return (
                        <div key={`${item.key}_${item.id}`}>
                          <ProductsListItem
                            data={item}
                            className={s.listItem}
                            viewMode="icons"
                          />
                        </div>
                      );
                    })
                  }
                </Slider>
              )) || (
                <div>
                  <ViewModeSwitcher
                    modes={['list', 'icons']}
                    mode={viewMode}
                    onChange={(m) => {
                      if (m !== viewMode) {
                        this.setState({
                          viewMode: m,
                        });
                      }
                    }}
                  />
                <ComponentsList
                  viewMode={viewMode}
                  list={productsList}
                  component={ProductsListItem}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  showOwnerDetails={false}
                  actionButtons={
                    this.listItemActionButtons
                  }
                />
                </div>
              )
            )) || I18n.t('products.productsNotfound')
          )
        }

        {
          couldLoadMore && (totalNrOfItems > productsList.length) && (!!productsList.length) && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {
                  loadingMore
                  ? I18n.t('general.elements.loading')
                  : I18n.t('general.elements.loadMore')
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
    totalNrOfItems: state.products.totalNrOfItems,
    productsList: state.products.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedFilter: state.navigation.selectedFilter,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(ProductsList)));
