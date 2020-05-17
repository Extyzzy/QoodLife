import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Product from './Product';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import { SilencedError } from "../../../exceptions/errors";
import { userIsItemOwner } from '../../../helpers/permissions';
import s from './Product.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import classes from 'classnames';
import update from "immutability-helper";
import MobileVersion from './ProductMobile';
import { MOBILE_VERSION } from '../../../actions/app';
import WarningPopover from '../../../components/WarningPopover';
import {I18n} from 'react-redux-i18n';
import {
  addToFavorites,
  removeFromFavorites
} from "../../../actions/products";
import {isEqual} from "lodash";
import {fetchAdsBlocks} from "../../../actions/adsModule";

class ProductContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      textOver: false,
      data: null,
      isAddingToFavorites: false,
      isRemovingFromFavorites: false,
      activeImageIndex: null,
    };

    this.actionButtons = this.actionButtons.bind(this);
  }

  componentDidMount() {
    const {
      match: {params: {productId: productRoute}},
    } = this.props;

    const productId = productRoute.split('-').pop();

    const {
      dispatch,
      accessToken,
    } = this.props;

    this.postFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/products/${productId}`, {
        ...(accessToken ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );

    this.postFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch product.')
            );
        }
      })
      .then(data => {
        this.setState({data, activeImageIndex: data.gallery.images.findIndex(i => i.default)});
        return Promise.resolve();
      })
      .finally(() => {
        if ( ! this.postFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {

    const {
      match: {params: {productId: productRoute}},
      dispatch,
    } = this.props;

    const productId = productRoute.split('-').pop();

    const {
      match: {params: {productId: NextProductRoute}},
      location: {state: {data: product}}
    } = nextProps;

    const nextProductId = NextProductRoute.split('-').pop();

    if ( ! isEqual(productId, nextProductId)) {
      this.setState({data: product}, () => dispatch(fetchAdsBlocks()));
    }
  }

  componentWillUnmount() {
    if (this.postFetcher instanceof Promise) {
      this.postFetcher.cancel();
    }

    if (this.toggleFavoriteStatusFetcher instanceof Promise) {
      this.toggleFavoriteStatusFetcher.cancel();
    }
  }

  actionButtons() {
      const {
        dispatch,
        accessToken,
        isAuthenticated,
        match: {params: {productId: productRoute}},
        history,
        user,
      } = this.props;

      const productId = productRoute.split('-').pop();

      const {
        isAddingToFavorites,
        isRemovingFromFavorites,
        data,
        data: {
          favorite,
          postedLike,
          owner,
        },
        textOver,
      } = this.state;


    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isAddingToFavorites) {
      text = I18n.t('general.elements.unFolow')
    }

    const accountIsConfirmed = user.confirmed || false;
      const isProductOwner = isAuthenticated
        && userIsItemOwner(user, postedLike, owner);

      const removeFromFavoritesButton = (
        <button
          key="RemoveToFavorites"
          className={classes('btn btn-red', {
            "inTransition": isRemovingFromFavorites,
            "isNotGoing": !isRemovingFromFavorites
          })}
          onMouseOver={() => this.setState({ textOver: true })}
          onMouseOut={() => this.setState({ textOver: false })}
          onClick={() => {
            if ( ! isRemovingFromFavorites) {
              this.setState({
                isRemovingFromFavorites: true,
              }, () => {
                this.toggleFavoriteStatusFetcher =
                  dispatch(
                    removeFromFavorites(
                      accessToken,
                      productId
                    )
                  );

              this.toggleFavoriteStatusFetcher
                .then(() => {
                  this.setState({
                    isRemovingFromFavorites: false,
                    data: update(data, {
                      favorite: {
                        $set: false
                      }
                    }),
                  });
                });
              });
            }
          }}
        >
          { text }
        </button>
      );

      const addToFavoritesButton = (
        <button
          key="AddToFavorites"
          className={classes('btn btn-red', {
            "inTransition": isAddingToFavorites,
          })}
          onClick={() => {
            if(accountIsConfirmed) {
              if (isAuthenticated) {
                if (! isAddingToFavorites) {
                  this.setState({
                    isAddingToFavorites: true,
                  }, () => {
                    this.toggleFavoriteStatusFetcher =
                      dispatch(
                        addToFavorites(
                          accessToken,
                          productId
                        )
                      );

                    this.toggleFavoriteStatusFetcher
                      .then(() => {
                        this.setState({
                          isAddingToFavorites: false,
                          data: update(data, {
                            favorite: {
                              $set: true
                            }
                          }),
                        });
                      });
                  });
                }
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `products/${productRoute}`});
            }
          }}
        >
          {
            (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) ||
            I18n.t('general.elements.addToFavorites')
          }
        </button>
      );

      const notConfirmedAccountButton = (
        <WarningPopover key="AddToFavorites" isPopup={true}>
          {addToFavoritesButton}
        </WarningPopover>
      );

      let buttons = [];

      if(!isProductOwner) {
        if(favorite) {
          buttons.push(removeFromFavoritesButton);
        } else {
          if(accountIsConfirmed){
            buttons.push(addToFavoritesButton);
          } else {
            buttons.push(notConfirmedAccountButton);
          }
        }
      }

      return buttons;
 }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return Product;
    }
  }

  render () {
    const {
      isLoaded,
      data,
      activeImageIndex,
    } = this.state;

    if ( ! isLoaded) {
      return (
        <Loader />
      );
    }

    if ( ! data) {
      return (
        <PageNotFound />
      );
    }

    const Product = this.getListItem();
    const images = data.gallery.images;
    const defaultImage = images[activeImageIndex];

    return (
      <Product
        data={data}
        defaultImage={defaultImage}
        actionButtonsList={this.actionButtons()}
        activeImageIndex={activeImageIndex}
        onImageSelect={activeImageIndex => {
          this.setState({activeImageIndex});
        }}
        postedLike={() => {
          switch (data.postedLike.code) {
            case 'place':
              return 'places';
            case 'professional':
              return 'professionals';
            default:
              return 'member';
          }
        }}
        moveDownImage = {() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === 0
                ? images.length - 1
                : activeImageIndex - 1,
          })
        }}
        moveUpImage ={() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === images.length - 1
              ? 0
              : activeImageIndex + 1
            ,
          })
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    user: state.user,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(ProductContainer)));
