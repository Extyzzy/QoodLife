import React, { Component } from 'react';
import { withRouter } from "react-router";
import { connect } from "react-redux";
import update from "immutability-helper";
import { MOBILE_VERSION } from '../../../../../actions/app';
import { joinGroup } from "../../../../../actions/groups";
import ListItem from './ListItem';

class ListItemContainer extends Component {
  constructor(props, context) {
    super(props, context);
    const { data } = this.props;

    this.state = {
      data,
      isJoining: false,
      showJoinButton: true,
    };

    this.onJoinToGroup = this.onJoinToGroup.bind(this);
  }

  onJoinToGroup() {
    const {
      isAuthenticated,
      user,
      history,
      dispatch,
      accessToken
    } = this.props;

    const { isJoining, data } = this.state;
    const { id: groupId } = data;

    if (isAuthenticated) {
      if (!isJoining) {
        this.setState({
          isJoining: true,
        }, () => {
          this.toggleJoiningStatusFetcher =
            dispatch(
              joinGroup(
                accessToken,
                groupId
              )
            )

          this.toggleJoiningStatusFetcher
            .then(() => {
              const userData = {
                id: user.id,
                fullName: user.fullName,
                owner: false,
                avatar: user.avatar? user.avatar : null,
              };

              this.setState({
                isJoining: false,
                showJoinButton: false,
                data: update(data, {
                  members: {
                    $push: [userData],
                  },
                }),
              });
            });
        });
      }
    }
    else {
      history.push('/login', {from: `groups/${groupId}`});
    }
  }

  render() {
    const { isJoining, showJoinButton, data } = this.state;
    const { isAuthenticated, user, UIVersion, history } = this.props;
    const { members } = data;
    const owner = members.find(i => i.owner);
    const isMember = isAuthenticated && !!members.find(m => m.id === user.id);
    const isFull = members.length >= data.size;

    let tags = document.querySelectorAll("#links a");

    if (tags) {
      for (let tag of tags){
        tag.setAttribute('target', '_blank');
      }
    }

    return (
      <ListItem
        data={data}
        owner={owner}
        isFull={isFull}
        isMember={isMember}
        isMobile={UIVersion === MOBILE_VERSION}
        isAuthenticated={isAuthenticated}
        accountIsConfirmed={user.confirmed}
        onJoinToGroup={this.onJoinToGroup}
        onUserProfileOpen={(userId) => history.push(`/member/${userId}`)}
        isJoining={isJoining}
        showJoinButton={showJoinButton}
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

export default withRouter(connect(mapStateToProps)(ListItemContainer));
