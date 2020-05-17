import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import { fetchApiRequest } from '../../../fetch';
import { clearSearchBoxQery } from '../../../actions/navigation';
import { InternalServerError } from '../../../exceptions/http';
import Layout from '../../../components/_layout/Layout/Layout';
import Tabs from "../../../components/Tabs";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SearchResults.scss';
import SearchResultsMobile from './SearchResultsMobile';
import Places from './components/Places';
import Hobbies from './components/Hobbies';
import Professionals from './components/Professionals';
import Events from './components/Events';
import Groups from './components/Groups';
import Products from './components/Products';
import Members from './components/Members';
import Posts from './components/Posts';
import {goingToEvent, notGoingToEvent, receiveGoingToEvent, receiveNotGoingToEvent} from "../../../actions/events";
import {joinGroup, leaveGroup} from "../../../actions/groups";
import {addToFavorites, removeFromFavorites} from "../../../actions/posts";
import classes from "classnames";
import {
  follow as followTheProfessional,
  receiveFollowTheProfessional, receiveUnfollowTheProfessional,
  unfollow as unfollowTheProfessional
} from "../../../actions/professionals";
import slugify from "slugify";
import WarningPopover from "../../../components/WarningPopover";
import {
  MOBILE_VERSION,
} from '../../../actions/app';
import {chunk} from "lodash";
import {DEFAULT_ADS_BLOCKS_FREQUENCE_GRID} from "../../../constants";

