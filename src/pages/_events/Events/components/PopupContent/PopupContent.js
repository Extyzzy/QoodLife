import React  from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import moment from "moment";
import slugify from 'slugify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GalleryCarousel from '../../../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../../../components/_carousel/sideArrowsCarusel';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import s from './PopupContent.scss';
import config from '../../../../../config';
import classes from 'classnames';

const PopupContent = ({
  data,
  data: {
    id: eventId,
    gallery,
    title,
    description,
    owner,
    location,
    hobbies,
    going,
    date,
    since,
    until,
    dateStart,
    days,
    ticketURL,
  },
  postedLike,
  defaultImage,
  activeImageIndex,
  showGroupsList,
  actionButtonsList,
  openGroupsList,
  onImageSelect,
  moveDownImage,
  moveUpImage,
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {title}
    </div>

    <div className={s.poster}>
      <div className={s.image}>
        <SideArrowsCarousel
          activeImage={defaultImage.src}
          alt={''}
          moveDown={moveDownImage}
          moveNext={moveUpImage}
          isCarousel={gallery.images.length}
        />
      </div>

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
          <HobbiesBlock hobbiesList={hobbies} isPopup={true} maxHeight={80}/>
        </div>
      </div>
    </div>

    <div className={s.controls}>
      <div className={s.actionButtons}>
        {
          !!actionButtonsList && !!actionButtonsList.length && (actionButtonsList)
        }
        <button
          key="WriteMessage"
          className="btn btn-red"
          onClick={openGroupsList}
        >
          {I18n.t('events.findAGroupButton')}
        </button>

        {
          !!ticketURL && (ticketURL.trim() !== '' &&(
            <a
              key="ticketURL"
              className={classes("btn", s.ticketURL)}
              href={ticketURL}
              target='_blank'
            >
              {I18n.t('events.ticketURL')}
            </a>
          ))
        }

        <span id="url_field_Events" className={s.hidden}>{config.uiUrl}/events/{eventId}</span>

      </div>

      <Shares
        isPopup
        title={title}
        shareUrl={`/events/${slugify(title)}-${eventId}`}
      />
    </div>

    {
      gallery.images.length > 1 && (
        <GalleryCarousel
          gallery={gallery}
          activeImageIndex={activeImageIndex}
          onImageSelect={onImageSelect}
        />
      )
    }

    <div className={s.details}>
      <div className={s.contacts}>
        <div className={s.ownerDetails}>
          {
            (owner.avatar && (
              <img src={owner.avatar.src} alt={owner.fullName} />
            )) || (
              <i className="icon-man"/>
            )
          }
          <div className={s.aside}>
            <h4>{owner.fullName}</h4>
            <Link
              target="_blank"
              to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}
            >
              {I18n.t('general.elements.viewProfile')}
            </Link>
          </div>
        </div>
        <div>
          <i className="icon-map-marker"/>
          {location.label}
        </div>
        <div>
          <i className="icon-calendar-o"/>
          {
            (days.length &&(
              <span>
                {moment(dateStart, 'X').format('ddd, D MMMM')},
                {moment.unix(since).format('HH:mm')}
                {' - '}
                {moment(dateStart, 'X').format('ddd, D MMMM')},
                {moment.unix(until).format('HH:mm')}
              </span>
            )) || (
              <span>
                {moment(since, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
                {' - '}
                {moment(until, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
              </span>
            )
          }
        </div>
      </div>
      <div
        id='links'
        className={s.description}
        dangerouslySetInnerHTML={{__html: description}}
      />
    </div>
    <Comments
      identifierId={eventId}
      identifier={`events-${eventId}`}
      identifierName={title}
      identifierType='events'
    />
  </div>
);

export {PopupContent as PopupContentWithoutDecorators};
export default withStyles(s)(PopupContent);
