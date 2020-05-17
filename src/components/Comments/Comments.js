import React, { Component } from 'react';
import PropTypes from 'prop-types';
import slugify from 'slugify';
import moment from 'moment';
import classes from 'classnames';
import config from '../../config';
import WarningPopover from '../WarningPopover';
import CommentItem from './CommentItem';
import { withRouter } from 'react-router';
import { connect } from "react-redux";
import { MOBILE_VERSION } from '../../actions/app';
import { appendToFormData } from '../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../fetch';
import { I18n } from 'react-redux-i18n';
import { fetchComments } from '../../actions/comments';
import { UnprocessableEntity, InternalServerError } from '../../exceptions/http';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import io from 'socket.io-client';
import s from './Comments.scss';

class Comments extends Component {
  static propTypes = {
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.createdAt = moment().utcOffset(0);

    this.state = {
      someoneIsTyping: false,
      showComments: true,
      enteredComment: '',
      commentList: [],
      commentsCount: 0,
      loadMoreButton: false,
    };


    this.socket = io(config.socketsApi, {

      query: `roomId=${this.props.identifier}`
    }).connect();

    this.socket.on(`server:new-comment`, comment => {
      this.appendCommentFromSocket(comment);
    });

    this.socket.on('server:comment-typing', () => {
      this.onType(true);
    });

    this.socket.on('server:comment-not-typing', () => {
      this.onType(false);
    });
  };

  componentDidMount() {
    const identifier = this.props.identifier;

    fetchComments(
      identifier,
      null,
      {},
      {
        onSuccess: (data) => {
          this.setState({
            commentList: data.list.reverse(),
            commentsCount: data.totalNOFComments,
          })
        }
      }
    )
  }

  componentWillUnmount() {
    if (this.submitCommentDataFetcher instanceof Promise) {
      this.submitCommentDataFetcher.cancel();
    }

    this.socket.disconnect();
  }

  appendCommentFromSocket(comment) {
    this.setState({
      commentsCount: this.state.commentsCount + 1,
      commentList: this.state.commentList.concat(comment),
    })
  }

  onType(mode){
    this.setState({someoneIsTyping: mode});
  }

  getUIVersion() {
    const { UIVersion } = this.props;

    if(UIVersion === MOBILE_VERSION){
      return true
    }

    return false;
  }

  loadMore() {
    const identifier = this.props.identifier;
    const skipNoOfComments = 5;

      fetchComments(
        identifier,
        null,
        {
          before: this.createdAt.unix(),
          take: skipNoOfComments,
          skip: this.state.commentList.length,
        },
        {
          onSuccess: (data) => {

            this.setState({
              commentList: [
                ...data.list.reverse(),
                ...this.state.commentList
              ]
            })
          }
        }
      )
  }

