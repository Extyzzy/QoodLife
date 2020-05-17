import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItemMobile.scss";
import {Link} from "react-router-dom";

const LIST_ITEM_ICONS = ({
  data,
  data: {
    id,
    title,
    shortTitle,
    description,
    brand,
    updatedAt,
    owner,
  },
  viewMode,
  defaultImage,
  onImageClick,
  actionButtonsList,
  showEditPopup,
  onEditPopupClose,
  onEditPopupSuccess,
  className,
  beforeFormDialogRender,
  beforeFormDialogClose,
  onFormDataChange,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList && !!actionButtonsList.length,
    }, {
      [className]: !!className,
    })}
  >
    <Link to={`/products/${id}`}>
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
        {shortTitle? shortTitle :title}
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

export {LIST_ITEM_ICONS as LIST_ITEM_ICONS_WITHOUT_STYLES};
export default withStyles(s)(LIST_ITEM_ICONS);
