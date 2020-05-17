import React  from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import moment from "moment";
import slugify from 'slugify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Event.scss';
import GalleryCarousel from '../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../components/_carousel/sideArrowsCarusel';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Layout from "../../../components/_layout/Layout/Layout";
import HobbiesBlock from "../../../components/HobbiesBlock";
import config from '../../../config';
import classes from "classnames";

const Event = ({
  data: {
   id: eventId,
   title,
   location,
   description,
   hobbies,
   gallery,
   date,
   owner,
   since,
   until,
   dateStart,
   days,
   ticketURL,
  },
  postedLike,
  showGroupsList,
  defaultImage,
  actionButtonsList,
  activeImageIndex,
  onImageSelect,
  moveDownImage,
  moveUpImage
}) => (
  <Layout
    hasAds
    hasSidebar
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.title}>
        {title}
      </div>

      <div className={s.poster}>
        <div className={s.image}>
          <SideArrowsCarousel
            activeImage={defaultImage.src}
            alt={title}
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
            <HobbiesBlock hobbiesList={hobbies} maxHeight={90}/>
          </div>
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.actionButtons}>
          {actionButtonsList}
            {
              !!ticketURL && (ticketURL.trim() !== '' && (
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
          <span id="url_field_Event" className={s.hidden}>{config.uiUrl}/events/{eventId}</span>

        </div>
        <Shares
          title={title}
          shareUrl={`/events/${slugify(title)}-${eventId}`}
        />
      </div>

      {
        !!gallery.images.length && (
          <GalleryCarousel
            gallery={gallery}
            activeImageIndex={activeImageIndex}
            onImageSelect={onImageSelect}
            overWhiteBackground
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
              <Link target="_blank"
                    to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}>
                {I18n.t('general.elements.viewProfile')}
              </Link>
            </div>
          </div>
          <div className={s.location}>
            <i className="icon-map-marker"/>
            {location.label}
          </div>
          <div className={s.schedule}>
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
    </div>
    <Comments
      identifierId={eventId}
      identifierName={title}
      identifierType='events'
      identifier={`events-${eventId}`}
    />
  </Layout>
);

export { Event as EventWithoutStyles };
export default withStyles(s)(Event);