class SearchResults extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      activeTabItemIndex: 0,
      response: {
        hobbies: [],
        places: [],
        professionals: [],
        events: [],
        groups: [],
        products: [],
        posts: [],
        users: [],
      },
    };

    this.onItemPopupComponentWillUnmount = this.onItemPopupComponentWillUnmount.bind(this);
    this.itemPopupActionButtonsForEvents = this.itemPopupActionButtonsForEvents.bind(this);
    this.itemPopupActionButtonsGroups = this.itemPopupActionButtonsGroups.bind(this);
    this.itemPopupActionButtonsForPosts = this.itemPopupActionButtonsForPosts.bind(this);
  };

  componentWillMount() {
    const {searchQery, oneWord} = this.props;
    if(!!searchQery.length) {
      this.getQeryResponse(searchQery, oneWord);
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!!nextProps.searchQery.length) {
      this.getQeryResponse(nextProps.searchQery, nextProps.oneWord);
    }
  }

  componentWillUnmount() {
    const {
      dispatch,
    } = this.props;

    dispatch(clearSearchBoxQery());
  }

  onItemPopupComponentWillUnmount(_this) {
    if (_this.toggleGoingStatusFetcher instanceof Promise) {
      _this.toggleGoingStatusFetcher.cancel();
    }
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
      textOver
    } = _this.state;

    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isAddingToFavorites) {
      text = I18n.t('general.elements.unFolow')
    }

    let buttons = [];

    buttons.push(
      (favorite && (
        <button
          key="RemoveFromFavorites"
          className={classes('btn btn-red', {
            "inTransition": isRemovingFromFavorites,
            "isNotGoing": !isRemovingFromFavorites
          })}
          onMouseOver={() => _this.setState({ textOver: true })}
          onMouseOut={() => _this.setState({ textOver: false })}
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
          { text }
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

  itemPopupActionButtonsForProf(_this) {
    const {
      history,
      dispatch,
      isAuthenticated,
      accessToken,
      data,
      user,
    } = _this.props;

    const {
      isStartingToFollow,
      isStoppingToFollow,
      textOver
    } = _this.state;

    const {
      id: professionalId,
      follow,
      firstName,
      lastName,
    } = data;

    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isStartingToFollow) {
      text = I18n.t('general.elements.unFolow')
    }

    const accountIsConfirmed = user.confirmed || false;
    const isProfessionalOwner = user.profPending === 'ok'
      && user.profDetails.id === professionalId;

    const followButton = (
      <button
        key="Follow"
        className={classes('btn btn-red', {
          "inTransition": isStartingToFollow,
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
                        dispatch(
                          receiveFollowTheProfessional(professionalId)
                        );
                      });
                    });
                });
              }
            }
          } else {
            if(!isAuthenticated)
              history.push('/login', {from: `professionals/${slugify(firstName)}-${slugify( lastName)}-${professionalId}`});
          }
        }}
      >
        {
          (isStartingToFollow && I18n.t('general.elements.following')) || I18n.t('general.elements.follow')
        }
      </button>
    );

    const unFollowButton = (
      <button
        key="Unfollow"
        className={classes('btn btn-red', {
          "inTransition": isStoppingToFollow,
          "isNotGoing": !isStartingToFollow
        })}
        onMouseOver={() => _this.setState({ textOver: true })}
        onMouseOut={() => _this.setState({ textOver: false })}
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
                    dispatch(
                      receiveUnfollowTheProfessional(professionalId)
                    );
                  });
                });
            });
          }
        }}
      >
        { text }
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
  }

  itemPopupActionButtonsForEvents(_this) {
    const {
      dispatch,
      accessToken,
      user,
    } = this.props;

    const {
      response,
    } = this.state;

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
      textOver,
    } = _this.state;

    let text = I18n.t('general.elements.going');

    if (textOver) {
      text = I18n.t('general.elements.notGoingOver');
    }

    if (isGoing) {
      text = I18n.t('general.elements.goingInProcess')
    }

    const startDayOfEvent = days && days.length ? dateStart : null;

    const data = response.events.find(data => data.id === eventId);
    const isEventOwner = !!user && !!owner && user.id === owner.id;
    let buttons = [];

    if ( ! isEventOwner) {
      buttons.push(
        (((goingDate === dateStart) || (going && goingDate === null)) &&(
          <button
            key="Not going"
            className={classes("btn btn-red", {
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
            {text}
          </button>
        )) || (
          <button
            key="isGoing"
            className='btn btn-red'
            onClick={() => {
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

  getQeryResponse(searchQuery, oneWord) {

    let url = `/v1/search?query=${searchQuery}`;

    if (oneWord) {
      url = `/v1/search?query=${searchQuery}&type=one-word`
    }

    this.fetchQeryResponse = fetchApiRequest(url);
    this.fetchQeryResponse
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
      .then(({
        hobbies,
        places,
        professionals,
        events,
        groups,
        products,
        posts,
        users,
      }) => {
        this.setState({
          isLoaded: true,
          response: {
            hobbies,
            places,
            professionals,
            events,
            groups,
            products,
            posts,
            users,
          }
        });
      });
  }

  getSearchresponseTabs() {
    const { response, isLoaded } = this.state;
    const {
      userHobbies,
      childrenHobbies,
      isAuthenticated,
      history,
      dispatch,
    } = this.props;

    let tabs = [];

    if (response.events && response.events.length) {
      tabs.push(
        {
          title: I18n.t('general.header.events'),
          content: (
            <Events
              list={response.events}
              isLoaded={isLoaded}
              itemPopupActionButtonsForEvents={
                this.itemPopupActionButtonsForEvents
              }
            />
          )
        },
      )
    }

    if (response.places && response.places.length) {
      tabs.push(
        {
          title: I18n.t('general.header.places'),
          content: (
            <Places list={response.places} isLoaded={isLoaded} />
          )
        },
      )
    }

    if (response.professionals && response.professionals.length) {
      tabs.push(
        {
          title: I18n.t('general.header.professionals'),
          content: (
            <Professionals
              list={response.professionals}
              isLoaded={isLoaded}
              itemPopupActionButtonsGroups={
                this.itemPopupActionButtonsForProf
              }
            />
          )
        },
      )
    }

    if (response.groups && response.groups.length) {
      tabs.push(
        {
          title: I18n.t('general.header.groups'),
          content: (
            <Groups
              list={response.groups}
              isLoaded={isLoaded}
              itemPopupActionButtonsGroups={
                this.itemPopupActionButtonsGroups
              }
            />
          )
        },
      )
    }

    if (response.products &&  response.products.length) {
      tabs.push(
        {
          title: I18n.t('general.header.products'),
          content: (
            <Products list={response.products} isLoaded={isLoaded} />
          )
        },
      )
    }

    if (response.hobbies && response.hobbies.length) {
      tabs.push(
        {
          title: I18n.t('general.header.hobbies'),
          content: (
            <Hobbies
              list={response.hobbies}
              isLoaded={isLoaded}
              userHobbies={userHobbies}
              childrenHobbies={childrenHobbies}
              isAuthenticated={isAuthenticated}
              history={history}
              dispatch={dispatch}
            />
          )
        },
      )
    }

    if (response.users && response.users.length) {
      tabs.push(
        {
          title: I18n.t('general.header.members'),
          content: (
            <Members
              list={response.users}
              isLoaded={isLoaded}
            />
          )
        },
      )
    }

    if (response.posts && response.posts) {
      tabs.push(
        {
          title: I18n.t('general.header.posts'),
          content: (
            <Posts
              list={response.posts}
              isLoaded={isLoaded}
              itemPopupActionButtonsForPosts={
                this.itemPopupActionButtonsForPosts
              }
            />
          )
        },
      )
    }

    return tabs;
  }

  render() {
    const {
      UIVersion,
      userHobbies
    } = this.props;

    const {
      activeTabItemIndex,
      response
    } = this.state;

    const tabs = this.getSearchresponseTabs();

    if (UIVersion === MOBILE_VERSION) {
      const professionalsGroups = chunk(response.professionals, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const placesGroups = chunk(response.places, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const groupsGroups = chunk(response.groups, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const eventsGroups = chunk(response.events, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const hobbiesGroups = chunk(response.hobbies, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const usersGroups = chunk(response.users, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const postsGroups = chunk(response.posts, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);
      const productsGroups = chunk(response.products, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);

      return (
        <SearchResultsMobile
          response={response}
          postsGroups={postsGroups}
          usersGroups={usersGroups}
          hobbiesGroups={hobbiesGroups}
          eventsGroups={eventsGroups}
          groupsGroups={groupsGroups}
          placesGroups={placesGroups}
          professionalsGroups={professionalsGroups}
          productsGroups={productsGroups}
          userHobbies={userHobbies}
        />
      )
    }

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
      >
        <div className={s.root}>
          <h3>{I18n.t('general.search.resultsSearch')}</h3>
          {
            (tabs.length &&(
              <Tabs
                items={tabs}
                activeItemIndex={activeTabItemIndex}
                onChange={index => this.setState({activeTabItemIndex: index})}
              />
            )) || (
              I18n.t('general.search.searchNotFound')
            )
          }
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    searchQery: state.navigation.searchQery,
    oneWord: state.navigation.oneWord,
    userHobbies: state.auth.isAuthenticated ? state.user.hobbies : null,
    childrenHobbies: state.auth.isAuthenticated ? state.user.childrenHobbies : null,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.user,
    accessToken: state.auth.accessToken,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(SearchResults)));
