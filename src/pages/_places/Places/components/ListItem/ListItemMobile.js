import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItemMobile.scss";
import classes from 'classnames';
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  data: {
    id,
    name,
    shortName,
    gallery,
    location,
    webpage,
    email,
    phoneNumber,
    schedule,
    createdAt,
    updatedAt,
    owner,
    hobbies,
    favorite
  },
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  popupActionButtons,
  onPopupClose,
  onPopupComponentWillUnmount,
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
    <Link to={`/places/${id}`}>
    <div className={s.image}>
      <img src={defaultImage.src}
           alt={name}
           onClick={onImageClick}
      />
    </div>
    </Link>
    <div className={s.details}>
      <div className={s.name}>
        {shortName ? shortName : name}
      </div>
    </div>
    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }
  </div>
);

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
