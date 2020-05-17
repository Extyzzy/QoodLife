import React, { Component } from "react";
import PropTypes from "prop-types";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Products.scss";
import ViewModeSwitcher from '../../../components/ViewModeSwitcher';
import Calendar from '../../../components/Calendar';
import Layout from "../../../components/_layout/Layout/Layout";
import Loader from "../../../components/Loader/Loader";
import ComponentsList from "../../../components/ComponentsList/ComponentsList";
import ProductsListItem from "./components/ListItem";
import classes from 'classnames';
import { connect } from 'react-redux';
import { MOBILE_VERSION } from '../../../actions/app';
import {I18n} from 'react-redux-i18n';

class Products extends Component {

  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    products: PropTypes.array.isRequired,
    onItemComponentWillUnmount: PropTypes.func,
    onItemPopupComponentWillUnmount: PropTypes.func,
    itemActionButtons: PropTypes.func,
    itemPopupActionButtons: PropTypes.func,
    showLoadMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
  };

  getUIVersion() {
    const { UIVersion } = this.props;

    if(UIVersion === MOBILE_VERSION){
      return true
    }

    return false;
  }

  render() {
    const {
      isFetching,
      isLoaded,
      isAuthenticated,
      products,
      onChangeViewMode,
      viewMode,
      showLoadMore,
      onLoadMore,
      loadingMore,
    } = this.props;

    const isMobile = this.getUIVersion();

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
      >
        <div className={classes(s.root, {
          [s.mobile]: isMobile
        })}>
          <div className={s.header}>
            {
              isFetching && (
                <Loader className={s.loader} sm contrast/>
              )
            }
          </div>
          {
            isLoaded && (
              <div>
                {
                  isAuthenticated && (
                    <Calendar />
                  )
                }
                {
                  (products && products.length > 0 && (
                    <div>
                      {
                        !isMobile && (
                          <ViewModeSwitcher
                            className={s.viewModeSwitcher}
                            modes={['list', 'icons']}
                            mode={viewMode}
                            onChange={onChangeViewMode}
                          />
                        )
                      }

                      <ComponentsList
                        className={s.productsList}
                        component={ProductsListItem}
                        list={products}
                        viewMode={viewMode}
                      />

                    </div>
                  )) || I18n.t('products.productsNotfound')
                }
              </div>
            )
          }

          {
            showLoadMore && (
              <div className="text-center">
                <button
                  className="btn btn-default"
                  disabled={loadingMore}
                  onClick={onLoadMore}
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
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Products));
