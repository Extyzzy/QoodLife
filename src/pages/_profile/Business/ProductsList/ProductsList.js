import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProductsList.scss';
import moment from 'moment';
import {
  fetchProductsWithStore,
  loadMoreProductsUsingStore
} from '../../../../actions/products';
import { FILTER_OWNED } from '../../../../helpers/filter';
import ComponentsList from '../../../../components/ComponentsList';
import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../constants';
import Loader from '../../../../components/Loader';
import ProductListItem from '../../../_products/Products/components/ListItem';
import { I18n } from 'react-redux-i18n';

class ProductList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.fetchProductsList();
  }

  fetchProductsList() {
    const { dispatch, accessToken, navigation } = this.props;

    this.fetchProductsListFetcher = dispatch(
      fetchProductsWithStore(accessToken, {
        navigation,
        group: FILTER_OWNED,
        __GET: {
          role: 'place'
        }
      })
    );

    this.fetchProductsListFetcher.finally(() => {
      if (!this.fetchProductsListFetcher.isCancelled()) {
        this.setState({
          isLoaded: true
        });
      }
    });
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      productsList
    } = this.props;

    if (!loadingMore) {
      dispatch(
        loadMoreProductsUsingStore(accessToken, {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            before: this.createdAt.unix(),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            skip: productsList.length,
            role: 'place'
          }
        })
      );
    }
  }

  render() {
    const { productsList, isFetching, loadingMore, couldLoadMore } = this.props;
    if (isFetching) {
      return <Loader />;
    }

    return (
      <div>
        {(!!productsList.length && (
          <ComponentsList
            component={ProductListItem}
            list={productsList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('products.productsNotfound')}
        {couldLoadMore && (
          <div className="text-center">
            <button
              className="btn btn-default"
              disabled={loadingMore}
              onClick={this.loadMore}
            >
              {loadingMore
                ? I18n.t('general.elements.loading')
                : I18n.t('general.elements.loadMore')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    loadingMore: state.products.loadingMore,
    couldLoadMore: state.products.couldLoadMore,
    productsList: state.products.list,
    isFetching: state.products.isFetching
  };
}

export default connect(mapStateToProps)(withStyles(s)(ProductList));
