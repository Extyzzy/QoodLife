import React, { Component } from 'react';
import { withRouter } from 'react-router';
import {connect} from "react-redux";
import classes from 'classnames';
import update from 'immutability-helper';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./FeaturedItems.scss";
import { MOBILE_VERSION } from '../../../../actions/app';
import { userIsItemOwner } from '../../../../helpers/permissions';
import WarningPopover from '../../../../components/WarningPopover';
import FeaturedItems from './FeaturedItems';
import MobileVersion from './FeaturedItemsMobile';
import slugify from 'slugify';
import {I18n} from 'react-redux-i18n';
import {
  goingToEvent,
  notGoingToEvent,
} from '../../../../actions/events';

import {
  follow as followTheProfessional,
  unfollow as unfollowTheProfessional,
} from '../../../../actions/professionals';

import {
  addToFavorites,
  removeFromFavorites,
} from '../../../../actions/places';

import {
  addToFavorites as addProductToFavorites,
  removeFromFavorites as removeProductFromFavorites,
} from '../../../../actions/products';

import {fetchApiRequest, fetchAuthorizedApiRequest} from "../../../../fetch";
import {InternalServerError} from "../../../../exceptions/http";
import Loader from "../../../../components/Loader";

class FeaturedItemsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeNavigationItem: null,
      itemsAreLoading: true,
      eventsList: [],
      professionalsList: [],
      placesList: [],
      productsList: [],
      postsList: null,
    };

    this.getListItemOnPopupComponentWillUnmount = this.getListItemOnPopupComponentWillUnmount.bind(this);
    this.getListItemPopupActionButtons = this.getListItemPopupActionButtons.bind(this);
  }

  componentDidMount() {
    const  {
      accessToken,
      dispatch,
      promotion
    } = this.props;


    const url = promotion ? `/v1/global-requests/featured` : `/v1/global-requests/featured-demo`;
    let fetch;

    if (accessToken) {
      fetch = dispatch(
        fetchAuthorizedApiRequest(url,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        )
      );
    } else {
      fetch = fetchApiRequest(url);
    }

    this.fetchListsFetcher = fetch;
    this.fetchListsFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new InternalServerError()
            );

        }
      })
      .then(data => {
        this.setState({
          eventsList: data.events.map(event => ({
            ...event,
            key: 'event',
          })),
          placesList: data.places.map(event => ({
            ...event,
            key: 'place',
          })),
          productsList: data.products.map(event => ({
            ...event,
            key: 'product',
          })),
          professionalsList: data.professionals.map(event => ({
            ...event,
            key: 'professional',
          })),
          postsList: data.posts.map(event => ({
            ...event,
          })),
        });
      }, () => {
        this.setState({
          itemsAreLoading: false,
        });
      });

    this.fetchListsFetcher
      .finally(() => {
        if ( ! this.fetchListsFetcher.isCancelled()) {
          this.setState({
            itemsAreLoading: false,
          });
        }
      });
  }

  componentWillUnmount() {
    if (this.fetchListsFetcher instanceof Promise) {
      this.fetchListsFetcher.cancel();
    }
  }

  getMixedLists() {
    const {
      eventsList,
      professionalsList,
      placesList,
      productsList,
    } = this.state;

    let mixed = [];
    for (let i = 0; i < Math.max(
      eventsList.length,
      professionalsList.length,
      placesList.length,
      productsList.length,
    ); i++) {
      if (eventsList[i]) {
        mixed.push(eventsList[i]);
      }

      if (professionalsList[i]) {
        mixed.push(professionalsList[i]);
      }

      if (placesList[i]) {
        mixed.push(placesList[i]);
      }

      if (productsList[i]) {
        mixed.push(productsList[i]);
      }
    }

    return mixed;
  }

  getActiveNavigationItemList() {
    const {
      activeNavigationItem,
      eventsList,
      professionalsList,
      placesList,
      productsList,
    } = this.state;

    switch (activeNavigationItem) {
      case 'events':

        return eventsList;

      case 'professionals':

        return professionalsList;

      case 'places':

        return placesList;

      case 'products':

        return productsList;

      default:

        return this.getMixedLists();

    }
  }

  getListItemOnPopupComponentWillUnmount(key) {
    switch (key) {
      case 'event':

        return (_this) => {
          if (_this.toggleGoingStatusFetcher instanceof Promise) {
            _this.toggleGoingStatusFetcher.cancel();
          }
        };

      case 'professional':

        return (_this) => {
          if (_this.toggleFollowStatusFetcher instanceof Promise) {
            _this.toggleFollowStatusFetcher.cancel();
          }
        };

      case 'place':

        return (_this) => {
          if (_this.toggleFavoriteStatusFetcher instanceof Promise) {
            _this.toggleFavoriteStatusFetcher.cancel();
          }
        };

      case 'product':

        return (_this) => {
          if (_this.toggleFavoriteStatusFetcher instanceof Promise) {
            _this.toggleFavoriteStatusFetcher.cancel();
          }
        };

      default:

        throw new Error('Provided navigation item is not supported.');

    }
  }

  getListItemPopupActionButtons(key) {
    switch (key) {
      case 'event':

        return (_this) => {
          const {
            dispatch,
            accessToken,
            isAuthenticated,
            history,
            user,
          } = this.props;

          const {
            eventsList,
          } = this.state;

          const {
            data: {
              id: eventId,
              postedLike,
              going,
              owner,
              title,
              days,
              dateStart,
              goingDate,
            },
          } = _this.props;

          const {
            isGoing,
            isNotGoing,
            textOver,
          } = _this.state;

          const startDayOfEvent = days && days.length ? dateStart : null;

          let text = I18n.t('general.elements.going');

          if (textOver) {
            text = I18n.t('general.elements.notGoingOver');
          }

          if (isGoing) {
            text = I18n.t('general.elements.goingInProcess')
          }

          if (!textOver && !isGoing) {
            text = I18n.t('general.elements.notGoing')
          }

        const accountIsConfirmed = user.confirmed;
          const isEventOwner = isAuthenticated
            && userIsItemOwner(user, postedLike, owner);

          const notGoingButton = (
            <button
              key="Not going"
              className={classes('btn btn-red', {
                "inTransition": isNotGoing,
                "isNotGoing": !isGoing
              })}
              onMouseOver={() => _this.setState({ textOver: true })}
              onMouseOut={() => _this.setState({ textOver: false })}
              onClick={() => {
                if ( ! isNotGoing) {
                  _this.setState({
                    isNotGoing: true,
                    goingDate: null
                  }, () => {
                    _this.toggleGoingStatusFetcher =
                      dispatch(
                        notGoingToEvent(
                          accessToken,
                          eventId
                        )
                      );

                    _this.toggleGoingStatusFetcher
                      .then(() => {
                        _this.setState({
                          isNotGoing: false,
                        }, () => {
                          const eventIndex = eventsList
                            .findIndex(({id}) => id === eventId);
                          if (eventIndex !== -1) {
                            this.setState({
                              eventsList: update(eventsList, {
                                [eventIndex]: {
                                  $apply: (event) => update(event, {
                                    going: {
                                      $set: false,
                                    },
                                  }),
                                },
                              }),
                            }, () => {
                              // TODO: It's a temporal solution, check a better one.
                              // The issue is in the way we open popup in another container.
                              _this.props.data.going = false;
                              _this.props.data.goingDate = null;
                              _this.forceUpdate();
                            });
                          }
                        });
                      });
                  });
                }
              }}
            >
              { text }
            </button>
          );

          const goingButton = (
            <button
              key="isGoing"
              className={classes('btn btn-red', {
                [s.isGoing]: isGoing,
              })}
              onClick={() => {
                if(accountIsConfirmed){
                  if (isAuthenticated) {
                    if (! isGoing) {
                      _this.setState({
                        isGoing: true,
                        goingDate: dateStart
                      }, () => {
                        _this.toggleGoingStatusFetcher =
                          dispatch(
                            goingToEvent(
                              accessToken,
                              eventId,
                              startDayOfEvent
                            )
                          );

                        _this.toggleGoingStatusFetcher
                          .then(() => {
                            _this.setState({
                              isGoing: false,
                            }, () => {
                              const eventIndex = eventsList
                                .findIndex(({id}) => id === eventId);

                              if (eventIndex !== -1) {
                                this.setState({
                                  eventsList: update(eventsList, {
                                    [eventIndex]: {
                                      $apply: (event) => update(event, {
                                        going: {
                                          $set: true,
                                        },
                                      }),
                                    },
                                  }),
                                }, () => {
                                  // TODO: It's a temporal solution, check a better one.
                                  // The issue is in the way we open popup in another container.
                                  _this.props.data.going = true;
                                  _this.props.data.goingDate = dateStart;
                                  _this.forceUpdate();
                                });
                              }
                            });
                          });
                      });
                    }
                  }
                } else {
                  if(!isAuthenticated)
                    history.push('/login', {from: `events/${slugify(title)}-${eventId}`});
                }
              }
              }
            >
              {
                (isGoing && I18n.t('general.elements.goingInProcess')) ||
                (I18n.t('general.elements.going'))
              }
            </button>
          );

          const notConfirmedAccountButton = (
            <WarningPopover key="goingToEvent" isPopup={true}>
              {goingButton}
            </WarningPopover>
          );

          let buttons = [];

          if ( ! isEventOwner ) {
            if ( (goingDate === dateStart) || (going && goingDate === null)){
              buttons.push(notGoingButton)
            } else if (accountIsConfirmed) {
              buttons.push(goingButton)
            } else {
              buttons.push(notConfirmedAccountButton)
            }
          }

          return buttons;
        };

      case 'professional':

        return (_this) => {
          const {
            history,
            dispatch,
            isAuthenticated,
            accessToken,
            data,
            user
          } = _this.props;

          const {
            professionalsList,
          } = this.state;

          const {
            id: professionalId,
            follow,
            firstName,
            lastName,
          } = data;

          const {
            isStartingToFollow,
            isStoppingToFollow,
          } = _this.state;

          const accountIsConfirmed = user.confirmed;
          const isProfessionalOwner = isAuthenticated
            && user.profPending === 'ok'
            && user.profDetails.id === professionalId;

          const unFollowButton = (
            <button
              key="Unfollow"
              className={classes('btn btn-red', {
                [s.isStoppingToFollow]: isStoppingToFollow,
              })}
              onClick={() => {
                if (!isStoppingToFollow) {
                  _this.setState({
                    isStoppingToFollow: true,
                  }, () => {
                    _this.toggleFollowStatusFetcher =
                      dispatch(
                        unfollowTheProfessional(
                          accessToken,
                          professionalId
                        )
                      );

                    _this.toggleFollowStatusFetcher
                      .then(() => {
                        _this.setState({
                          isStoppingToFollow: false,
                        }, () => {
                        const professionalIndex = professionalsList.findIndex(({id}) => id === professionalId);

                        if (professionalIndex !== -1) {
                          this.setState({
                            professionalsList: update(professionalsList, {
                              [professionalIndex]: {
                                $apply: (professional) => update(professional, {
                                  follow: {
                                    $set: false,
                                  },
                                }),
                              },
                            }),
                          }, () => {
                            // TODO: It's a temporal solution, check a better one.
                            // The issue is in the way we open popup in another container.
                            _this.props.data.follow = false;
                            _this.forceUpdate();
                          });
                        }
                        });
                      });
                  });
                }
              }}
            >
              {
                (isStoppingToFollow && I18n.t('general.elements.unFollowing')) || I18n.t('general.elements.unFolow')
              }
            </button>
          );

          const followButton = (
            <button
              key="Follow"
              className={classes('btn btn-red', {
                [s.isStartingToFollow]: isStartingToFollow,
              })}
              onClick={() => {
                if(accountIsConfirmed){
                  if (isAuthenticated) {
                    if (!isStartingToFollow) {
                      _this.setState({
                        isStartingToFollow: true,
                      }, () => {
                        _this.toggleFollowStatusFetcher =
                          dispatch(
                            followTheProfessional(
                              accessToken,
                              professionalId
                            )
                          );

                        _this.toggleFollowStatusFetcher
                          .then(() => {
                            _this.setState({
                              isStartingToFollow: false,
                            }, () => {
                              const professionalIndex = professionalsList.findIndex(({id}) => id === professionalId);

                              if (professionalIndex !== -1) {
                                this.setState({
                                  professionalsList: update(professionalsList, {
                                    [professionalIndex]: {
                                      $apply: (professional) => update(professional, {
                                        follow: {
                                          $set: true,
                                        },
                                      }),
                                    },
                                  }),
                                }, () => {
                                  // TODO: It's a temporal solution, check a better one.
                                  // The issue is in the way we open popup in another container.
                                  _this.props.data.follow = true;
                                  _this.forceUpdate();
                                });
                              }
                            });
                          });
                      });
                    }
                  }
                } else {
                  if(!isAuthenticated)
                    history.push('/login', {from: `professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`});
                }
              }}
            >
              {
                (isStartingToFollow && I18n.t('general.elements.following')) || I18n.t('general.elements.follow')
              }
            </button>
          );

          const notConfirmedAccountButton = (
            <WarningPopover key="Follow" isPopup={true}>
              {followButton}
            </WarningPopover>
          );

          let buttons = [];

          if(!isProfessionalOwner) {
            if(follow) {
              buttons.push(unFollowButton);
            } else {
              if(accountIsConfirmed){
                buttons.push(followButton);
              } else {
                buttons.push(notConfirmedAccountButton);
              }
            }
          }

          return buttons;
        };

      case 'place':

        return (_this) => {
            const {
              history,
              dispatch,
              isAuthenticated,
              accessToken,
              data,
              user,
            } = _this.props;

            const {
              placesList,
            } = this.state;

            const {
              id: placeId,
              favorite,
              name,
            } = data;

            const {
              isAddingToFavorites,
              isRemovingFromFavorites,
            } = _this.state;

            const accountIsConfirmed = user.confirmed;
            const isPlaceOwner = isAuthenticated
              && user.placePending === 'ok'
              && user.placeDetails.id === placeId;

            const removeButton = (
              <button
                key="RemoveFromFavorites"
                className={classes('btn btn-red', {
                  [s.isRemovingFromFavorites]: isRemovingFromFavorites,
                })}
                onClick={() => {
                  if (!isRemovingFromFavorites) {
                    _this.setState({
                      isRemovingFromFavorites: true,
                    }, () => {
                      _this.toggleFavoriteStatusFetcher =
                        dispatch(
                          removeFromFavorites(
                            accessToken,
                            placeId
                          )
                        );

                      _this.toggleFavoriteStatusFetcher
                        .then(() => {
                          _this.setState({
                            isRemovingFromFavorites: false,
                          }, () => {
                            const placeIndex = placesList.findIndex(({id}) => id === placeId);

                            if (placeIndex !== -1) {
                              this.setState({
                                placesList: update(placesList, {
                                  [placeIndex]: {
                                    $apply: (place) => update(place, {
                                      favorite: {
                                        $set: false,
                                      },
                                    }),
                                  },
                                }),
                              }, () => {
                                // TODO: It's a temporal solution, check a better one.
                                // The issue is in the way we open popup in another container.
                                _this.props.data.favorite = false;
                                _this.forceUpdate();
                              });
                            }
                          });
                        });
                    });
                  }
                }}
              >
                {
                  (isRemovingFromFavorites && I18n.t('general.elements.removingFromFavorites')) ||
                  I18n.t('general.elements.removeFromFavorites')
                }
              </button>
            );

            const addButton = (
              <button
                key="AddToFavorites"
                className={classes('btn btn-red', {
                  [s.isAddingToFavorites]: isAddingToFavorites,
                })}
                onClick={() => {
                  if(accountIsConfirmed){
                    if (isAuthenticated) {
                      if (!isAddingToFavorites) {
                        _this.setState({
                          isAddingToFavorites: true,
                        }, () => {
                          _this.toggleFavoriteStatusFetcher =
                            dispatch(
                              addToFavorites(
                                accessToken,
                                placeId
                              )
                            );

                          _this.toggleFavoriteStatusFetcher
                            .then(() => {
                              _this.setState({
                                isAddingToFavorites: false,
                              }, () => {
                                const placeIndex = placesList.findIndex(({id}) => id === placeId);

                                if (placeIndex !== -1) {
                                  this.setState({
                                    placesList: update(placesList, {
                                      [placeIndex]: {
                                        $apply: (place) => update(place, {
                                          favorite: {
                                            $set: true,
                                          },
                                        }),
                                      },
                                    }),
                                  }, () => {
                                    // TODO: It's a temporal solution, check a better one.
                                    // The issue is in the way we open popup in another container.
                                    _this.props.data.favorite = true;
                                    _this.forceUpdate();
                                  });
                                }
                              });
                            });
                        });
                      }
                    }
                  } else {
                    if(!isAuthenticated)
                      history.push('/login', {from: `places/${slugify(name)}-${placeId}`});
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
                {addButton}
              </WarningPopover>
            );

            let buttons = [];

            if(!isPlaceOwner) {
              if(favorite) {
                buttons.push(removeButton);
              } else {
                if(accountIsConfirmed){
                  buttons.push(addButton);
                } else {
                  buttons.push(notConfirmedAccountButton);
                }
              }
            }

            return buttons;
        };


      case 'product':

        return (_this) => {
            const {
              history,
              dispatch,
              isAuthenticated,
              accessToken,
              data,
              user,
            } = _this.props;

            const {
              productsList,
            } = this.state;

            const {
              id: productId,
              postedLike,
              owner,
              favorite,
              title,
            } = data;

            const {
              isAddingToFavorites,
              isRemovingFromFavorites,
            } = _this.state;

            const accountIsConfirmed = user.confirmed;
            const isProductOwner = isAuthenticated
              && userIsItemOwner(user, postedLike, owner);

            const addToFavoritesButton = (
              <button
                key="addToFavorites"
                className='btn btn-red'
                onClick={() => {
                  if(accountIsConfirmed){
                    if (isAuthenticated) {
                      if (!isAddingToFavorites) {
                        _this.setState({
                          isAddingToFavorites: true,
                        }, () => {
                          _this.toggleFavoriteStatusFetcher =
                            dispatch(
                              addProductToFavorites(
                                accessToken,
                                productId
                              )
                            );

                            _this.toggleFavoriteStatusFetcher
                            .then(() => {
                              _this.setState({
                                isAddingToFavorites: false,
                              }, () => {

                              const productIndex = productsList.findIndex(({id}) => id === productId);

                              if (productIndex !== -1) {
                                this.setState({
                                  productsList: update(productsList, {
                                    [productIndex]: {
                                      $apply: (product) => update(product, {
                                        favorite: {
                                          $set: true,
                                        },
                                      }),
                                    },
                                  }),
                                }, () => {
                                  // TODO: It's a temporal solution, check a better one.
                                  // The issue is in the way we open popup in another container.
                                  _this.props.data.favorite = true;
                                  _this.forceUpdate();
                                });
                              }
                              });
                            });
                        });
                      }
                    }
                  } else {
                    if(!isAuthenticated)
                      history.push('/login', {from: `products/${slugify(title)}-${productId}`});
                  }
                }}
              >
                {
                  (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) ||
                  I18n.t('general.elements.addToFavorites')
                }
              </button>
            );

            const removeFromFavoritesButton = (
              <button
                key="removeFromFavorites"
                className='btn btn-red'
                onClick={() => {
                  if ( ! isRemovingFromFavorites) {
                    _this.setState({
                      isRemovingFromFavorites: true,
                    }, () => {
                      _this.toggleFavoriteStatusFetcher =
                        dispatch(
                          removeProductFromFavorites(
                            accessToken,
                            productId
                          )
                        );


                        _this.toggleFavoriteStatusFetcher
                        .then(() => {
                          _this.setState({
                            isRemovingFromFavorites: false,
                          }, () => {

                          const productIndex = productsList.findIndex(({id}) => id === productId);

                          if (productIndex !== -1) {
                            this.setState({
                              productsList: update(productsList, {
                                [productIndex]: {
                                  $apply: (product) => update(product, {
                                    favorite: {
                                      $set: false,
                                    },
                                  }),
                                },
                              }),
                            }, () => {
                              // TODO: It's a temporal solution, check a better one.
                              // The issue is in the way we open popup in another container.
                              _this.props.data.favorite = false;
                              _this.forceUpdate();
                            });
                          }
                          });
                        });
                    });
                  }
                }}
              >
                {
                  (isRemovingFromFavorites && I18n.t('general.elements.removingFromFavorites')) ||
                  I18n.t('general.elements.removeFromFavorites')
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
        };
      default:

        throw new Error('Provided navigation item is not supported.');

    }
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return FeaturedItems;

    }
  }

  render() {
    const {
      activeNavigationItem,
      itemsAreLoading,
      eventsList,
      professionalsList,
      placesList,
      productsList,
      postsList,
    } = this.state;

    const FeaturedItems = this.getListItem();

    if (itemsAreLoading) {
      return (
        <Loader />
      );
    }

    if ( ! postsList) {
      return null
    }

    return (
      <FeaturedItems
        postsList={postsList}
        eventsList={eventsList}
        professionalsList={professionalsList}
        placesList={placesList}
        productsList={productsList}
        itemsAreLoading={itemsAreLoading}
        navigationItems={[
          {
            key: 'events',
            children: I18n.t('general.header.events'),
          },
          {
            key: 'professionals',
            children: I18n.t('general.header.professionals'),
          },
          {
            key: 'places',
            children: I18n.t('general.header.places'),
          },
          {
            key: 'products',
            children: I18n.t('general.header.products'),
          },
        ]}
        activeNavigationItem={activeNavigationItem}
        onNavigationItemSelect={(__activeNavigationItem) => {
          if (__activeNavigationItem !== activeNavigationItem) {
            this.setState({
              activeNavigationItem: __activeNavigationItem,
            });
          } else if (__activeNavigationItem === activeNavigationItem) {
            this.setState({
              activeNavigationItem: null,
            });
          }
        }}
        activeNavigationItemList={
          this.getActiveNavigationItemList()
        }
        getListItemOnPopupComponentWillUnmount={
          this.getListItemOnPopupComponentWillUnmount
        }
        getListItemPopupActionButtons={
          this.getListItemPopupActionButtons
        }
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
    promotion: state.app.promotion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(FeaturedItemsContainer)));
