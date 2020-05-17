import React, { Component } from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux'
import { InternalServerError } from '../../../../../exceptions/http';
import { clearInvitationsNotifications } from '../../../../../actions/notifications';
import { appendToFormData } from "../../../../../helpers/form";
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { SilencedError } from "../../../../../exceptions/errors";
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { MOBILE_VERSION } from '../../../../../actions/app';
import Loader from '../../../../../components/Loader';
import View from './View';


class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      placesAreLoaded: false,
      prosAreLoaded: false,
      placesList: [],
      professionalsList: [],
      usersInvitedToBeProsList: [],
    };

    this.profActionButtons = this.profActionButtons.bind(this);
    this.placeActionButtons = this.placeActionButtons.bind(this);
  };

  componentDidMount(){
    const {dispatch, accessToken, user} = this.props;
    if(user.placePending === 'ok'){
      this.fetchProfessionalsList();
    } else {
      this.setState({
        prosAreLoaded: true
      })
    }

    if(user.profPending === 'ok'){
      this.fetchPlacesList();
      this.fetchUsersThatInvitedToBePros();
    } else {
      this.setState({
        placesAreLoaded: true
      })
    }

    this.seenPlacesAndProsNotificationsFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/notifications/last-seen`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            module: ['places', 'professionals'].map(m => m)
          },
          'lastSeen',
        ),
      })
    )
  }

  componentWillUnmount() {
    if (this.seenPlacesAndProsNotificationsFetcher instanceof Promise) {
      this.seenPlacesAndProsNotificationsFetcher.cancel();
    }

    this.props.dispatch(
      clearInvitationsNotifications()
    )
  }


  fetchProfessionalsList() {
    const { user, accessToken, dispatch } = this.props;

    this.fetchProfessionalsList = dispatch(
      fetchAuthorizedApiRequest(`/v1/places/connected/${user.placeDetails.id}?accepted=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.fetchProfessionalsList
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
    .then(g => {
      this.setState({
        professionalsList: g.list,
        prosAreLoaded: true,
      });

      return Promise.resolve();
    });
  }

  fetchPlacesList() {
    const { user, accessToken, dispatch } = this.props;

    this.fetchPlacesListReqest = dispatch(
      fetchAuthorizedApiRequest(`/v1/professionals/connected/${user.profDetails.id}?accepted=false`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.fetchPlacesListReqest
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
    .then(g => {
      this.setState({
        placesList: g.list,
        placesAreLoaded: true,
      });

      return Promise.resolve();
    });
  }

  fetchUsersThatInvitedToBePros() {
    const { accessToken, dispatch } = this.props;

    this.fetchProsThatInvitedUserReqest = dispatch(
      fetchAuthorizedApiRequest(`/v1/account/invitations/sent`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.fetchProsThatInvitedUserReqest
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
    .then(usersInvitedToBeProsList => {
      this.setState({usersInvitedToBeProsList});

      return Promise.resolve();
    });
  }

  profActionButtons(profid){
    const { professionalsList } = this.state;
    const { dispatch, accessToken } = this.props;
    const profIndex = professionalsList.findIndex(e => e.id === profid);

    return [
      <span
        key="rejectReqest"
        onClick={() => {
          confirm('Sure reject this invitation?', {
            omitOverflow: true,
          })
          .then(() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/places/connected/${profid}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              })
            )
            .then(response => {
              switch (response.status) {
                case 204:
                  this.setState({
                    professionalsList: update(professionalsList, {
                      $splice: [[profIndex, 1]],
                    }),
                  });

                  return Promise.resolve();
                default:
                  return Promise.reject(
                    new SilencedError('Failed to reject invitation.')
                  );
              }
            });
          });
        }}
      >
        respinge
      </span>,
      <span
        key="acceptReqest"
        onClick={() => {
          confirm('Sure accept this invitation?', {
            omitOverflow: true,
          })
          .then(() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/places/connected/${profid}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              })
            )
            .then(response => {
              switch (response.status) {
                case 204:
                  this.setState({
                    professionalsList: update(professionalsList, {
                      $splice: [[profIndex, 1]],
                    }),
                  });

                  return Promise.resolve();
                default:
                  return Promise.reject(
                    new SilencedError('Failed to accept invitation.')
                  );
              }
            });
          });
        }}
      >
        accepta
      </span>
    ];
  }

  placeActionButtons(placeId) {
    const { placesList } = this.state;
    const { dispatch, accessToken } = this.props;
    const placeIndex = placesList.findIndex(e => e.id === placeId);

    return [
      <span
        key="rejectReqest"
        onClick={() => {
          confirm('Sure reject this invitation?', {
            omitOverflow: true,
          })
          .then(() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/professionals/connected/${placeId}`, {
                method: 'DELETE',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              })
            )
            .then(response => {
              switch (response.status) {
                case 204:
                  this.setState({
                    placesList: update(placesList, {
                      $splice: [[placeIndex, 1]],
                    }),
                  });

                  return Promise.resolve();
                default:
                  return Promise.reject(
                    new SilencedError('Failed to accept invitation.')
                  );
              }
            });
          });
        }}
      >
        respinge
      </span>,
      <span
        key="acceptReqest"
        onClick={() => {
          confirm('Sure accept this invitation?', {
            omitOverflow: true,
          })
          .then(() => {
            dispatch(
              fetchAuthorizedApiRequest(`/v1/professionals/connected/${placeId}`, {
                method: 'PUT',
                headers: {
                  'Authorization': `Bearer ${accessToken}`,
                },
              })
            )
            .then(response => {
              switch (response.status) {
                case 204:
                  this.setState({
                    placesList: update(placesList, {
                      $splice: [[placeIndex, 1]],
                    }),
                  });

                  return Promise.resolve();
                default:
                  return Promise.reject(
                    new SilencedError('Failed to accept invitation.')
                  );
              }
            });
          });
        }}
      >
        accepta
      </span>
    ];
  }

  render() {
    const {
      placesList,
      professionalsList,
      usersInvitedToBeProsList,
      prosAreLoaded,
      placesAreLoaded,
    } = this.state;

    const {
      UIVersion,
      user
    } = this.props;

    if(!placesAreLoaded || !prosAreLoaded) {
      return (
        <Loader />
      )
    }

    const notifications = [
      ...placesList.map(data => ({...data, module: 'places'})),
      ...professionalsList.map(data => ({...data, module: 'pros'})),
      ...usersInvitedToBeProsList.map(data => ({...data, module: 'users'}))
    ];

    return (
      <View
        isMobile={UIVersion === MOBILE_VERSION}
        user={user}
        notificationsList={notifications}
        profActionButtons={this.profActionButtons}
        placeActionButtons={this.placeActionButtons}
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

export default connect(mapStateToProps)(Container);
