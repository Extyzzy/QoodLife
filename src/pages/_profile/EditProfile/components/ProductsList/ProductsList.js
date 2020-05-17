import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import moment from 'moment';
import Slider from 'react-slick';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProductsList.scss';
import Loader from '../../../../../components/Loader';
import ViewModeSwitcher from '../../../../../components/ViewModeSwitcher/ViewModeSwitcher';
import ComponentsList from '../../../../../components/ComponentsList';
import ProductsListItem from '../../../../../pages/_products/Products/components/ListItem';
import { settingsForListitem } from '../../../../../components/_carousel/SliderSettingsMobile';
import { FILTER_OWNED } from '../../../../../helpers/filter';
import CreateProductButton from '../../../../_products/Products/components/CreateProductButton';
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import {
  clearProducts,
  fetchProductsWithStore,
  deleteProduct,
  receiveDeleteProduct,
  loadMoreProductsUsingStore
} from '../../../../../actions/products';
import classes from 'classnames';
import { MOBILE_VERSION, DESKTOP_VERSION } from '../../../../../actions/app';
import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../../constants';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { SilencedError } from '../../../../../exceptions/errors';

class ProductsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      viewMode: 'list',
      isLoaded: false
    };

    this.createdAt = moment().utcOffset(0);

    this.listItemActionButtons = this.listItemActionButtons.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(clearProducts());
  }

  componentDidMount() {
    this.fetchProductsList();
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, accessToken, role } = this.props;

    const {
      navigation: nextNavigation,
      notificationsList: nextNotificationsList
    } = nextProps;

    if (!isEqual(role, nextProps.role)) {
      dispatch(
        fetchProductsWithStore(accessToken, {
          navigation: nextNavigation,
          group: FILTER_OWNED,
          __GET: {
            role: nextProps.role,
            ids: nextNotificationsList
              ? nextNotificationsList.map(data => data.objectReferenceId)
              : null
          }
        })
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchProductsListFetcher instanceof Promise) {
      this.fetchProductsListFetcher.cancel();
    }
  }

  notificationsIds() {
    const { notificationsList } = this.props;

    if (notificationsList) {
      return notificationsList.map(data => data.objectReferenceId);
    } else {
      return null;
    }
  }

  fetchProductsList() {
    const { dispatch, accessToken, navigation, role } = this.props;

    this.fetchProductsListFetcher = dispatch(
      fetchProductsWithStore(accessToken, {
        navigation,
        group: FILTER_OWNED,
        __GET: {
          role: role,
          ids: this.notificationsIds()
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

  /**
   * Define ListItem action buttons array.
   *
   * @param _this Reference to ProductsListItem
   * @returns {[XML]}
   */
  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      history,
      role,
      promotion,
      demo
    } = this.props;

    const { isRemoving } = _this.state;

    const { id: productId, status } = _this.props.data;

    let buttons = [
      <button
        key="RemoveProduct"
        className={classes('remove round-button', {
          [s.removeButtonIconsMode]: this.state.viewMode === 'icons'})}
        onClick={() => {
          confirm(I18n.t('products.confirmDeleteProduct')).then(() => {
            if (!isRemoving) {
              _this.setState(
                {
                  isRemoving: true
                },
                () => {
                  /**
                   * TODO: Will be needed to confirm
                   * this action before removing.
                   */

                  _this.removeFetcher = dispatch(
                    deleteProduct(accessToken, productId)
                  );

                  _this.removeFetcher.then(() => {
                    _this.setState(
                      {
                        isRemoving: false
                      },
                      () => {
                        dispatch(receiveDeleteProduct(productId));
                      }
                    );
                  });
                }
              );
            }
          });
        }}
      />,
      <button
        key="EditProduct"
        className={classes('edit round-button', {
          [s.editButtonIconsMode]: this.state.viewMode === 'icons'})}
        onClick={() => {
          history.push(`/products/edit/${productId}`, {
            data: _this.props.data,
            role: role
          });
        }}
      />
    ];

    if (!demo && !_this.props.data.public) {
      buttons.push(
        <button
          key="Activate"
          className={classes(s.activate, {
            [s.activateList]: this.state.viewMode === 'list' ,
            [s.pendingList]: status.pending === 'sent not-confirmed' &&
            this.state.viewMode === 'list',
            [s.activateIcon]: this.state.viewMode === 'icons',
            [s.pendingIcon]: status.pending === 'sent not-confirmed' &&
            this.state.viewMode === 'icons'
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/products/${productId}/pending`, {
                ...(accessToken
                  ? {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${accessToken}`
                      }
                    }
                  : {})
              })
            ).then(response => {
              switch (response.status) {
                case 204:
                  status.pending = 'sent not-confirmed';
                  _this.forceUpdate();
                  return;

                case 403:
                  return history.push(`/profile/ads`);

                default:
                  return Promise.reject(
                    new SilencedError('Failed to fetch activate the product.')
                  );
              }
            });
          }}
        >
          {(status.pending === 'sent not-confirmed' &&
            I18n.t('products.pending')) ||
            I18n.t('products.activate')}
        </button>
      );
    }

    if (!promotion && _this.props.data.public) {
      buttons.push(
        <button
          key="Feature"
          className={classes({
            [s.promotedList]: this.state.viewMode === 'list' ,
            [s.pendingList]: status.rightColumn && this.state.viewMode === 'list',
            [s.promotedIcon]: this.state.viewMode === 'icons' ,
            [s.pendingIcon]: status.rightColumn && this.state.viewMode === 'icons'
            })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(
                `/v1/products/${productId}/add-to-right-column`,
                {
                  ...(accessToken
                    ? {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        }
                      }
                    : {})
                }
              )
            ).then(response => {
              switch (response.status) {
                case 204:
                  status.rightColumn = true;
                  _this.forceUpdate();
                  return;

                case 403:
                  return history.push(`/profile/ads`);

                default:
                  return Promise.reject(
                    new SilencedError('Failed to fetch activate top.')
                  );
              }
            });
          }}
        >
          {I18n.t('products.promoted')}
        </button>
      );
    }

    if (promotion && _this.props.data.public) {
      buttons.push(
        <button
          key="Top"
          className={classes({
            [s.activeList]: this.state.viewMode === 'list' ,
            [s.pendingList]: status.top && this.state.viewMode === 'list',
            [s.activeIcon]: this.state.viewMode === 'icons' ,
            [s.pendingIcon]: status.top && this.state.viewMode === 'icons' 
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(
                `/v1/products/${productId}/add-to-top`,
                {
                  ...(accessToken
                    ? {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        }
                      }
                    : {})
                }
              )
            ).then(response => {
              switch (response.status) {
                case 204:
                  status.top = true;
                  _this.forceUpdate();
                  return;

                case 403:
                  return history.push(`/profile/ads`);

                default:
                  return Promise.reject(
                    new SilencedError('Failed to fetch activate top.')
                  );
              }
            });
          }}
        >
          {I18n.t('products.top')}
        </button>,
        <button
          key="Promotion"
          className={classes(s.activate, {
            [s.activateList]: this.state.viewMode === 'list',
            [s.pendingList]: status.promotion && this.state.viewMode === 'list',
            [s.activateIcon]: this.state.viewMode === 'icons',
            [s.pendingIcon]: status.promotion && this.state.viewMode === 'icons'
          })}
          onClick={() => {
            dispatch(
              fetchAuthorizedApiRequest(
                `/v1/products/promotions?product=${productId}`,
                {
                  ...(accessToken
                    ? {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${accessToken}`
                        }
                      }
                    : {})
                }
              )
            ).then(response => {
              switch (response.status) {
                case 201:
                  status.promotion = true;
                  _this.forceUpdate();
                  return;

                case 403:
                  return history.push(`/profile/ads`);

                default:
                  return Promise.reject(
                    new SilencedError('Failed to fetch activate promotion.')
                  );
              }
            });
          }}
        >
          {I18n.t('products.feature')}
        </button>
      );
    }
    return buttons;
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      productsList,
      role
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
            role: role,
            ids: this.notificationsIds()
          }
        })
      );
    }
  }

  render() {
    const {
      isMobile,
      isFetching,
      loadingMore,
      couldLoadMore,
      totalNrOfItems,
      notificationsList,
      setViewedNotification,
      productsList,
      role,
      history,
      match,
      uiVersion
    } = this.props;

    if (isFetching) {
      return <Loader />;
    }

    const { isLoaded, viewMode } = this.state;
    const routeLink = role === 'place' ? 'business' : 'professional';

    return (
      <div
        className={classes({
          [s.root]: uiVersion === DESKTOP_VERSION,
          [s.rootMobile]: uiVersion === MOBILE_VERSION
        })}
      >
        <div className={s.head}>
          <h4>{I18n.t('products.productsEditProfile')}</h4>
          {isMobile &&
            (match.path !== `/profile/${routeLink}/products` && (
              <button
                className={s.seeAll}
                onClick={() => history.push(`/profile/${routeLink}/products`)}
              >
                {I18n.t('administration.menuDropDown.showAll')}
              </button>
            ))}
          <CreateProductButton role={role} isMobile={isMobile} />
        </div>

        {isLoaded &&
          ((!!productsList &&
            !!productsList.length &&
            ((isMobile && (
              <Slider
                className={s.slider}
                beforeChange={(prevIndex, nextIndex) => {
                  if (
                    totalNrOfItems > productsList.length &&
                    nextIndex + 1 === productsList.length
                  ) {
                    this.loadMore();
                  }
                }}
                {...settingsForListitem}
              >
                {productsList.map(item => {
                  return (
                    <div key={`${item.key}_${item.id}`}>
                      <ProductsListItem
                        data={item}
                        className={s.listItem}
                        viewMode="icons"
                      />

                    </div>
                  );
                })}
              </Slider>
            )) || (
              <div>
                <ViewModeSwitcher
                  modes={['list', 'icons']}
                  mode={viewMode}
                  onChange={m => {
                    if (m !== viewMode) {
                      this.setState({
                        viewMode: m
                      });
                    }
                  }}
                />
                <ComponentsList
                  viewMode={viewMode}
                  list={productsList}
                  component={ProductsListItem}
                  onComponentWillUnmount={this.onListItemComponentWillUnmount}
                  showOwnerDetails={false}
                  notificationsList={notificationsList}
                  actionButtons={this.listItemActionButtons}
                  setViewedNotification={setViewedNotification}
                />
              </div>
            ))) ||
            I18n.t('products.productsNotfound'))}

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
    uiVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    demo: state.app.demo,
    user: state.user,
    isFetching: state.products.isFetching,
    loadingMore: state.products.loadingMore,
    couldLoadMore: state.products.couldLoadMore,
    totalNrOfItems: state.groups.totalNrOfItems,
    productsList: state.products.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedFilter: state.navigation.selectedFilter,
      selectedCategory: state.navigation.selectedCategory
    },
    promotion: state.app.promotion
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(s)(ProductsList))
);
