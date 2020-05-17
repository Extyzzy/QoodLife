import React from "react";
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import slugify from 'slugify';
import classes from "classnames";
import moment from "moment";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import HobbiesBlock from "../../../../../components/HobbiesBlock";
import NotificationsList from '../../../../../components/NotificationsList';
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
    location,
    description,
    hobbies,
    date,
    since,
    until,
    updatedAt,
    owner,
    createdAt,
    dateStart,
    days,
  },
  notification,
  postedLike,
  viewMode,
  defaultImage,
  onImageClick,
  onMapClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  showPopupMap,
  onPopupMapClose,
  showOwnerDetails,
  onNotificationView,
  onPopupComponentWillUnmount,
  popupActionButtons,
  eventsList,
  className,
  lastSeen,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList,
    }, {
      [className]: !!className,
      [s.gray]: !data.public,
    })}
  >
    <div className={s.date}>
      <div className={s.dayOfWeek}>
        {moment(dateStart, 'X').format('ddd')}
      </div>
      <div className={s.day}>
        {moment(dateStart, 'X').format('D')}
      </div>
      <div className={s.month}>
        {moment(dateStart, 'X').format('MMM')}
      </div>
      <div className={s.hobbies}>
        <HobbiesBlock hobbiesList={hobbies} isPopup={false} maxHeight={73}/>
      </div>
    </div>

    <div className={s.image}>
      <LazyLoadImage
        width="240px"
        height="160px"
        effect="blur"
        src={defaultImage.src}
        alt=""
        onClick={onImageClick}
      />
    </div>

    <div className={s.details}>
      <Link
        className={s.title}
        onClick={onNotificationView}
        to={`/events/${slugify(title)}-${eventId}`}
      >
        <h4>{title}</h4>
      </Link>

      {
        showOwnerDetails && owner && (
          <div className={s.owner}>
            <i className="icon-man-bold"/>
            <Link to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}>{owner.fullName}</Link>
          </div>
        )
      }

      <div className={s.location}>
        <i className="icon-map-marker" />

        <a href="#" onClick={onMapClick}>
          {location.label}
        </a>
      </div>
      <div className={s.schedule}>
        <i className="icon-calendar-o" />
        <span>
          {moment(since, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
          {' - '}
          {moment(until, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
        </span>
      </div>
      <div className={s.description}>
        <i className="icon-info" />
        <p id='links' dangerouslySetInnerHTML={{__html: description}} />
      </div>

      <div className={s.footer}>
        {
          notification && !!notification.length && (
            <NotificationsList
              notificationsList={notification}
              activeModule="events"
            />
          )
        }

        {
          ( window.location.href.indexOf('timeline') !== -1 && createdAt > lastSeen) &&(
            <div className={s.lastSeen}>
              {I18n.t('profile.timeline.new')}
            </div>
          )
        }

        {
          !!actionButtonsList && (
            <div className={s.delete}>
              { actionButtonsList }
            </div>
          )
        }
      </div>
    </div>

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
