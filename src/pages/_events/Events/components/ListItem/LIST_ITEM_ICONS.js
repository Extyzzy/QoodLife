import React from "react";
import classes from "classnames";
import slugify from 'slugify';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import moment from "moment";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  MapPopup,
  ItemPopup,
} from './Popups';

const ListItem = ({
  data,
  data: {
    id: eventId,
    title,
    shortTitle,
    hobbies,
    date,
  },
  viewMode,
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  showPopupMap,
  onPopupMapClose,
  onPopupComponentWillUnmount,
  popupActionButtons,
  eventsList,
  className,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList,
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
      alt={title}
      onClick={onImageClick}
    />
  </div>
    <div className={s.dayEvent}>
      <span>{moment(date, 'X').format('ddd')}</span>
      <span className={s.day}>{moment(date, 'X').format('D')}</span>
      <span>{moment(date, 'X').format('MMM')}</span>
      <span className={s.category}>
        <HobbiesBlock hobbiesList={hobbies} maxHeight={73}/>
      </span>
    </div>
    <div className={s.details}>
      <Link className={s.name} to={`/events/${slugify(title)}-${eventId}`}>
        {shortTitle? shortTitle :title}
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
      showPopupMap && (
        <MapPopup
          data={data}
          eventsList={eventsList}
          onPopupMapClose={onPopupMapClose}
        />
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

export {ListItem as ListItemWithoutDecorators};
export default withStyles(s)(ListItem);
