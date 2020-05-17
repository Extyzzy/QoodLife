import React from "react";
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../ProfileDetailsMobile.scss";

import PostsList from "../../PostsList";
import EventsList from "../../EventsList";
import ProductsList from "../../ProductsList";
import GroupsList from "../../GroupsList";

const View = ({
  switchEditMode,
    profDetails:{
      dateOfBirth,
      avatar,
      firstName,
      lastName,
      email,
      phoneNumber,
    },
    role,
  }) => (
  <div className={s.root}>
    <div className={s.top}>
      <h3 className={s.userName}>
        {firstName} {lastName}
      </h3>
      <div className={s.userPosition}>
        {role[0].name}
        {
          dateOfBirth && (
            `, ${moment().diff(moment.unix(dateOfBirth), 'years')}
            ${I18n.t('profile.editProfile.profileDetails.years')} `
          )
        }
      </div>
      <div className={s.avatar}>
        {
          (avatar && (
            <img src={avatar.src} alt={`${firstName} ${lastName}`} />
          )) || (
            <i className='icon-man' />
          )
        }
      </div>
    </div>

    <div className={s.profileDetails}>
      {
        phoneNumber && (
          <div className={s.detaildsField}>
            <i className="icon-phone" />
            <p>{phoneNumber}</p>
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
    </div>

    <div className={s.ownedItems}>
      <PostsList isMobile role={role[0].code} />
      <EventsList isMobile role={role[0].code} />
      <ProductsList isMobile role={role[0].code} />
      <GroupsList isMobile role={role[0].code} />
    </div>

    <div className={s.editMode}>
      <button
        className="edit round-button"
        onClick={switchEditMode}
      />
    </div>
  </div>
);

export default withStyles(s)(View);
