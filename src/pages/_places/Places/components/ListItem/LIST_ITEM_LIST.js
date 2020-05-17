import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  ItemPopup,
} from './Popups';

const LIST_ITEM_LIST = ({
  data,
  data: {
    id: placeId,
    name,
    gallery,
    branches,
    logo,
    description,
    socialMediaLinks,
    phoneNumber,
    createdAt,
    updatedAt,
    owner,
    schedule,
    hobbies,
    favorite
  },
  viewMode,
  defaultImage,
  onImageClick,
  defaultBranch,
  actionButtonsList,
  showPopup,
  onPopupClose,
  onPopupComponentWillUnmount,
  popupActionButtons,
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
      <LazyLoadImage
        width="240px"
        height="160px"
        effect="blur"
        src={defaultImage.src}
        alt={name}
        onClick={onImageClick}
      />
    </div>

    <div className={s.details}>
      <Link className={s.title} to={`/places/${slugify(name)}-${placeId}`}>
        <h4>{name}</h4>
      </Link>

      <div className={s.location}>
        <i className="icon-map-marker" />
          {defaultBranch.location.label }
      </div>

      <div className={s.phone}>
        <i className="icon-phone" />
        {phoneNumber}
      </div>

      <div className={s.description}>
        <i className="icon-info" />
        <p>{description}</p>
      </div>

      <div className={s.footer}>
        {
          !!actionButtonsList && (
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
);

export {LIST_ITEM_LIST as LIST_ITEM_LIST_WITHOUT_STYLES};
export default withStyles(s)(LIST_ITEM_LIST);
