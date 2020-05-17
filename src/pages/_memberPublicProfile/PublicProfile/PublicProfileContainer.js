import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchApiRequest, fetchAuthorizedApiRequest } from '../../../fetch';
import { InternalServerError } from '../../../exceptions/http';
import { SilencedError } from "../../../exceptions/errors";
import { MOBILE_VERSION } from '../../../actions/app';
import { addNewUserToInvitedList } from '../../../actions/user';
import Loader from '../../../components/Loader/Loader';
import PublicProfile from './PublicProfile';
import PublicProfileMobile from './PublicProfileMobile';
import {I18n} from "react-redux-i18n";
import GroupsList from "./components/GroupsList/GroupsList"

class PublicProfileContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      profileDetails: {},
      showChatPopup: false,
      isLoaded: false,
      activeTabItemIndex: 0,
    };

    this.inviteMemberToBePros = this.inviteMemberToBePros.bind(this);
  };

  componentDidMount() {
    const { match: {params: { userId: userRoute}}} = this.props;
    const userId = userRoute.split('-').pop();
    this.getUserDetails(userId);
  }

  componentWillReceiveProps(nextPros) {
    const { match: {params: { userId: userRoute}}} = nextPros;
    const userId = userRoute.split('-').pop();
    this.getUserDetails(userId);
  }

  getUserDetails(userId) {
    this.userDataFetcher = fetchApiRequest(`/v1/users/${userId}`);
    this.userDataFetcher
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new SilencedError('Failed to fetch user details.')
            );
        }
      })
      .then(profileDetails => {
        this.setState({
          profileDetails,
          isLoaded: true,
        });
        return Promise.resolve();
      })
  }

  getUIVersion() {
    const { UIVersion } = this.props;

    if(UIVersion === MOBILE_VERSION){
      return PublicProfileMobile
    }

    return PublicProfile;
  }

  inviteMemberToBePros() {
    const { profileDetails: {
      id: userId,
      fullName,
      shortName,
      avatar,
    }} = this.state;

    const {
      dispatch,
      accessToken,
    } = this.props;

    this.inviteMemberFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/invite-member-to-be-prof`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );

    this.inviteMemberFetcher
    .then(response => {
      switch(response.status) {
        case 200:
          dispatch(addNewUserToInvitedList({
            id: userId,
            fullName,
            shortName,
            avatar,
            status: false
          }))
          return Promise.resolve();
        default:
          return Promise.reject(
            new InternalServerError()
          );
      }
    })
  }

  render() {
    const {
      profileDetails,
      showChatPopup,
      isLoaded,
      activeTabItemIndex,
    } = this.state;

    const {
      user: {
        invitedUsers,
        profDetails,
        roles,
      },
      isAuthenticated,
    } = this.props;

    if(!isLoaded) {
      return (
        <Loader />
      );
    }

    const memberTab = () => {
      return [
        {
          title: I18n.t('general.header.groups'),
          content: (
            <GroupsList  />
          ),
        },
      ]
    };

    const View = this.getUIVersion();
    const getInvitationStatus = !!invitedUsers.find(u => u.id === profileDetails.id);
    const canInviteMember = !!roles && !!roles.find(r => r.canInviteMember);

    return (
      <View
        inviteMemberToBePros={this.inviteMemberToBePros}
        profileDetails={profileDetails}
        showChatPopup={showChatPopup}
        userIsPros={!!profDetails}
        canInviteMember={canInviteMember}
        userWasInvited={getInvitationStatus}
        onChatPopupOpen={() => this.setState({showChatPopup: true})}
        onClosePopup={() => this.setState({showChatPopup: false})}
        tabOptions={memberTab()}
        activeTabItemIndex={activeTabItemIndex}
        onActiveTabChange={activeTabItemIndex => this.setState({activeTabItemIndex})}
        isAuthenticated={isAuthenticated}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    UIVersion: state.app.UIVersion,
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
  };
}

export default withRouter(connect(mapStateToProps)(PublicProfileContainer));
