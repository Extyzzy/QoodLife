import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ProfileDetailsMobile.scss';
import GroupsList from '../../GroupsList';

const View = ({
  switchEditMode,
  role,
  profileDetails: {
    avatar,
    fullName,
    email,
    locations,
    children,
    dateOfBirth,
    phoneNumber
  }
}) => (
  <div className={s.root}>
    <div className={s.top}>
      <h3 className={s.userName}>{fullName}</h3>
      <div className={s.userPosition}>
        {role[0].name}
        {dateOfBirth &&
          `, ${moment().diff(moment.unix(dateOfBirth), 'years')}
            ${I18n.t('profile.editProfile.profileDetails.years')} `}
      </div>
      <div className={s.avatar}>
        {(avatar && <img src={avatar.src} alt={fullName} />) || (
          <i className="icon-man" />
        )}
      </div>
    </div>

    <div className={s.profileDetails}>
      {!!locations.length && (
        <div className={s.detaildsField}>
          <i className="icon-map-marker" />
          <p>{locations[0].label}</p>
        </div>
      )}
      {phoneNumber && (
        <div className={s.detaildsField}>
          <i className="icon-phone" />
          <p>{phoneNumber}</p>
        </div>
      )}
      {email && (
        <div className={s.detaildsField}>
          <i className="icon-envelope" />
          <p>{email}</p>
        </div>
      )}

      {!!children.length && (
        <div className={s.detaildsField}>
          <i className="icon-man" />
          <p>{`${children.length} ${I18n.t(
            'profile.editProfile.profileDetails.childrens'
          )}`}</p>
        </div>
      )}
    </div>

    {(role[0].code === 'member' && (
      <GroupsList isMobile role={role[0].code} />
    ))}
    <div className={s.editMode}>
      <button className="edit round-button" onClick={switchEditMode} />
    </div>
  </div>
);

export default withStyles(s)(View);
