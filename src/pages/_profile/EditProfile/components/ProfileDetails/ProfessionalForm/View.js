import React from "react";
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../ProfileDetails.scss";

const View = ({
  switchEditMode,
  admin,
  demo,
    profDetails:{
      dateOfBirth,
      avatar,
      firstName,
      lastName,
      email,
      phoneNumber,
      status,
    },
    role,
  promotion,
  }) => (
  <div className={s.root}>
    <div className={s.options}>
      <div className={s.avatar}>
        {
          (avatar && (
            <img src={avatar.src} alt={lastName} />
          )) || (
            <i className='icon-man' />
          )
        }
      </div>
      <div className={classes(s.profileDetails, s.view)}>
        <h3 className={s.userName}>
          {firstName} {lastName}
        </h3>

        <div className={s.userPosition}>
          {
            dateOfBirth && (
              `${moment().diff(moment.unix(dateOfBirth), 'years')}
              ${I18n.t('profile.editProfile.profileDetails.years')} `
            )
          }
        </div>

        {
          email && (
            <div className={s.detaildsField}>
              <i className="icon-envelope" />
              <p>{email}</p>
            </div>
          )
        }

        {
          phoneNumber && (
            <div className={s.detaildsField}>
              <i className="icon-phone" />
              <p>{phoneNumber}</p>
            </div>
          )
        }
    </div>
    </div>
        <div className={s.editMode}>
          {
            (!!admin || !demo) && (
              <button
                key="Promotion"
                className={classes(s.activate, {
                  [s.active]: status.promotion,
                })
                }
                onClick={promotion}
              >
                {I18n.t('products.promotion')}
              </button>
            )
          }
          <button
            className="edit round-button"
            onClick={switchEditMode}
          />
        </div>
  </div>
);

export default withStyles(s)(View);
