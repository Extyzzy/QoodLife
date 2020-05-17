import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from "react-redux";
import moment from 'moment';
import PropTypes from 'prop-types';
import Linkify from 'react-linkify';
import classes from 'classnames';
import { confirm } from '../_popup/Confirm';
import WarningPopover from '../WarningPopover';
import CommentItemWithDecorators from './CommentItem';
import { fetchAuthorizedApiRequest } from '../../fetch';
import { appendToFormData } from '../../helpers/form';
import { fetchComments } from '../../actions/comments';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Comments.scss';
import {I18n} from 'react-redux-i18n';
import slugify from 'slugify';

import {
  UnprocessableEntity,
  InternalServerError
} from '../../exceptions/http';

class CommentItem extends Component {
  static propTypes = {
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);
    this.createdAt = moment().utcOffset(0);

    this.state = {
       repliesList: [],
       commDate: this.props.details.createdAt,
       repliesCount:
       this.props.details.nofReplies === undefined
       ? 0
       : this.props.details.nofReplies,
       replyInput: '',
       content: this.props.details.content,
       editMode: false,
       loadMoreButton: false,
       showReppliesTextArea: false,
       showRepplies: false,
       showComntrolers: false,
    };
  };

  componentWillReceiveProps(nextProps) {
      const { details, identifier } = nextProps;

      if( details.id !== this.props.details.id && details.id !== undefined ){
        fetchComments(
          identifier,
          details.id,
          {},
          {
            onSuccess: (data) => {
              this.setState({
                repliesList: data.list.reverse(),
                content: details.content,
                repliesCount: data.list.length,
              })
            }
          }
        )
      }
  };

  componentWillUnmount() {
    if (this.submitCommentDataFetcher instanceof Promise) {
      this.submitCommentDataFetcher.cancel();
    }

    if (this.updateCommentDataFetcher instanceof Promise) {
      this.updateCommentDataFetcher.cancel();
    }
  };

  loadMore() {
    const { identifier, details } = this.props;
    const skipNoOfComments = 5;

    fetchComments(
      identifier,
      details.id,
      {
        before: this.createdAt.unix(),
        take: skipNoOfComments,
        skip: this.state.repliesList.length,
      },
      {
        onSuccess: (data) => {
          this.setState({
            repliesList: [
              ...data.list.reverse(),
              ...this.state.repliesList
            ],
          })
        }
      }
    )
  }

  getFormData(mode) {
    const replyInput= this.state.replyInput;
    const { identifierId, identifier, details } = this.props;


    switch(mode){
      case 'create':
        return appendToFormData(
          new FormData(),
          {
            identifier,
            parent: details.id,
            related_module_id: identifierId,
            content: replyInput,
          },
          'comment',
        )
      default:
        let formData =  appendToFormData(
          new FormData(),
          {
            content: this.state.content,
          },
          'comment'
        );
        formData.append('_method', 'PUT');

        return formData;
    }
  };

  submitFormData(mode) {
    const { dispatch, accessToken, details } = this.props;
    const commentId = details.id;

    switch (mode) {
      case 'create':
      this.submitCommentDataFetcher = dispatch(
        fetchAuthorizedApiRequest('/v1/comments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormData('create'),
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
          const { repliesList, repliesCount } = this.state;
          this.setState({
            repliesList: repliesList.concat(data),
            repliesCount: repliesCount + 1,
          })

          return Promise.resolve();
        })
      break;
      case 'delete':
        dispatch(
          fetchAuthorizedApiRequest(
            `/v1/comments/${commentId}`,
            {
              method: 'DELETE',
              headers: {
                'Authorization': `Bearer ${accessToken}`,
              },
            }
          )
        )
        .then(response => {
          switch(response.status) {
            case 201:
              return Promise.resolve();
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
      break;
      default:
        this.updateCommentDataFetcher = dispatch(
          fetchAuthorizedApiRequest(`/v1/comments/${commentId}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: this.getFormData('edit'),
          })
        );
        this.updateCommentDataFetcher
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
            return Promise.resolve();
          })
    }
  };

  submitNewMessage() {
    const {
      isAuthenticated,
      userDetails: {confirmed: accountIsConfirmed },
      identifierType,
      identifierId,
      identifierName,
      history,
    } = this.props;

    const {
      replyInput
    } = this.state;

    if(isAuthenticated && replyInput !== ''){
      if(accountIsConfirmed){
        this.submitFormData('create');
        this.setState({
          replyInput: '',
        })
      }
    } else {
      if(replyInput !== ''){
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
      details,
      identifierId,
      identifierType,
      isAuthenticated,
      identifier,
      userDetails,
      history,
      identifierName,
      removeCommentFromList,
    } = this.props;

    const {
      showRepplies,
      repliesList,
      repliesCount,
      editMode,
      content,
      commDate,
      showComntrolers,
      showReppliesTextArea,
    } = this.state;

    const accountIsConfirmed = userDetails.confirmed;
    const createdAt = moment.unix(commDate).format(I18n.t('formats.dateTime'));
    const author = details.user;

    return (
      <div className={s.message}>
        <div className={s.head}>
          <div
            className={s.avatar}
            onClick={() =>
              history.push(`/member/${author.id}`)
            }
          >
            {
              (author.avatar && (
                <img
                  className={s.image}
                  src={author.avatar.src}
                  alt={details.firstName}
                />
              )) || (
                <i className="icon-man" />
              )
            }
          </div>
          <div className={s.autorName}>
            {author.fullName}
          </div>
        </div>
        {
          (
          editMode && (
            <div>
              <span
                className={s.cancelEdit}
                onClick={()=> {
                  this.setState({
                    editMode: false,
                    content: details.content,
                  })
                }}
              >
                {I18n.t('general.components.comments.cancel')}
              </span>
              <form
              className={classes(s.writeMessage, s.reply)}
              onSubmit={(event) => {
                event.preventDefault();
                this.submitFormData('edit');
                  this.setState({
                    editMode: false,
                  })
              }}>
                <textarea
                  className={s.inputMessage}
                  value={content}
                  onChange={(comment) => {
                    this.setState({
                      content: comment.target.value
                    })
                  }}
                  type='text'
                  maxLength="350"
                  placeholder='edit comment'
                >
                </textarea>
                <input type="submit" value="Post" className={classes(s.submitWritedMess, "btn btn-red")}/>
              </form>
            </div>
          )) || (
            <div className={s.content}>
              <Linkify properties={{target: '_blank'}}>{content}</Linkify>
              {
                userDetails.id === details.user.id && (
                  <div
                    className={s.ownerTools}
                    onMouseEnter={() => this.setState({
                      showComntrolers: true
                    })}

                    onMouseLeave={() => this.setState({
                      showComntrolers: false
                    })}
                  >
                    {
                      (showComntrolers && (
                        <div className={s.controlers}>
                          <div
                            className={classes('edit round-button', s.edit)}
                            onClick={() => {
                              this.setState({
                                editMode: true,
                                showRepplies: false,
                              })
                            }}
                          />
                          <div
                            className={classes('remove round-button', s.edit)}
                            onClick={() => {
                                confirm(I18n.t('general.components.comments.confirmDelete'), {
                                  omitOverflow: true,
                                })
                                .then(() => {
                                  this.submitFormData('delete');
                                  removeCommentFromList(details.id);
                                });
                            }}
                          />
                        </div>
                      )) || (
                        <p>...</p>
                      )
                    }
                  </div>
                )
              }

              <div className={s.createdDate}>
                {createdAt}
              </div>

              <div className={s.messageOptions}>
                {
                  this.props.lavel < 3 && (
                    <span
                      className={classes(s.repliesData, s.arrow, {
                        [s.openedReplies]: showRepplies
                      })}
                      onClick={()=> {
                        fetchComments(
                          identifier,
                          details.id,
                          {},
                          {
                            onSuccess: (data) => {
                              this.setState({
                                repliesList: data.list.reverse(),
                                showRepplies: !showRepplies,
                              })
                            }
                          }
                        )
                      }}
                    >
                      {
                        `${repliesCount} ${
                          ((!repliesCount > 1) &&
                            I18n.t('general.components.comments.replies')) ||
                            I18n.t('general.components.comments.reply')
                        }`
                      }
                    </span>
                  )
                }
                {
                  !editMode && !showReppliesTextArea &&  this.props.lavel < 3 && (
                    <span
                      className={s.repliesData}
                      onClick={()=> {
                        fetchComments(
                          identifier,
                          details.id,
                          {},
                          {
                            onSuccess: (data) => {
                              this.setState({
                                repliesList: data.list.reverse(),
                                showRepplies: true,
                                showReppliesTextArea: true,
                              })
                            }
                          }
                        )
                      }}
                    >
                      {I18n.t('general.components.comments.writeReply')}
                    </span>
                  )
                }
              </div>
            </div>
          )
        }
        {
          showRepplies && !editMode && (
            <div className={s.replies}>
              {
                repliesCount > 5 && (
                  <div
                    className={s.loadMoreButton}
                    onClick={()=> {
                      this.loadMore()
                    }}
                  >
                  {
                    I18n.t('general.components.comments.loadMore') +
                    (repliesCount - repliesList.length) +
                    I18n.t('general.components.comments.replies')
                  }
                  </div>
                )
              }
              <div className={s.list}>
              {
                (repliesCount !== 0 && repliesList !== undefined) && (
                  repliesList.map((reply, i) => {
                    return (
                      <CommentItemWithDecorators
                        key={i}
                        lavel={this.props.lavel+1}
                        details={reply}
                        identifierType={identifierType}
                        identifier={identifier}
                        identifierName={identifierName}
                        identifierId={identifierId}
                        removeCommentFromList={(commId) => {
                          const indexToRemove = (repliesList.findIndex(x => x.id === commId));

                          this.setState({
                            repliesList: [
                              ...repliesList.slice(0,indexToRemove),
                              ...repliesList.slice(indexToRemove + 1)
                            ],
                            repliesCount: repliesCount - 1,
                          });
                        }}
                      />
                    )
                  })
                )
              }
              </div>
                {
                  showReppliesTextArea && (
                    <div
                      className={classes(s.repliesDisplayButton, s.cancel)}
                      onClick={() => {
                        this.setState({
                          showReppliesTextArea: false,
                        })
                      }}
                    >
                      {I18n.t('general.components.comments.cancel')}
                    </div>
                  )
                }
                {
                  showReppliesTextArea && (
                    <form
                      className={classes(s.writeMessage, s.reply)}
                      onSubmit={(event) => {
                        this.submitNewMessage();
                        event.preventDefault();
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
                          className={s.inputMessage}
                          value={this.state.replyInput}
                          onChange={(comment) => {
                            this.setState({
                              replyInput: comment.target.value,
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
                            I18n.t('general.components.comments.writeReply')
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
                              value={I18n.t('general.components.comments.postButton')}
                              className={classes(s.submitWritedMess, "btn btn-red")}/>
                          )
                        }

                    </form>
                  )
                }
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    isAuthenticated: store.auth.isAuthenticated,
    userDetails: store.user,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(CommentItem)));
