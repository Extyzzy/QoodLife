import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  ItemPopup
} from './Popups';

const ListItem = ({
  data,
  data: {
    id: professionalId,
    firstName,
    lastName,
    avatar,
    position,
  },
  viewMode,
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  onPopupComponentWillUnmount,
  popupActionButtons,
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
    <div className={s.image}>
      <LazyLoadImage
        width="100%"
        height="100%"
        effect="blur"
        src={defaultImage.src}
        alt={firstName}
        onClick={onImageClick}
      />
    </div>

    <div className={s.details}>
      <Link
        className={s.name}
        to={`/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
      >
        {firstName} {lastName}
      </Link>
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

    {
      showPopup && (
        <ItemPopup
          data={data}
          onPopupClose={onPopupClose}
          popupActionButtons={popupActionButtons}
          onPopupComponentWillUnmount={onPopupComponentWillUnmount}
        />
      )
    }
  </div>
)

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
