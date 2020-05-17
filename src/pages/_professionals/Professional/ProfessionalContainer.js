import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import classes from 'classnames';
import update from "immutability-helper";
import {SilencedError} from "../../../exceptions/errors";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Professional.scss';
import MobileVersion from './ProfessionalMobile';
import { MOBILE_VERSION } from '../../../actions/app';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import Professional from './Professional';
import WarningPopover from '../../../components/WarningPopover';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import {I18n} from 'react-redux-i18n';
import {
  follow as followTheProfessional,
  unfollow as unfollowTheProfessional,
} from '../../../actions/professionals';

import PostsList from "./components/PostsList";
import EventsList from "./components/EventsList";
import ProductsList from "./components/ProductsList";
import GroupsList from "./components/GroupsList";
import PlacesList from "./components/PlacesList";
import {UnprocessableEntity} from "../../../exceptions/http";
import {
  changeSidebarGroup,
  SIDEBAR_GROUP_ALL,
  SIDEBAR_GROUP_RELATED
} from "../../../actions/navigation";

class ProfessionalsContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      textOver: false,
      data: null,
      reqestStatus: null,
      activeImageIndex: null,
      activeTabItemIndex: 0,
      followersNumber: 0,
      showMore: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      isAuthenticated,
      accessToken,
      user,
      match: {params: {professionalId: professionalRoute}},
    } = this.props;

    const localStorageLang = localStorage.getItem('USER_LANGUAGE');

    dispatch(changeSidebarGroup(SIDEBAR_GROUP_RELATED));

    const professionalId = professionalRoute.split('-').pop();

    this.professionalFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/professionals/${professionalId}?lang=${localStorageLang ? localStorageLang : 'en'}`, {
        ...(isAuthenticated ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );

    this.professionalFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch professional.')
            );
        }
      })
      .then(data => {
        const {gallery: {images}} = data;

        this.setState({
          data,
          followersNumber: data.followers,
          activeImageIndex: images.findIndex(i => i.default),
        });

        return Promise.resolve();
      })
      .finally(() => {
        if ( ! this.professionalFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });

      if(user.placePending === "ok"){
        this.getReqestStatus();
      }
  }

  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch(changeSidebarGroup(SIDEBAR_GROUP_ALL));

    if (this.professionalFetcher instanceof Promise) {
      this.professionalFetcher.cancel();
    }

    if (this.toggleFollowStatusFetcher instanceof Promise) {
      this.toggleFollowStatusFetcher.cancel();
    }
  }

  getReqestStatus() {
    const {
      dispatch,
      accessToken,
      match: {params: {professionalId: professionalRoute}},
    } = this.props;

    const professionalId = professionalRoute.split('-').pop();

    dispatch(
      fetchAuthorizedApiRequest(`/v1/places/connected/${professionalId}/status`, {
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
    const ownerID = this.state.data.owner.id;

    return [
      {
        title: I18n.t('general.header.events'),
        content: (
          <EventsList
            ownerID={ownerID}
          />
        ),
      },
      {
        title: I18n.t('general.header.places'),
        content: (
          <PlacesList />
        )
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
    ]
  }

  actionButtons() {
    const {
      history,
      dispatch,
      isAuthenticated,
      accessToken,
      match: {params: {professionalId: professionalRoute}},
      user,
    } = this.props;

    const professionalId = professionalRoute.split('-').pop();
    const accountIsConfirmed = user.confirmed || false;
    const isProfessionalOwner = user.profPending === 'ok'
      && user.profDetails.id === professionalId;

    const {
      isStartingToFollow,
      isStoppingToFollow,
      reqestStatus,
      followersNumber,
      data,
      data: { follow },
      textOver,
    } = this.state;


    let text = I18n.t('general.elements.addedFollow');

    if (textOver) {
      text = I18n.t('general.elements.unFollowingOver');
    }

    if (isStartingToFollow) {
      text = I18n.t('general.elements.unFolow')
    }


    const followButton = (
      <button
        key="Follow"
        className={classes('btn btn-red', {
          "inTransition": isStartingToFollow,
        })}
        onClick={() => {
          if(accountIsConfirmed){
            if(isAuthenticated){
              if (!isStartingToFollow) {
                this.setState({
                  isStartingToFollow: true,
                }, () => {
                  this.toggleFollowStatusFetcher =
                    dispatch(
                      followTheProfessional(
                        accessToken,
                        professionalId
                      )
                    );

                  this.toggleFollowStatusFetcher
                    .then(() => {
                      this.setState({
                        isStartingToFollow: false,
                        followersNumber: followersNumber + 1,
                        data: update(data, {
                          follow: {
                            $set: true,
                          },
                        }),
                      });
                    });
                });
              }
            }
          } else {
            if(!isAuthenticated)
              history.push('/login', {from: `professionals/${professionalRoute}`});
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
        onMouseOver={() => this.setState({ textOver: true })}
        onMouseOut={() => this.setState({ textOver: false })}
        onClick={() => {
          if (!isStoppingToFollow) {
            this.setState({
              isStoppingToFollow: true,
            }, () => {
              this.toggleFollowStatusFetcher =
                dispatch(
                  unfollowTheProfessional(
                    accessToken,
                    professionalId
                  )
                );

              this.toggleFollowStatusFetcher
                .then(() => {
                  this.setState({
                    isStoppingToFollow: false,
                    followersNumber: followersNumber - 1,
                    data: update(data, {
                      follow: {
                        $set: false,
                      },
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

    const notConfirmedAccountButton = (
      <WarningPopover key="AddToFavorites" isPopup={true}>
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


    if(reqestStatus && isAuthenticated){
      const inviteProfessional = (
        <button
          key="invite_pros"
          className='btn btn-red'
          onClick={() => {
            if(!reqestStatus.found){
              this.inviteProfessionalReqest = dispatch(
                fetchAuthorizedApiRequest(`/v1/places/connected/${professionalId}`, {
                  method: 'POST',
                  headers: {
                    'Authorization': `Bearer ${accessToken}`,
                  },
                })
              );

              this.inviteProfessionalReqest
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
                      new SilencedError('Failed to invite Professional.')
                    );
                }
              })
            }
          }}
        >
          {
            (reqestStatus.found && (
              (reqestStatus.status && (
                I18n.t('professionals.professionalIsTeamMember')
              )) || I18n.t('professionals.inviteProfessionalWaitResponse')
            )) || I18n.t('professionals.inviteProfessional')
          }
        </button>
      );

      buttons.push(inviteProfessional);
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
        return Professional;
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

    const Professional = this.getListItem();
    const images = data.gallery.images;
    const defaultImage = images[activeImageIndex];
    const titles = data.hobbies.map(({
         titles,
         dataFromPivotTable,
       }) => ({titles: dataFromPivotTable.titles.length ?
        this.getTitles(titles.professional, dataFromPivotTable.titles) : null}));

    const iteration = titles.map(data => data.titles ? data.titles.map(({name}) => name) : null);
    const PureTitles = [].concat(...iteration);

    return (
      <Professional
        data={data}
        titles={PureTitles}
        ownerID={data.owner.id}
        defaultImage={defaultImage}
        isAuthenticated={this.props.isAuthenticated}
        actionButtonsList={this.actionButtons()}
        tabOptions={this.tabOptions()}
        activeImageIndex={activeImageIndex}
        activeTabItemIndex={activeTabItemIndex}
        onActiveTabChange={activeTabItemIndex => this.setState({activeTabItemIndex})}
        onShowMore={() => this.setState({showMore: !showMore})}
        showMore={showMore}
        onImageSelect={activeImageIndex => {
          this.setState({activeImageIndex});
        }}
        errors={errors}
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

export default withRouter(connect(mapStateToProps)(withStyles(s)(ProfessionalsContainer)));
