import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { SilencedError } from "../../../exceptions/errors";
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { MOBILE_VERSION } from '../../../actions/app';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import Place from './Place';
import update from "immutability-helper";
import MobileVersion from './PlaceMobile';
import WarningPopover from '../../../components/WarningPopover';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Place.scss';
import {
  addToFavorites as addPlaceToFavorites,
  removeFromFavorites as removePlaceFromFavorites
} from '../../../actions/places';

import PostsList from "./components/PostsList";
import EventsList from "./components/EventsList";
import ProductsList from "./components/ProductsList";
import GroupsList from "./components/GroupsList"
import ProfessionalsList from "./components/ProfessionalsList";
import BranchesList from "./components/BranchesList";
import {UnprocessableEntity} from "../../../exceptions/http";
import Calendar from "../../_profile/EditProfile/components/Calendar";
import {
  changeSidebarGroup,
  SIDEBAR_GROUP_ALL,
  SIDEBAR_GROUP_RELATED
} from "../../../actions/navigation";
import {FILTER_OWNED} from "../../../helpers/filter";
import {
  fetchAdsBlocks,
} from "../../../actions/adsModule";

class PlaceContainer extends Component {
  constructor(props, context) {
    super(props, context);

    const { state, pathname } = this.props.location;

    let itemActive = 0;

    if (pathname.indexOf('calendar') > 0) {
        itemActive = 6;
    }

    if (state) {
      itemActive = state.profileActiveTabIndex
    }

    this.state = {
      isLoaded: false,
      data: null,
      placesRecommend: null,
      followersNumber: 0,
      activeImageIndex: null,
      activeTabItemIndex: itemActive,
      reqestStatus: null,
      showMore: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      isAuthenticated,
      accessToken,
      user,
      match: {params: {placeId: placeRoute}},
    } = this.props;

    const localStorageLang = localStorage.getItem('USER_LANGUAGE');

    dispatch(changeSidebarGroup(SIDEBAR_GROUP_RELATED));

    const placeId = placeRoute.split('-').pop();

    this.placeFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/places/${placeId}?lang=${localStorageLang ? localStorageLang : 'en'}`, {
        ...(isAuthenticated ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        } : {})
      })
    );

    this.placeFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:
            return Promise.reject(
              new SilencedError('Failed to fetch place.')
            );
        }
      })
      .then(data => {
        const defaultBranch = data.branches.find(b => b.default);

        this.setState({
          data,
          followersNumber: data.followers,
          activeImageIndex: defaultBranch.gallery.images.findIndex(i => i.default),
        }, () => {
          if (data.owner) {
            this.fetchAdsBlock(data.owner.id);
            }
          if (data.excelUploaded) {
            this.getRecommendationPlaces()
          }
          }
        );

        return Promise.resolve();
      })
      .finally(() => {
        if ( ! this.placeFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });

      if(user.profPending === "ok"){
        this.getReqestStatus();
      }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch(changeSidebarGroup(SIDEBAR_GROUP_ALL));

    if (this.placeFetcher instanceof Promise) {
      this.placeFetcher.cancel();
    }

    if (this.toggleFavoriteStatusFetcher instanceof Promise) {
      this.toggleFavoriteStatusFetcher.cancel();
    }
  }

  fetchAdsBlock(userId) {
    const {
      dispatch,
      navigation
    } = this.props;

    dispatch(
      fetchAdsBlocks(
        false,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            user: userId,
            role: 'place',
          },
        },
        userId,
      )
    );
  }

  getRecommendationPlaces() {
    const {
      dispatch,
      accessToken,
      match: {params: {placeId: placeRoute}},
    } = this.props;

    const placeId = placeRoute.split('-').pop();

    dispatch(
      fetchAuthorizedApiRequest(`/v1/places/recomended/${placeId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();

          default:
            return Promise.reject(
              new SilencedError('Failed to reject invitation.')
            );
        }
      })
      .then(placesRecommend => {
        this.setState({placesRecommend});
        return Promise.resolve();
      })
  }

  getReqestStatus() {
    const {
      dispatch,
      accessToken,
      match: {params: {placeId: placeRoute}},
    } = this.props;

    const placeId = placeRoute.split('-').pop();

    dispatch(
      fetchAuthorizedApiRequest(`/v1/professionals/connected/${placeId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
    .then(response => {
      switch (response.status) {
        case 200:
          return response.json();

        default:
          return Promise.reject(
            new SilencedError('Failed to reject invitation.')
          );
      }
    })
    .then(reqestStatus => {
      this.setState({reqestStatus});
      return Promise.resolve();
    })
  }

  tabOptions() {
    const { data } = this.state;
    const { branches, calendar } = data;

    const ownerID = data.owner ? data.owner.id : null;

    let tabs = [
      {
        title: I18n.t('general.header.events'),
        content: (
          <EventsList
            ownerID={ownerID}
          />
        ),
      },
      {
        title: I18n.t('general.header.professionals'),
        content: (
          <ProfessionalsList />
        ),
      },
      {
        title: I18n.t('general.header.groups'),
        content: (
          <GroupsList
            ownerID={ownerID}
          />
        ),
      },
      {
        title: I18n.t('general.header.products'),
        content: (
          <ProductsList
            ownerID={ownerID}
          />
        ),
        products: true,
      },
      {
        title: I18n.t('general.header.posts'),
        content: (
          <PostsList
            ownerID={ownerID}
          />
        ),
      },
      {
        title: I18n.t('agent.branches'),
        content: (
          <BranchesList branchesList={branches} name={data.name}/>
        ),
      },
    ];

    if (calendar.status) {
      tabs.push(
        {
          title: I18n.t('general.agent.calendar'),
          content: (
            <Calendar
              ownerID={ownerID}
              calendarPlace={calendar}
            />
          ),
        },
      )
    }

    return tabs;
  }

  actionButtons() {
    const {
      dispatch,
      accessToken,
      isAuthenticated,
      match: {params: {placeId: placeRoute}},
      history,
      user,
    } = this.props;

    const {
      isAddingToFavorites,
      isRemovingFromFavorites,
      reqestStatus,
      followersNumber,
      data: { favorite },
      data,
      textOver
    } = this.state;

    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isAddingToFavorites) {
      text = I18n.t('general.elements.unFolow')
    }

    const placeId = placeRoute.split('-').pop();
    const accountIsConfirmed = user.confirmed || false;
    const isOwinPlace = user.placePending === 'ok'
      && user.placeDetails.id === placeId;

    const removeButton = (
      <button
        key="RemoveFromFavorites"
        className={classes('btn btn-red', {
          "inTransition": isRemovingFromFavorites,
          "isNotGoing": !isRemovingFromFavorites
        })}
        onMouseOver={() => this.setState({ textOver: true })}
        onMouseOut={() => this.setState({ textOver: false })}
        onClick={() => {
          if (!isRemovingFromFavorites) {
            this.setState({
              isRemovingFromFavorites: true,
            }, () => {
              this.toggleFavoriteStatusFetcher =
                dispatch(
                  removePlaceFromFavorites(
                    accessToken,
                    placeId
                  )
                );

              this.toggleFavoriteStatusFetcher
                .then(() => {
                  this.setState({
                    isRemovingFromFavorites: false,
                    followersNumber: followersNumber - 1,
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

    const addButton = (
      <button
        key="AddToFavorites"
        className={classes('btn btn-red', {
          "inTransition": isAddingToFavorites,
        })}
        onClick={() => {
          if(accountIsConfirmed){
            if (isAuthenticated) {
              if (!isAddingToFavorites) {
                this.setState({
                  isAddingToFavorites: true,
                }, () => {
                  this.toggleFavoriteStatusFetcher =
                    dispatch(
                      addPlaceToFavorites(
                        accessToken,
                        placeId
                      )
                    );

                  this.toggleFavoriteStatusFetcher
                    .then(() => {
                      this.setState({
                        isAddingToFavorites: false,
                        followersNumber: followersNumber + 1,
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
              history.push('/login', {from: `places/${placeRoute}`});
          }
        }
        }
      >
        {
          (isAddingToFavorites && I18n.t('general.elements.addingToFavorites')) || I18n.t('general.elements.addToFavorites')
        }
      </button>
    );

    const notConfirmedAccountButton = (
      <WarningPopover key="AddToFavorites" isPopup>
        {addButton}
      </WarningPopover>
    );

    let buttons = [];

    if(!isOwinPlace) {
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

    if(reqestStatus && isAuthenticated){
      const adhereToPlace = (
        <button
          key="invite_pros"
          className='btn btn-red'
          onClick={() => {
            if(!reqestStatus.found){
              this.adhereToPlaceReqest = dispatch(
                fetchAuthorizedApiRequest(`/v1/professionals/connected/${placeId}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  },
                })
              );

              this.adhereToPlaceReqest
              .then(response => {
                switch(response.status) {
                  case 204:
                    this.setState({
                      reqestStatus: update(reqestStatus, {
                        found: {
                          $set: true,
                        },
                      }),
                      errors: null
                    })
                    return Promise.resolve();

                  case 404:

                    return response.json().then(errors => {

                      this.setState({errors: errors.message});

                      return Promise.reject(
                        new UnprocessableEntity()
                      );
                    });

                  default:
                    return Promise.reject(
                      new SilencedError('Failed to adhere to place.')
                    );
                }
              })
            }
          }}
        >
          {
            (reqestStatus.found && (
              (reqestStatus.status && (
                I18n.t('agent.userIsPlaceMember')
              )) || I18n.t('agent.adhereToPlaceWaitResponse')
            )) || I18n.t('agent.adhereToPlace')
          }
        </button>
      );

      buttons.push(adhereToPlace);
    }

    const followersButton = (
      <div className="followersCount not-modal">
        <i className="icon-man-bold" /> / { followersNumber }
      </div>
    );

    buttons.push(followersButton);


    return buttons;
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return Place;
    }
  }


  getTitles(arr1, arr2){
    let titles = [];

    arr1.forEach((e1)=> arr2.forEach((e2)=>{
        if (e1.id === e2){
          titles.push(e1)
        }
      }
    ));

    return titles
  }

  render () {
    const {
      isLoaded,
      data,
      activeImageIndex,
      activeTabItemIndex,
      showMore,
      errors,
      placesRecommend,
    } = this.state;

    const {
      isAuthenticated,
      user,
      history
    } = this.props;

    if ( !isLoaded) {
      return (
        <Loader />
      );
    }

    if ( !data) {
      return (
        <PageNotFound />
      );
    }

    const Place = this.getListItem();
    const defaultBranch = data.branches.find(br => br.default);
    const defaultImage = defaultBranch.gallery.images[activeImageIndex];
    const images = defaultBranch.gallery.images;
    const titles = data.hobbies.map(({
           titles,
           dataFromPivotTable,
    }) => ({titles: dataFromPivotTable.titles.length ?
        this.getTitles(titles.place, dataFromPivotTable.titles) : null}));

    const iteration = titles.map(data => data.titles ? data.titles.map(({name}) => name) : null);
    const PureTitles = [].concat(...iteration);

    return (
      <Place
        placesRecommend={placesRecommend}
        errors={errors}
        data={data}
        user={user}
        redirectToClaim={() => history.push(isAuthenticated ? `/profile/settings/place` : `/login`, {data: data})}
        defaultBranch={defaultBranch}
        defaultImage={defaultImage}
        branchesList={data.branches}
        activeTabItemIndex={activeTabItemIndex}
        isAuthenticated={isAuthenticated}
        actionButtonsList={this.actionButtons()}
        tabOptions={this.tabOptions()}
        activeImageIndex={activeImageIndex}
        onImageSelect={activeImageIndex => this.setState({activeImageIndex})}
        onActiveTabChange={activeTabItemIndex =>
          this.setState({activeTabItemIndex})
        }
        titles={PureTitles}
        onShowMore={() => this.setState({showMore: !showMore})}
        showMore={showMore}
        moveDownImage={() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === 0
                ? images.length - 1
                : activeImageIndex - 1,
          })
        }}

        moveUpImage={() => {
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
    productsList: state.products.list,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(PlaceContainer)));
