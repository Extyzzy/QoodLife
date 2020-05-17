import React from "react";
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../ProfileDetails.scss";

const View = ({
  switchEditMode,
  role,
  admin,
  demo,
  profileDetails: {
    avatar,
    fullName,
    email,
    locations,
    children,
    dateOfBirth,
    phoneNumber,
    confirmed,
  },
}) => (
  <div className={s.root}>
    <div className={s.options}>
      <div className={s.avatar}>
        {
          (avatar && (
            <img src={avatar.src} alt={fullName} />
          )) || (
            <i className='icon-man' />
          )
        }
      </div>
      <div className={classes(s.profileDetails, s.view)}>
        <h3 className={s.userName}>
          {fullName}
        </h3>

        {
          !!locations.length && (
            <div className={s.detaildsField}>
              <i className="icon-map-marker" />
              <p>{locations[0].label}</p>
            </div>
          )
        }

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

        {
          !!children.length && (
            <div className={s.detaildsField}>
              <i className="icon-man-bold" />
              <p>{`${children.length} ${I18n.t('profile.editProfile.profileDetails.childrens')}`}</p>
            </div>
          )
        }

      </div>
    </div>

    {
      !admin && (
        <span className={s.soon}>
          {
            demo &&(
               I18n.t('profile.editProfile.soon')
            )
          }
        </span>
      )
    }

    {
      (!!admin || !demo) &&(
        <div className={s.editMode}>
          <button
            className="edit round-button"
            onClick={switchEditMode}
          />
        </div>
      )
    }

  </div>
);

export default withStyles(s)(View);
