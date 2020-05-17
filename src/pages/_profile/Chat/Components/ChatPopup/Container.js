import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  fetchAuthorizedApiRequest,
  fetchApiRequest
} from '../../../../../fetch';
import { getQueryData } from '../../../../../helpers/filter';
import { appendToFormData } from '../../../../../helpers/form';
import { SilencedError } from "../../../../../exceptions/errors";
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { MOBILE_VERSION } from '../../../../../actions/app';
import { I18n } from 'react-redux-i18n';
import config from '../../../../../config';
import Loader from '../../../../../components/Loader';
import update from 'immutability-helper';
import io from 'socket.io-client';
import View from './View';

class Container extends Component {
  static defaultProps = {
    replaceOpponentToTop: () => {},
    removeListItemNotification: () => {},
    opponentId: null,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: true,
      editMode: false,
      oponentIsType: false,
      couldLoadMore: false,
      editMessageId: null,
      messageToSearch: '',
      replyInput: '',
      messagesList: [],
      opponent: {},
    }

    this.appendMessage = this.appendMessage.bind(this);
    this.editMessage = this.editMessage.bind(this);
    this.deleteMessage = this.deleteMessage.bind(this);

    this.socket = io(config.socketsApi, {
      query: `roomId=${this.props.opponentId}.chat.${this.props.user.id}`
    }).connect();

    this.socket.on('server:new-message', message => {
      this.appenMessageFromSocket(message);
    });

    this.socket.on('server:typing', () => {
      this.onType(true);
    });

