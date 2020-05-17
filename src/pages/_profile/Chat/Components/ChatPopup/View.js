import React from 'react';
import moment from 'moment';
import classes from 'classnames';
import Linkify from 'react-linkify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import s from './Popup.scss';

const View = ({
  isMobile,
  editMode,
  user,
  opponent,
  messagesList,
  messageToSearch,
  replyInput,
  onReplyChange,
  onEditMessage,
  onDeleteMessage,
  onMessageToSearchChange,
  onKeyPressReplySubmit,
  onLoadMore,
  onSubmitNewMessage,
  cancelEditMode,
  focusTextArea,
  oponentIsType,
  couldLoadMore
}) => (
  <div className={classes(s.root, 'fitimgBg')}>
    <div
      className={classes({
        [s.searchInput]: !isMobile,
        [s.searchInputMobile]: isMobile
      })}
    >
      {isMobile && (
        <h4>
          {I18n.t('profile.chat.messagesWith')} {opponent.shortName}
        </h4>
      )}
      <label>{I18n.t('profile.chat.searchMessages')}</label>
      <input
        type="text"
        value={messageToSearch}
        onChange={onMessageToSearchChange}
      />
    </div>
    <div className={classes(s.messagesList, { [s.mobile]: isMobile })}>
      {couldLoadMore && (
        <button className={s.loadMoreButton} onClick={onLoadMore}>
          load more
        </button>
      )}
      {(!!messagesList.length &&
        messagesList.map((message, i) => {
          const createdAt = moment
            .unix(message.created_at)
            .format(I18n.t('formats.dateTime'));
          const selfMessage = user.id === message.owner.id;

          return (
            <div className={s.listitem} key={i}>
              <div className={s.autor}>
                <Link to={`/member/${message.owner.id}`}>
                  {(message.owner.avatar && (
                    <img
                      src={message.owner.avatar.src}
                      alt={message.owner.shortName}
                    />
                  )) || <i className={`icon-man ${s.avatarIcon}`} />}
                </Link>
                <div className={s.autorName}>{message.owner.shortName}</div>
              </div>
              <div className={classes(s.content, { [s.self]: selfMessage })}>
                <Linkify properties={{ target: '_blank' }}>
                  {message.content}
                </Linkify>
                {!isMobile && (
                  <div className={s.footer}>
                    <p className={s.createdAt}>{createdAt}</p>
                    {selfMessage && !editMode && (
                      <div className={s.controls}>
                        <button
                          className="edit round-button"
                          onClick={() => onEditMessage(message)}
                        />
                        <button
                          className="remove round-button"
                          onClick={() => onDeleteMessage(message.id)}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })) || (
        <div className={s.startConversationHint}>
          {`${I18n.t('profile.chat.sayHello')} ${opponent.shortName}!`}
        </div>
      )}
      {oponentIsType && (
        <span className={s.typingWarning}>
          {`${opponent.shortName || 'opponent is'} type...`}
        </span>
      )}
      <div className={s.updateButton}>
        {editMode && (
          <span onClick={cancelEditMode}>{I18n.t('profile.chat.cancel')}</span>
        )}
      </div>
    </div>
    <form className={s.writeMessage} onSubmit={onSubmitNewMessage}>
      <div className={s.top}>
        <div className={s.userImage}>
          {(user.avatar && (
            <img src={user.avatar.src} alt={user.shortName} />
          )) || <i className={`icon-man ${s.avatarIcon}`} />}
        </div>
        <textarea
          ref={focusTextArea}
          className={s.inputMessage}
          value={replyInput}
          onChange={onReplyChange}
          onKeyPress={onKeyPressReplySubmit}
          type="text"
          maxLength="350"
          placeholder={I18n.t('profile.chat.replyPlaceholder')}
        />
      </div>
      <button
        type="submit"
        className={classes(s.submitWritedMess, 'btn btn-red')}
      >
        {editMode ? I18n.t('profile.chat.edit') : I18n.t('profile.chat.submit')}
      </button>
    </form>
  </div>
);

export default withStyles(s)(View);
