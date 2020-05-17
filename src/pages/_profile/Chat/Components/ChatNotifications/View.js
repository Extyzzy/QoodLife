import React from 'react';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ChatPopup/Popup.scss';

const View = ({
  user,
  notificationsList,
  profActionButtons,
  placeActionButtons,
}) => (
  <div className={s.root}>
    <div className={s.messagesList}>
    {
      !!notificationsList.length && (
        notificationsList.map((message, i) => {
          return (
            <div className={s.listitem} key={i}>
              <div className={s.autor}>
                <i className={`icon-man ${s.avatarIcon}`} />
                <div className={s.autorName}>System</div>
              </div>
              <div className={s.content}>
                {(() => {
                  switch (message.module) {
                    case 'places':
                      return (
                        <p>
                          {I18n.t('profile.chat.thePlace')}
                          <Link to={`/places/${message.id}`}>
                            {message.name}
                          </Link>
                          {I18n.t('profile.chat.wantToInviteInOurTeam')}
                        </p>
                      );
                    case 'pros':
                      return (
                        <p>
                          {I18n.t('profile.chat.theProfessional')}
                          <Link to={`/professionals/${message.id}`}>
                            {message.fullName}
                          </Link>
                          {I18n.t('profile.chat.wantToBeTeamMember')}
                        </p>
                      );
                    default:
                    return (
                      <p>
                        user
                        <Link to={`/member/${message.id}`}>
                          {message.fullName}
                        </Link>
                        was invited with you to be pros
                      </p>
                    )
                  }
                })()}
                <div className={s.footer}>
                  <div className={s.controls}>
                    {
                      (message.module === 'pros' &&
                      profActionButtons(message.id)) || (
                        message.module === 'places' &&
                         placeActionButtons(message.id)
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )
    }
    </div>
  </div>
)

export default withStyles(s)(View);