    this.socket.on('server:not-typing', () => {
      this.onType(false);
    });
  };

  componentDidMount() {
    this.getOpponentReplies();
    this.removeUserNotifications();
  }

  componentWillUnmount() {
    if (this.appendNewMessageFetcher instanceof Promise) {
      this.appendNewMessageFetcher.cancel();
    }

    if (this.deleteMessageFetcher instanceof Promise) {
      this.deleteMessageFetcher.cancel();
    }

    if (this.userDataFetcher instanceof Promise) {
      this.userDataFetcher.cancel();
    }

    if (this.setViewedMessagesFetcher instanceof Promise) {
      this.setViewedMessagesFetcher.cancel();
    }

    this.socket.disconnect();
  }

  appenMessageFromSocket({
    id,
    content,
    receiver,
    created_at,
    updated_at
  }){
    this.setState({
      messagesList: this.state.messagesList.concat({
        id,
        content,
        owner: this.state.opponent,
        receiver,
        created_at,
        updated_at
      })
    })
  }

  onType(mode){
    this.setState({oponentIsType: mode});
  }

  getFormData() {
    const { replyInput, editMode, opponent } = this.state;

    if(editMode){
      let formData =  appendToFormData(
        new FormData(),
        {
          content: replyInput,
          encodedReceiverId: opponent.id
        },
        'message'
      );
      formData.append('_method', 'PUT');

      return formData;
    } else {
      return appendToFormData(
        new FormData(),
        {
          content: replyInput,
          encodedReceiverId: opponent.id
        },
        'message',
      )
    }
  };

  appendMessage(event) {
    event.preventDefault();

    const {
      dispatch,
      accessToken,
      replaceOpponentToTop,
    } = this.props;

    const {
      messagesList,
      replyInput,
      editMode,
      editMessageId,
    } = this.state;

    if(replyInput.length > 0){
      if(editMode){
        this.editMessageFetcher = dispatch(
          fetchAuthorizedApiRequest(
            `/v1/account/messages/${editMessageId}/update`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
              body: this.getFormData(),
            }
          )
        );

        this.editMessageFetcher
        .then(response => {
          switch (response.status) {
            case 200:
              return response.json();
            default:
              return Promise.reject(
                new SilencedError('Failed to edit message.')
            );
          }
        })
        .then(({
          content,
          receiver: {id: receiver_id},
          updated_at,
          id,
        }) => {
          const messageToEdit = messagesList.findIndex(m => m.id === id);
          const editedMessage = { id, content, updated_at };

          this.setState({
            messagesList: update(messagesList, {
              [messageToEdit]: {
                content: {
                  $set: editedMessage.content,
                },
                updated_at: {
                  $set: editedMessage.updated_at,
                },
              },
            }),
            replyInput: '',
            editMode: false,
          }, () => {
            replaceOpponentToTop(receiver_id);
          });

          return Promise.resolve();
        });
      } else {
        this.appendNewMessageFetcher = dispatch(
          fetchAuthorizedApiRequest(
            `/v1/messages`,
            {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
              body: this.getFormData(),
            }
          )
        );

        this.appendNewMessageFetcher
        .then(response => {
          switch (response.status) {
            case 201:
              return response.json();
            default:
              return Promise.reject(
                new SilencedError('Failed to add new message.')
            );
          }
        })
        .then(({
          receiver,
          owner,
          content,
          created_at,
          updated_at,
          id,
        }) => {
          const messageObject = {
            id,
            receiver,
            owner,
            content,
            created_at,
            updated_at,
          };

          this.setState({
            messagesList: messagesList.concat(messageObject),
            replyInput: '',
          }, () => {
            this.socket.emit('client:new-message', messageObject);
            replaceOpponentToTop(receiver.id);
          });

          return Promise.resolve();
        });
      }
    }
  }

  editMessage(message) {
    this.setState({
      replyInput: message.content,
      editMessageId: message.id,
      editMode: true,
    }, () => {
      this.focusTextArea.focus();
    });
  }

  deleteMessage(messageId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      messagesList,
    } = this.state;

    confirm(I18n.t('profile.chat.confirmDeleteMessage')).then(() => {
      this.deleteMessageFetcher = dispatch(
        fetchAuthorizedApiRequest(
          `/v1/account/messages/${messageId}/delete`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            }
          }
        )
      );

      this.deleteMessageFetcher
      .then(response => {
        switch (response.status) {
          case 204:
            return Promise.resolve();
          default:
            return Promise.reject(
              new SilencedError('Failed to delete message.')
          );
        }
      })
      .then(() => {
        const messageIndex = messagesList.findIndex(m => m.id === messageId);

        this.setState({
          messagesList: update(messagesList, {
            $splice: [[messageIndex, 1]],
          }),
        });
      });
    })
  }

  getOpponentDetails() {
    const {
      opponentId
    } = this.props;

    this.userDataFetcher = fetchApiRequest(`/v1/users/${opponentId}`);
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
      .then(opponent => {
        this.setState({
          opponent,
          isLoading: false
        }, () => {
          return Promise.resolve();
        });
      })
  }

  removeUserNotifications() {
    const {
      opponentId,
      dispatch,
      accessToken,
      removeListItemNotification
    } = this.props;

    this.setViewedMessagesFetcher = dispatch(
      fetchAuthorizedApiRequest(
        `/v1/messages/dialogs/viewed`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: appendToFormData(
            new FormData(),
            {
              encodedPartnerId: opponentId
            }
          )
        }
      )
    )
    .then(response => {
      switch (response.status) {
        case 200:
          removeListItemNotification(opponentId);
          return Promise.resolve();
        default:
          return Promise.reject(
            new SilencedError('Failed to fetch user details.')
          );
      }
    })
  }

  loadMore() {
    const skipNoOfComments = 5;

    return getQueryData({
      take: skipNoOfComments,
      skip: this.state.messagesList.length
    });
  }

  getOpponentReplies(mode = '') {
    const { dispatch, accessToken, opponentId } = this.props;
    const { messagesList } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(
        `/v1/messages/${opponentId}` +
        (mode === 'load-more'?  `?${this.loadMore()}` : ''),
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )
    )
    .then(response => {
      switch (response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new SilencedError('Failed fetch chat messages.')
        );
      }
    })
    .then(data => {
      this.setState({
        ...(
          mode !== 'load-more'? {
            messagesList: data.list.reverse(),
            couldLoadMore: data.list.length < data.totalNOFRecords
          } : {
            messagesList: [
              ...data.list.reverse(),
              ...this.state.messagesList
            ],
            couldLoadMore: data.list.length + messagesList.length < data.totalNOFRecords,
          }
        )
      }, () => {
        this.getOpponentDetails();
      });
      return Promise.resolve();
    });
  }

  render() {
    const {
      opponent,
      messagesList,
      messageToSearch,
      oponentIsType,
      couldLoadMore,
      replyInput,
      isLoading,
      editMode,
    } = this.state;

    const {
      user,
      UIVersion,
    } = this.props;

    if(isLoading) {
      return (
        <Loader />
      )
    }

    return (
      <View
        isMobile={UIVersion === MOBILE_VERSION}
        editMode={editMode}
        messagesList={messagesList}
        opponent={opponent}
        user={user}
        messageToSearch={messageToSearch}
        oponentIsType={oponentIsType}
        couldLoadMore={couldLoadMore}
        replyInput={replyInput}
        onSubmitNewMessage={this.appendMessage}
        onEditMessage={this.editMessage}
        onDeleteMessage={this.deleteMessage}
        focusTextArea={el => this.focusTextArea = el}
        cancelEditMode={() => this.setState({editMode: false, replyInput: ''})}
        onLoadMore={() => this.getOpponentReplies('load-more')}
        onReplyChange={(comment) => {
          const messageValue = comment.target.value;

          this.setState({
            replyInput: messageValue,
          }, () => {
            if(messageValue.length > 0){
              this.socket.emit('client:typing');
            } else {
              this.socket.emit('client:not-typing');
            }
          })
        }}

        onKeyPressReplySubmit={(ev) => {
          if (ev.key === 'Enter') {
            this.appendMessage(ev);
          }
        }}


        onMessageToSearchChange={(e) =>
          this.setState({messageToSearch: e.target.value})
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
  };
}

export default connect(mapStateToProps)(Container);
