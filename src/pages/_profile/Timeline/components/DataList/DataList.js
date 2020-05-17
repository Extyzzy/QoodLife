import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from "react-redux";
import Loader from '../../../../../components/Loader';
import {I18n} from 'react-redux-i18n';
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {SilencedError} from "../../../../../exceptions/errors";
import Data from './Data';
import {
  joinGroup,
  leaveGroup,
} from "../../../../../actions/groups";

import {
  timelineData,
  LoadMoreTimelineData,
  clearTimelineloadMore,
  removeHobbyTimeline,
} from '../../../../../actions/timeline';

import {
  goingToEvent,
  notGoingToEvent,
  receiveGoingToEvent,
  receiveNotGoingToEvent
} from "../../../../../actions/events";

import {
  addToFavorites,
  removeFromFavorites
} from "../../../../../actions/posts";

import {
  addToFavorites as addToFavoritesProducts,
  removeFromFavorites as removeFromFavoritesProducts
} from "../../../../../actions/products";
import {SIDEBAR_GROUP_FOR_CHILDRENS} from "../../../../../actions/navigation";

class DataList extends Component {
  static propTypes = {
    hobbyId: PropTypes.string.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      skip: 0,
      loadMore: true,
    };

    this.loadMore = this.loadMore.bind(this);
    this.checkTime = this.checkTime.bind(this);
    this.onItemPopupComponentWillUnmount = this.onItemPopupComponentWillUnmount.bind(this);
    this.itemPopupActionButtonsForEvents = this.itemPopupActionButtonsForEvents.bind(this);
    this.itemPopupActionButtonsGroups = this.itemPopupActionButtonsGroups.bind(this);
    this.itemPopupActionButtonsForPosts = this.itemPopupActionButtonsForPosts.bind(this);
    this.itemPopupActionButtonsForProducts = this.itemPopupActionButtonsForProducts.bind(this);
  }

  componentDidMount() {
    const {
      dispatch,
      hobbyId,
      accessToken,
      navigation,
    } = this.props;

    const {
      skip,
    } = this.state;

    dispatch(clearTimelineloadMore());

    let children = navigation.sidebarOpenedGroup === SIDEBAR_GROUP_FOR_CHILDRENS;

    this.setState({
      skip: skip + 3,
    }, () => {
      dispatch(timelineData(accessToken, hobbyId, skip, children))
    });

    window.addEventListener("beforeunload", this.checkTime)
  }

  componentWillUnmount() {
    const {
      dispatch,
      list,
      hobbyId,
    } = this.props;

    dispatch(
      removeHobbyTimeline(list, hobbyId)
    );

    this.checkTime();
      window.removeEventListener("beforeunload", this.checkTime);

    if (this.eventsFetcher instanceof Promise) {
      this.eventsFetcher.cancel();
    }
  }

  checkTime() {
    const {
      dispatch,
      hobbyId,
      accessToken,
      navigation,
    } = this.props;

    let children = navigation.sidebarOpenedGroup === SIDEBAR_GROUP_FOR_CHILDRENS;

    let url = children ? `/v1/account/timeline/${hobbyId}?children=true` : `/v1/account/timeline/${hobbyId}`;

    this.eventsFetcher = dispatch(
      fetchAuthorizedApiRequest(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return response;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch reports.')
            );
        }
      });
  }

  onItemPopupComponentWillUnmount(_this) {
    if (_this.toggleGoingStatusFetcher instanceof Promise) {
      _this.toggleGoingStatusFetcher.cancel();
    }
  }

  itemPopupActionButtonsForEvents(_this) {
    const {
      dispatch,
      accessToken,
      user,
      data,
    } = this.props;

    const {
      data: {
        id: eventId,
        going,
        owner,
        days,
        dateStart,
        goingDate
      },
    } = _this.props;

    const {
      isGoing,
      isNotGoing,
    } = _this.state;

    const startDayOfEvent = days && days.length ? dateStart : null;

    const isEventOwner = !!user && !!owner && user.id === owner.id;
    let buttons = [];

    if ( ! isEventOwner) {
      buttons.push(
        (((goingDate === dateStart) || (going && goingDate === null)) &&(
          <button
            key="Not going"
            className='btn btn-red'
            onClick={() => {
              if ( ! isNotGoing) {
                _this.setState({
                  isNotGoing: true,
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
                        dispatch(
                          receiveNotGoingToEvent(_this.props.data)
                        );
                        _this.props.data.going = false;
                        _this.props.data.goingDate = null;
                        _this.forceUpdate();
                      });
                    });
                });
              }
            }}
          >
            {
              (isNotGoing && I18n.t('general.elements.notGoingInProcess')) ||
              (I18n.t('general.elements.notGoing'))
            }
          </button>
        )) || (
          <button
            key="isGoing"
            className='btn btn-red'
            onClick={() => {
              if (! isGoing) {
                _this.setState({
                  isGoing: true,
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
                        dispatch(
                          receiveGoingToEvent(data)
                        );
                        _this.props.data.going = true;
                        _this.props.data.goingDate = dateStart;
                        _this.forceUpdate();
                      });
                    });
                });
              }
            }
            }
          >
            {
              (isGoing && I18n.t('general.elements.goingInProcess')) ||
              (I18n.t('general.elements.going'))
            }
          </button>
        )
      );
    }

    return buttons;
  }

  itemPopupActionButtonsGroups(_this) {
    const {
      dispatch,
      accessToken,
      user,
    } = this.props;

    const {
      data: {
        id: groupId,
        members,
        owner,
        size
      },
    } = _this.props;

    const isGroupOwner = user.id === owner.id;
    const isMember = !!members.find(m => m.id === user.roles[0].id);
    _this.props.data.isMember = isMember;
    const isFull = members.length >= size;
    const userData = {
      id: user.roles[0].id,
      fullName: user.fullName,
      owner: false,
      avatar: user.avatar? user.avatar : null,
    };

    const {
      isJoining,
      isLeaving,
    } = _this.state;

    let buttons = [];
    if ( ! isGroupOwner && !isFull) {
      buttons.push(
        (_this.props.data.isMember && (
          <button
            key="leaveGroup"
            className='btn btn-red'
            onClick={() => {
              if ( ! isLeaving) {
                _this.setState({
                  isNotGoing: true,
                }, () => {
                  _this.toggleGoingStatusFetcher =
                    dispatch(
                      leaveGroup(
                        accessToken,
                        groupId
                      )
                    );

                  _this.toggleGoingStatusFetcher
                    .then(() => {
                      _this.setState({
                        isNotGoing: false,
                      }, () => {
                        const userIndex = _this.props.data.members
                          .findIndex(({id}) => id === user.id);
                        if (userIndex !== -1) {
                          _this.props.data.members.splice(userIndex, 1);
                          _this.props.data.isMember = false;
                          _this.forceUpdate();
                        }
                      });
                    });
                });
              }
            }}
          >
            {
              (isLeaving && I18n.t('groups.inProgressButton')) ||
              I18n.t('groups.leaveGroupButton')
            }
          </button>
        )) || (
          <button
            key="joinToGroup"
            className='btn btn-red'
            onClick={() => {
              if (! isJoining) {
                _this.setState({
                  isGoing: true,
                }, () => {
                  _this.toggleGoingStatusFetcher =
                    dispatch(
                      joinGroup(
                        accessToken,
                        groupId
                      )
                    );

                  _this.toggleGoingStatusFetcher
                    .then(() => {
                      _this.setState({
                        isGoing: false,
                      }, () => {
                        const userIndex = _this.props.data.members
                          .findIndex(({id}) => id === user.id);

                        if (userIndex === -1) {
                          _this.props.data.members.push(userData);
                          _this.props.data.isMember = true;
                          _this.forceUpdate();
                        }
                      });
                    });
                });
              }
            }
            }
          >
            {
              (isJoining && I18n.t('groups.inProgressButton')) ||
              I18n.t('groups.joinToGroupButton')
            }
          </button>
        )
      );
    }

    return buttons;
  }

  itemPopupActionButtonsForPosts(_this) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      data: {
        id: postId,
        favorite,
      },
    } = _this.props;

    const {
      isAddingToFavorites,
      isRemovingFromFavorites,
    } = _this.state;

    let buttons = [];

    buttons.push(
      (favorite && (
        <button
          key="RemoveFromFavorites"
          className='btn btn-red'
          onClick={() => {
            if ( ! isRemovingFromFavorites) {
              _this.setState({
                isRemovingFromFavorites: true,
              }, () => {
                _this.toggleGoingStatusFetcher =
                  dispatch(
                    removeFromFavorites(
                      accessToken,
                      postId
                    )
                  );

                _this.toggleGoingStatusFetcher
                  .then(() => {
                    _this.setState({
                      isRemovingFromFavorites: false,
                    }, () => {
                      _this.props.data.favorite = false;
                      _this.forceUpdate();

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
      )) || (
        <button
          key="isAddingToFavorites"
          className='btn btn-red'
          onClick={() => {
            if (! isAddingToFavorites) {
              _this.setState({
                isAddingToFavorites: true,
              }, () => {
                _this.toggleGoingStatusFetcher =
                  dispatch(
                    addToFavorites(
                      accessToken,
                      postId
                    )
                  );

                _this.toggleGoingStatusFetcher
                  .then(() => {
                    _this.setState({
                      isAddingToFavorites: false,
                    }, () => {
                      _this.props.data.favorite = true;
                      _this.forceUpdate();
                    });
                  });
              });
            }
          }
          }
        >
          {
            (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) ||
            I18n.t('general.elements.addToFavorites')
          }
        </button>
      )
    );

    return buttons;
  }

  itemPopupActionButtonsForProducts(_this) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      data: {
        id: productId,
        favorite,
      },
    } = _this.props;

    const {
      isAddingToFavorites,
      isRemovingFromFavorites,
    } = _this.state;

    let buttons = [];

    buttons.push(
      (favorite && (
        <button
          key="RemoveFromFavorites"
          className='btn btn-red'
          onClick={() => {
            if ( ! isRemovingFromFavorites) {
              _this.setState({
                isRemovingFromFavorites: true,
              }, () => {
                _this.toggleGoingStatusFetcher =
                  dispatch(
                    removeFromFavoritesProducts(
                      accessToken,
                      productId
                    )
                  );

                _this.toggleGoingStatusFetcher
                  .then(() => {
                    _this.setState({
                      isRemovingFromFavorites: false,
                    }, () => {
                      _this.props.data.favorite = false;
                      _this.forceUpdate();
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
      )) || (
        <button
          key="isAddingToFavorites"
          className='btn btn-red'
          onClick={() => {
            if (! isAddingToFavorites) {
              _this.setState({
                isAddingToFavorites: true,
              }, () => {
                _this.toggleGoingStatusFetcher =
                  dispatch(
                    addToFavoritesProducts(
                      accessToken,
                      productId
                    )
                  );

                _this.toggleGoingStatusFetcher
                  .then(() => {
                    _this.setState({
                      isAddingToFavorites: false,
                    }, () => {
                      _this.props.data.favorite = true;
                      _this.forceUpdate();
                    });
                  });
              });
            }
          }
          }
        >
          {
            (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) ||
            I18n.t('general.elements.addToFavorites')
          }
        </button>
      )
    );

    return buttons;
  }

  loadMore() {
    const {
      skip,
    } = this.state;

    const {
      dispatch,
      accessToken,
      hobbyId,
    } = this.props;

    this.setState({skip: skip + 3}, () => {
      dispatch(
        LoadMoreTimelineData(accessToken, hobbyId, skip)
      );
    });
  }

  render() {
    const {
      data,
      loadMoreData,
      loadingMore,
      lastSeen_1,
      lastSeen_2,
      scrollDirection,
      scroll,
      isFetchingData,
      couldLoadMore,
    } = this.props;

    if ( isFetchingData) {
      return (
        <Loader sm contrast />
      );
    }

    const style = {
      display: 'flex',
      justifyContent: 'flex-end',
      flexDirection: 'column',
    };

    if ( ! data.length ) {
      return (
        <div style={style}>
          {I18n.t('profile.timeline.notFound')}
        </div>
      )
    }

    return (
      <div style={25 > scroll ?  null : scrollDirection === 'up' ? {marginTop: 151} : null}>
        <Data
          allData={data}
          lastSeen_1={lastSeen_1}
          lastSeen_2={lastSeen_2}
          loadMoreData={loadMoreData}
          onPopupComponentWillUnmount={
            this.onItemPopupComponentWillUnmount
          }
          itemPopupActionButtonsForProducts={
            this.itemPopupActionButtonsForProducts
          }
          itemPopupActionButtonsGroups={
            this.itemPopupActionButtonsGroups
          }
          itemPopupActionButtonsForPosts={
            this.itemPopupActionButtonsForPosts
          }
          itemPopupActionButtonsForEvents={
            this.itemPopupActionButtonsForEvents
          }
        />

        {
          couldLoadMore &&(
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

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
    accessToken: store.auth.accessToken,
    data: store.timeline.data,
    list: store.timeline.list,
    loadMoreData: store.timeline.loadMoreData,
    couldLoadMore: store.timeline.couldLoadMore,
    loadingMore: store.timeline.loadingMore,
    isFetchingData: store.timeline.isFetchingData,
    user: store.user,
    navigation: store.navigation,
  };
}

export default withRouter(connect(mapStateToProps)(DataList));
