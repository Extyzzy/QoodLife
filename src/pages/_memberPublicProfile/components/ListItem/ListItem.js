import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";

const ListItem = ({
  viewMode,
  data: {
    fullName,
    logo
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
        (logo && (
          <img
            src={logo.src}
            alt={fullName}
            onClick={redirectToUserProfile}
          />
        )) || (
          <i className="icon-man" onClick={redirectToUserProfile} />
        )
      }
    </div>

    <div className={s.details}>
      <div className={s.name}>
        {fullName}
      </div>
    </div>

    <div className={s.details}>
      <div className={s.footer}>
        {
          !!actionButtonsList && !!actionButtonsList.length && (
            <div className={s.actionButtons}>
              { actionButtonsList }
            </div>
          )
        }
      </div>
    </div>
  </div>
);

export {ListItem as ListItemWithoutDecorators};
export default withStyles(s)(ListItem);
