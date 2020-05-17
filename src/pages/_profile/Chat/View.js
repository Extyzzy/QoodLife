import React  from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Calendar from '../../../components/Calendar';
import Popup from "../../../components/_popup/Popup/Popup";
import Layout from '../../../components/_layout/Layout';
import ChatPopup from './Components/ChatPopup';
import ChatNotifications from './Components/ChatNotifications';
import { I18n } from 'react-redux-i18n';
import s from './Chat.scss';

const View = ({
  isMobile,
  isAuthenticated,
  reqiredOpponent,
  opponentsList,
  activeOpponentId,
  popupIsOpen,
  onOpponentInputChange,
  onOpponentChange,
  onDeleteConversation,
  replaceOpponentToTop,
  removeListItemNotification,
  onClosePopup,
}) => (
  <Layout
    hasSidebar
    hasAds
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.header} />
      <Calendar />
      <div className={s.content}>
        <div className={classes(s.searchInput, {[s.mobile]: isMobile})}>
          {
            !isMobile && (
              <label>
                {I18n.t('profile.chat.searchOpponents')}
              </label>
            )
          }
          <input
            type="text"
            value={reqiredOpponent}
            onChange={onOpponentInputChange}
          />
        </div>
        <div className={s.usersList}>
          {
            !!opponentsList.length && (
              opponentsList.map((opponent, i) =>
                <div key={i} className={s.listItem}>
                  <div
                    className={s.Itemcontent}
                    onClick={() => onOpponentChange(opponent)}
                  >
                    <div className={s.details}>
                      {
                        (opponent.avatar && (
                          <img
                            className={s.avatarImage}
                            src={opponent.avatar.src}
                            alt={opponent.fullName}
                          />
                        )) || (
                          <i className={`icon-man ${s.avatarIcon}`} />
                        )
                      }
                      <div className={classes(s.name, {[s.mobile]: isMobile})}>
                        {opponent.fullName}
                        <strong>
                          {
                            opponent.unviewedMessages &&
                            `${opponent.unviewedMessages.un_viewed_sms}
                            ${I18n.t('profile.chat.newMessages')}`
                          }
                        </strong>
                      </div>
                    </div>
                    <div className={s.lastMessageContent}>
                      {opponent.lastMessage}
                    </div>
                  </div>
                  {
                    !!opponent.id && (
                      <div className={s.closer}>
                        <button
                          className="remove round-button"
                          onClick={() => onDeleteConversation(opponent.id)}
                        />
                      </div>
                    )
                  }
                </div>
              )
            )
          }
        </div>
      </div>
    </div>
    {
      popupIsOpen && (
          <Popup notShowCloser>
            <button
              onClick={onClosePopup}
              className={classes(
                ["remove round-button"],
                { [s.closeButton]: !isMobile },
                { [s.closeButtonMobile]: isMobile })}
            />
            {
              (!!activeOpponentId && (
                <ChatPopup
                  opponentId={activeOpponentId}
                  replaceOpponentToTop={replaceOpponentToTop}
                  removeListItemNotification={removeListItemNotification}
                />
              )) || (
                <ChatNotifications />
              )
            }
          </Popup>
      )
    }
  </Layout>
);

export default withStyles(s)(View);
