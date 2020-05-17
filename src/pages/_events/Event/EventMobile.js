import React  from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import moment from "moment";
import slugify from 'slugify';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventMobile.scss';

import Layout from "../../../components/_layout/Layout/Layout";
import HobbiesBlock from "../../../components/HobbiesBlock/HobbiesBlock";
import Shares from '../../../components/Shares';
import Comments from '../../../components/Comments';

import {
  settingsForListitem,
} from '../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile';

const Event = ({
   data: {
     id: eventId,
     title,
     location,
     description,
     hobbies,
     gallery,
     owner,
     since,
     until,
     dateStart,
   },
   postedLike,
   actionButtonsList,
 }) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.title}>
        {title}
      </div>

      <div className={s.poster}>
        {
          gallery.images && !!gallery.images.length && (
            <Slider
              className={s.slider}
              {...settingsForListitem}
            >
              {
                gallery.images.map(item => (
                    <div
                      key={`${item.key}_${item.id}`}
                    >
                      <img src={item.src} alt={title}/>
                    </div>
                  ))
                }
            </Slider>
          )
        }
        <div className={s.dayEvent}>
          <span>{moment(since, 'X').format('ddd')}</span>
          <span className={s.day}>{moment(dateStart, 'X').format('D')}</span>
          <span>{moment(since, 'X').format('MMM')}</span>
          <span className={s.category}>
        <HobbiesBlock hobbiesList={hobbies} isPopup={false} maxHeight={73}/>
      </span>
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.actionButtons}>
          {actionButtonsList}
        </div>
        <Shares
          title={title}
          shareUrl={`/events/${slugify(title)}-${eventId}`}
        />
      </div>

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
            {moment(since, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
            -
            {moment(until, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
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
        identifierName={title}
        identifierType='events'
        identifier={`events-${eventId}`}
      />
    </div>
  </Layout>
);

export { Event as EventWithoutStyles };
export default withStyles(s)(Event);
