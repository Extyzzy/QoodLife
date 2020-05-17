import React from "react";
import classes from "classnames";
import s from "./ListItemMobile.scss";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  data: {
    id,
    firstName,
    lastName,
    position,
  },
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  onPopupComponentWillUnmount,
  popupActionButtons,
  className,
  beforeFormDialogRender,
  beforeFormDialogClose,
  onFormDataChange,
}) => (
  <div
    className={classes(s.root, {
      [s.hasActionButtons]: !!actionButtonsList && !!actionButtonsList.length,
    }, {
      [className]: !!className,
    })}
  >
    <Link to={`/professionals/${id}`}>
    <div className={s.image}>
      <img
        src={defaultImage.src}
        alt=""
        onClick={onImageClick}
      />
    </div>

    </Link>
    <div className={s.details}>
      <div className={s.name}>
        {firstName} {lastName}
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

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
