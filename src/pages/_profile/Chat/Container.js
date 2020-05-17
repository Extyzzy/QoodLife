import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux'
import { fetchAuthorizedApiRequest } from '../../../fetch';
import { SilencedError } from "../../../exceptions/errors";
import { clearChatUserNotification } from '../../../actions/notifications';
import { MOBILE_VERSION } from '../../../actions/app';
import { I18n } from 'react-redux-i18n';
import update from 'immutability-helper';
import View from './View';

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      popupIsOpen: false,
      activeOpponentId: null,
      opponentsList: [],
      reqiredOpponent: '',
    };

    this.onDeleteConversation = this.onDeleteConversation.bind(this);
    this.replaceOpponentToTop = this.replaceOpponentToTop.bind(this);
  };

  componentDidMount() {
    const systemUser = {
      id: null,
      avatar: null,
      fullName: I18n.t('profile.chat.systemNotifications'),
      shortName: 'System',
      unviewedMessages: !!this.props.systemNotifications.length
        ? {
          partner_details: null,
          un_viewed_sms: this.props.systemNotifications.length
        } : null
    };

    const ableToSeeNotifications = this.props.currentUser.roles.find(r =>
      r.code === 'place' || r.code === 'professional'
    );

    if(ableToSeeNotifications) {
      this.setState({
        opponentsList: this.state.opponentsList.concat(systemUser)
      })
    }

    this.getOpponentsList();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.unviewedMessages.length !== this.props.unviewedMessages.length) {
      this.setState({
        opponentsList: this.state.opponentsList.map(opp => ({
          ...opp,
          unviewedMessages: nextProps.unviewedMessages.find(n => n.partner_details.id === opp.id)
        }))
      })
    }
  }

  componentWillUnmount() {
    if (this.receiveOpponentsListFetcher instanceof Promise) {
      this.receiveOpponentsListFetcher.cancel();
    }

    if (this.deleteConversationFetcher instanceof Promise) {
      this.deleteConversationFetcher.cancel();
    }
  }

  getOpponentsList() {
    const { dispatch, accessToken, unviewedMessages } = this.props;

    this.receiveOpponentsListFetcher = dispatch(
      fetchAuthorizedApiRequest(
        `/v1/account/messages?style=withoutMessages`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    );

    this.receiveOpponentsListFetcher.then(response => {
      switch (response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed fetch chat opponents.')
        );
      }
    })
    .then(data => {
      this.setState({
        opponentsList: [
          ...this.state.opponentsList,
          ...data.list.map(({
            partner_details: {
              id,
              fullName,
              shortName,
              avatar,
            },
          }) => ({
            id,
            fullName,
            shortName,
            avatar,
            unviewedMessages: unviewedMessages.find(n => n.partner_details.id === id)
          }))
        ]
      });
      return Promise.resolve();
    });
  }

  removeListItemNotification(opponent_id) {
      const { opponentsList } = this.state;
      const opponentIndex = opponentsList.findIndex(o => o.id === opponent_id);

      this.setState({
        opponentsList: update(this.state.opponentsList, {
          [opponentIndex]: {
            unviewedMessages: { $set: null }
          }
        })
      }, () => this.props.dispatch(clearChatUserNotification(opponent_id)))
  }

  replaceOpponentToTop(opponent_id) {
    const { opponentsList } = this.state;
    const opponentIndex = opponentsList.findIndex(o => o.id === opponent_id);

    if(opponentIndex > 0) {
      const opponent = opponentsList.find(o => o.id === opponent_id);

      const listNoFirst = update(opponentsList, {
        $splice: [[opponentIndex, 1]],
      });

      this.setState({
        opponentsList: [
          opponent,
          ...listNoFirst,
        ],
      });
    }
  }

  onDeleteConversation(opponentId){
    const { dispatch, accessToken } = this.props;
    const { opponentsList } = this.state;

    this.deleteConversationFetcher = dispatch(
      fetchAuthorizedApiRequest(
        `/v1/account/messages/${opponentId}/delete`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    );

    this.deleteConversationFetcher.then(response => {
      switch (response.status) {
        case 204:
          return Promise.resolve();
        default:
          return Promise.reject(
            new SilencedError('Failed to delete conversation.')
        );
      }
    })
    .then(() => {
      const opponentIndex = opponentsList.findIndex(o => o.id === opponentId);
      this.setState({
        opponentsList: update(opponentsList, {
          $splice: [[opponentIndex, 1]],
        }),
      });
    });
  }

  render() {
    const {
      reqiredOpponent,
      opponentsList,
      activeOpponentId,
      popupIsOpen,
    } = this.state;

    const {
      isAuthenticated,
      UIVersion,
    } = this.props;

    const opponentsListWithFilter = opponentsList.filter(opponent =>
      opponent.fullName.toLowerCase().indexOf(
        reqiredOpponent.toLowerCase()
      ) >= 0
    );

    return (
      <View
        isMobile={UIVersion === MOBILE_VERSION}
        isAuthenticated={isAuthenticated}
        reqiredOpponent={reqiredOpponent}
        opponentsList={opponentsListWithFilter}
        activeOpponentId={activeOpponentId}
        popupIsOpen={popupIsOpen}
        onDeleteConversation={this.onDeleteConversation}
        replaceOpponentToTop={this.replaceOpponentToTop}
        removeListItemNotification={(id) => this.removeListItemNotification(id)}

        onOpponentChange={(opponent) =>
          this.setState({
            popupIsOpen: true,
            activeOpponentId: opponent.id,
          })
        }

        onOpponentInputChange={(e) =>
          this.setState({reqiredOpponent: e.target.value})
        }

        onClosePopup={() =>
          this.setState({popupIsOpen: false})
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    currentUser: state.user,
    isAuthenticated: state.auth.isAuthenticated,
    unviewedMessages: state.notifications.forChat,
    systemNotifications: state.notifications.forInvitations,
    accessToken: state.auth.accessToken,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(Container));
