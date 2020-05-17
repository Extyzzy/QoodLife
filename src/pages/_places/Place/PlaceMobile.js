import React  from 'react';
import Layout from "../../../components/_layout/Layout/Layout";
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import { I18n } from 'react-redux-i18n';
import { settingsForListitem } from '../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile';
import ShowMediaLinks from '../../../components/ShowMediaLinks';
import Slider from "react-slick";
import slugify from 'slugify';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlaceMobile.scss';
import PostsList from "./components/PostsList";
import EventsList from "./components/EventsList";
import ProductsList from "./components/ProductsList";
import GroupsList from "./components/GroupsList";
import ProfessionalsList from "./components/ProfessionalsList";
import BranchesList from "./components/BranchesList";
import Calendar from "../../_profile/EditProfile/components/Calendar/Calendar";
import SidebarMobile from './components/SidebarMobile/SidebarMobileContainer';

const Place = ({
  data: {
    id: placeId,
    owner: { id: ownerID },
    name,
    email,
    phoneNumber,
    socialMediaLinks,
    createdAt,
    updatedAt,
    hobbies,
    favorite,
    calendar,
  },
  defaultBranch: {
    gallery,
    location,
    schedule,
  },
  branchesList,
  actionButtonsList,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.title}>
        {name}
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
                    <img src={item.src} alt={name}/>
                  </div>
                ))
              }
            </Slider>
          )
        }
      </div>

      <div className={s.controls}>
        {
          !!actionButtonsList && !!actionButtonsList.length && (
            <div className={s.actionButtons}>
              { actionButtonsList }
            </div>
          )
        }
        <Shares
          title={name}
          shareUrl={`/places/${slugify(name)}-${placeId}`}
        />
      </div>

      <div className={s.details}>
        <div className={s.location}>
          <i className="icon-map-marker" />
          {location.label}
        </div>
        {
          phoneNumber && (
            <div className={s.phoneNumber}>
              <i className="icon-phone" />
              {phoneNumber}
            </div>
          )
        }
        {
          email && (
            <div className={s.email}>
              <i className="icon-envelope" />
              {email}
            </div>
          )
        }
        {
          schedule && (
            <div className={s.schedule}>
              <i className="icon-calendar-o" />
              {schedule}
            </div>
          )
        }
        {
          !!socialMediaLinks.length && (
            <ShowMediaLinks linksList={socialMediaLinks} />
          )
        }

          <SidebarMobile
            calendar={calendar}
          />
      </div>
    </div>

    {
      calendar.status &&(
        <Calendar
          ownerID={ownerID}
          calendarPlace={calendar}
        />
      )
    }

    <div className={s.ownedItems}>
      <h4>{I18n.t('general.header.events')}</h4>
        <EventsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.professionals')}</h4>
        <ProfessionalsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.groups')}</h4>
        <GroupsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.products')}</h4>
        <ProductsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.posts')}</h4>
        <PostsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('agent.branches')}</h4>
        <BranchesList
          branchesList={branchesList}
          name={name}
          isMobile
        />
    </div>
    <Comments
      identifierId={placeId}
      identifier={`places-${placeId}`}
      identifierName={name}
      identifierType='places'
    />
  </Layout>
);


export { Place as PlaceWithoutDecorators };
export default withStyles(s)(Place);
