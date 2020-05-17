import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import classes from 'classnames';
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  ItemPopup,
} from './Popups';

const ListItem = ({
  data,
  data: {
    id: placeId,
    name,
    shortName,
    logo,
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
  viewMode,
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
    className={classes(s.root, s[viewMode],{
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
        alt={name}
        onClick={onImageClick}
      />
    </div>
    <div className={s.details}>
      <Link className={s.name} to={`/places/${slugify(name)}-${placeId}`}>
        {shortName ? shortName :name}
      </Link>
    </div>
    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }

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
);

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
