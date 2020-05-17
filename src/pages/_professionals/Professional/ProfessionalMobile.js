import React  from 'react';
import Slider from "react-slick";
import slugify from 'slugify';
import Comments from '../../../components/Comments';
import Calendar from '../../../components/Calendar';
import { I18n } from 'react-redux-i18n';
import { settingsForListitem } from '../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile';
import Shares from '../../../components/Shares';
import Layout from "../../../components/_layout/Layout/Layout";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProfessionalMobile.scss';

import PostsList from "./components/PostsList";
import EventsList from "./components/EventsList";
import ProductsList from "./components/ProductsList";
import GroupsList from "./components/GroupsList";
import PlacesList from "./components/PlacesList";

const Professional = ({
  data: {
    id: professionalId,
    avatar,
    description,
    firstName,
    lastName,
    gallery,
    workingPlaces,
    socialMediaLinks,
    phoneNumber,
    email,
  },
  actionButtonsList,
  ownerID,
  isAuthenticated,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      {
        isAuthenticated && (
          <Calendar />
        )
      }
      <div className={s.title}>
        {`${firstName} ${lastName}`}
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
                    <img src={item.src} alt={`${firstName}-${lastName}`}/>
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
          title={`${firstName} ${lastName}`}
          shareUrl={`/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
        />
      </div>
      <div className={s.details}>
        {
          email && (
            <div className={s.detaildsField}>
              <i className="icon-envelope" />
              <p>{email}</p>
            </div>
          )
        }

        {
          phoneNumber && (
            <div className={s.detaildsField}>
              <i className="icon-phone" />
              <p>{phoneNumber}</p>
            </div>
          )
        }
      </div>
    </div>
    <div className={s.ownedItems}>
      <h4>{I18n.t('general.header.events')}</h4>
        <EventsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.places')}</h4>
        <PlacesList isMobile />
      <h4>{I18n.t('general.header.groups')}</h4>
        <GroupsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.products')}</h4>
        <ProductsList ownerID={ownerID} isMobile />
      <h4>{I18n.t('general.header.posts')}</h4>
        <PostsList ownerID={ownerID} isMobile />
    </div>
    <Comments
      identifierId={professionalId}
      identifier={`professionals-${professionalId}`}
      identifierName={`${firstName}-${lastName}`}
      identifierType='professionals'
    />
  </Layout>
);

export { Professional as ProfessionalWithoutDecorators };
export default withStyles(s)(Professional);
