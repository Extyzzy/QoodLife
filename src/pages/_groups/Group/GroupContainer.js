import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import Group from './Group';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import {SilencedError} from "../../../exceptions/errors";
import s from './Group.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import MobileVersion from './GroupMobile';
import { MOBILE_VERSION } from '../../../actions/app';
import WarningPopover from '../../../components/WarningPopover';
import Loader from '../../../components/Loader/Loader';
import PageNotFound from '../../_errors/PageNotFound/PageNotFound';
import update from "immutability-helper";
import classes from "classnames";
import moment from "moment";
import { pick } from "lodash";
import {I18n} from 'react-redux-i18n';
import {
  joinGroup,
  leaveGroup,
} from "../../../actions/groups";

class GroupContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
      data: null,
      isJoining: false,
      isLeaving: false,
      activeImageIndex: null,
      viewMembersDetails: false,
      showChatPopup: false,
      sliderSettings: {
        autoplaySpeed: 3000,
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true
      }
    };

    this.actionButtons = this.actionButtons.bind(this);
  }

  componentDidMount() {
    const { match } = this.props;
    const { groupId: groupRoute } = match.params;

    const groupId = groupRoute.split('-').pop();

    const {
      dispatch,
      accessToken,
    } = this.props;

    this.postFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/groups/${groupId}`, {
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
              new SilencedError('Failed to fetch group.')
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

  componentWillUnmount() {
    if (this.postFetcher instanceof Promise) {
      this.postFetcher.cancel();
    }

    if (this.toggleJoiningStatusFetcher instanceof Promise) {
      this.toggleJoiningStatusFetcher.cancel();
    }
  }

  actionButtons() {
    const {
      history,
      dispatch,
      isAuthenticated,
      accessToken,
      user,
      match: {params: {groupId: groupRoute}},
    } = this.props;

    const groupId = groupRoute.split('-').pop();
    const {
      isJoining,
      isLeaving,
      data,
      data: {
        members,
        owner
      },
    } = this.state;

    const isGroupOwner = user.id === owner.id;
    const isMember = !!members.find(m => m.id === user.id);
    const isFull = members.length >= data.amount;
    const accountIsConfirmed = user.confirmed;
    const userData = {
      id: user.id,
      fullName: user.fullName,
      owner: false,
      avatar: user.avatar? user.avatar : null,
    };

    const userSharableData = pick(userData, [
      'id',
      'fullName',
      'owner',
      'avatar'
    ]);

    const leaveButton = (
      <button
        key="leaveGroup"
        className={classes("btn btn-red", {
          "inTransition": isLeaving
        })}
        onClick={() => {
          if (!isLeaving) {
            this.setState({
              isLeaving: true,
            }, () => {
              this.toggleJoiningStatusFetcher =
                dispatch(
                  leaveGroup(
                    accessToken,
                    groupId
                  )
                );

              this.toggleJoiningStatusFetcher
                .then(() => {
                  this.setState({
                    isLeaving: false,
                    data: update(data, {
                      members: {
                        $splice: [[members.findIndex(m =>
                          m.id === user.id
                        ), 1]],
                      },
                    }),
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
    );

    const joinButton = (
        <button
          key="joinToGroup"
          className={classes("btn btn-red", {
            "inTransition": isJoining
          })}
          onClick={() => {
            if(accountIsConfirmed){
              if (isAuthenticated) {
                this.setState({
                  isJoining: true,
                }, () => {
                  this.toggleJoiningStatusFetcher =
                    dispatch(
                      joinGroup(
                        accessToken,
                        groupId
                      )
                    );

                  this.toggleJoiningStatusFetcher
                    .then(() => {
                      this.setState({
                        isJoining: false,
                        data: update(data, {
                          members: {
                            $push: [userSharableData],
                          },
                        }),
                      });
                    });
                });
              }
            } else {
              if(!isAuthenticated)
                history.push('/login', {from: `groups/${groupRoute}`});
            }
          }}
        >
          {
            (isJoining && I18n.t('groups.inProgressButton')) ||
            I18n.t('groups.joinToGroupButton')
          }
        </button>
    );

    const notConfirmedAccountButton = (
      <WarningPopover key="joinToGroup" isPopup={true}>
        {joinButton}
      </WarningPopover>
    );

    const writeMessageButton = (
        <button
          key="writeMessage"
          className="btn btn-red"
          onClick={() => this.setState({showChatPopup: true})}
        >
          {I18n.t('general.elements.writeMessage')}
        </button>
    );

    const notConfirmedAccountwriteMessageButton = (
      <WarningPopover key="writeMessage" isPopup={true}>
        {writeMessageButton}
      </WarningPopover>
    );

    let buttons = [];

    if(!isGroupOwner) {
      if(isMember) {
        buttons.push(leaveButton);
      } else {
          if(!isFull) {
            if(accountIsConfirmed) {
              buttons.push(joinButton);
            } else {
              buttons.push(notConfirmedAccountButton);
            }
          }
      }
    };

    if(accountIsConfirmed){
      buttons.push(writeMessageButton);
    } else {
      if(isAuthenticated)
      buttons.push(notConfirmedAccountwriteMessageButton);
    };


    return buttons;
  }

  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return Group;
    }
  }

  render () {
    const {
      isLoaded,
      data,
      showChatPopup,
      activeImageIndex,
      viewMembersDetails,
      sliderSettings
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
    const Group = this.getListItem();
    const defaultImage = data.gallery.images[activeImageIndex];
    const location = data.location || (data.event && data.event.location);
    const groupWithDate = !!data.since || !!data.event;
    const since = moment(data.since || (data.event && data.event.since), 'X');
    const until = moment(data.until || (data.event && data.event.until), 'X');

    return (
      <Group
        data={data}
        location={location}
        since={since}
        until={until}
        showChatPopup={showChatPopup}
        groupWithDate={groupWithDate}
        defaultImage={defaultImage}
        viewMembersDetails = {viewMembersDetails}
        toggleDetails = {()=> this.setState({viewMembersDetails : !viewMembersDetails})}
        onClosePopup={() => this.setState({showChatPopup: false})}
        actionButtonsList={this.actionButtons()}
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
        sliderSettings={sliderSettings}
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

export default withRouter(connect(mapStateToProps)(withStyles(s)(GroupContainer)));