  getFormData() {
    const { enteredComment } = this.state;
    const { identifier } = this.props;

    return appendToFormData(
      new FormData(),
      {
        identifier,
        content: enteredComment,
        related_module_id: this.props.identifierId
      },
      'comment',
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    this.submitCommentDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/comments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormData(),
      })
    );

    this.submitCommentDataFetcher
      .then(response => {
        switch(response.status) {
          case 201:
            return response.json();
          case 422:
            return response.json().then(({errors}) => {
              return Promise.reject(
                new UnprocessableEntity()
              );
            });
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(data => {
        this.setState({
          commentList: this.state.commentList.concat(data),
          commentsCount: this.state.commentsCount + 1,
        }, () => this.socket.emit('client:new-comment', data))
      })
      .then(() => {
        return Promise.resolve();
      })
  }

  submitNewMessage() {
    const {
      identifierId,
      identifierType,
      isAuthenticated,
      history,
      identifierName,
      userDetails: { confirmed: accountIsConfirmed },
    } = this.props;

    const {
      enteredComment,
    } = this.state;

    if(isAuthenticated && enteredComment !== ''){
      if(accountIsConfirmed){
        this.submitFormData();
        this.setState({
          enteredComment: '',
        })
      }
    } else {
      if(enteredComment !== ''){
        const redirectIdentifier =
          identifierType !== 'posts'
          ? identifierType
          : 'blog/post'

        history.push('/login', {from: `${redirectIdentifier}/${slugify(identifierName)}-${identifierId}`});
      }
    }
  }

  render() {
    const {
      identifierId,
      identifierType,
      isAuthenticated,
      identifier,
      userDetails: { confirmed: accountIsConfirmed },
      userDetails,
      identifierName,
    } = this.props;

    const {
      someoneIsTyping,
      showComments,
      commentList,
      commentsCount,
      enteredComment,
    } = this.state;

    return (
      <div className={classes(s.root, "fitimgBg")}>
        <div className={s.toggleComments}>
          <h4>
            {
              ((commentsCount !== 0) && (
                ((commentsCount > 1) && (
                  (commentsCount) +
                  I18n.t('general.components.comments.commentTextMultiple')
                )) || (
                  (commentsCount) +
                  I18n.t('general.components.comments.commentText')
                )
              )) || (I18n.t('general.components.comments.noComments'))
            }
          </h4>
          <a
            className={classes({
              [s.mobile]: this.getUIVersion()
            })}
            onClick={() => this.focusTextArea.focus()}
          >
            {(I18n.t('general.components.comments.writeComment'))}
          </a>
        </div>
        {
          showComments && (
            <div className={s.content}>
              {
                commentsCount > 5 &&
                commentsCount - commentList.length !== 0 &&(
                  <div
                    className={s.loadMoreButton}
                    onClick={()=> {
                      this.loadMore()
                    }}
                  >
                    {
                      I18n.t('general.components.comments.loadMore') +
                      (commentsCount - commentList.length) +
                      I18n.t('general.components.comments.commentTextMultiple')
                    }
                  </div>
                )
              }
              <div className={s.commentList}>
                  {
                    commentList.map((details, i) => {
                      return (
                        <CommentItem
                          key={i}
                          lavel={0}
                          details={details}
                          identifierId={identifierId}
                          identifierType={identifierType}
                          identifier={identifier}
                          identifierName={identifierName}
                          removeCommentFromList={(commId) => {
                            const indexToRemove = (
                              commentList.findIndex(x => x.id === commId)
                            );

                            this.setState({
                              commentList: [
                                ...commentList.slice(0, indexToRemove),
                                ...commentList.slice(indexToRemove + 1)
                              ],
                              commentsCount: commentsCount - 1,
                            });
                          }}
                        />
                      )
                    })
                  }

                  {
                    someoneIsTyping && (
                      <span>some is typing...</span>
                    )
                  }
              </div>
              <form
              className={s.writeMessage}
              onSubmit={(event) => {
                event.preventDefault();
                this.submitNewMessage();
              }}>
                <div className={s.autorDetailsAndTextArea}>
                  <div
                    className={s.avatar}
                    onClick={() =>
                      this.props.history.push(`/member/${userDetails.id}`)
                    }
                  >
                    {
                      (userDetails.avatar && (
                        <img
                          className={s.image}
                          src={userDetails.avatar.src}
                          alt={userDetails.firstName}
                        />
                      )) || (
                        <i className="icon-man" />
                      )
                    }
                  </div>
                  <textarea
                    ref={(input) => { this.focusTextArea = input; }}
                    className={s.inputMessage}
                    value={enteredComment}
                    onChange={(e) => {
                      const comment = e.target.value;

                      this.setState({
                        enteredComment: comment
                      }, () => {
                        if(comment.length > 0){
                          this.socket.emit('client:comment-typing');
                        } else {
                          this.socket.emit('client:comment-not-typing');
                        }
                      })
                    }}
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        this.submitNewMessage();
                        ev.preventDefault();
                      }
                    }}
                    type='text'
                    maxLength="350"
                    placeholder={
                      I18n.t('general.components.comments.writeComment')
                    }
                  >
                  </textarea>
                </div>
                {
                  (isAuthenticated && !accountIsConfirmed && (
                    <WarningPopover>
                      <button className={classes(s.submitWritedMess, "btn btn-red")}>
                        {
                          I18n.t('general.components.comments.postButton')
                        }
                      </button>
                    </WarningPopover>
                  )) || (
                    <input
                      type="submit"
                      value={
                        I18n.t('general.components.comments.postButton')
                      }
                      className={classes(s.submitWritedMess, "btn btn-red")}
                    />
                  )
                }
              </form>
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
    userDetails: store.user,
    UIVersion: store.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Comments)));
