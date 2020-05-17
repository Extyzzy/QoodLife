import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import {I18n} from "react-redux-i18n";

const ListItem = ({
  viewMode,
  data: {
    fullName,
    avatar,
    phoneNumber,
    children,
    locations,
  },
  onPopupComponentWillUnmount,
  showOwnerDetails,
  redirectToUserProfile,
  actionButtonsList,
  className,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList && !!actionButtonsList.length,
    }, {
      [className]: !!className,
    })}
  >
    <div className={s.image}>
      {
        (avatar && (
          <img
            src={avatar.src}
            alt={fullName}
            onClick={redirectToUserProfile}
          />
        )) || (
          <i className="icon-man" onClick={redirectToUserProfile} />
        )
      }
    </div>

    <div className={s.profileDetails}>
      <h3 className={s.userName}>
        {fullName}
      </h3>
      <div className={s.userPosition}>
        {I18n.t('general.header.member')}

      </div>

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
);

export {ListItem as ListItemWithoutDecorators};
export default withStyles(s)(ListItem);
