import React from 'react';
import { I18n } from 'react-redux-i18n';
import Tabs from '../../../components/Tabs/Tabs';
import ProfileImages from '../../../components/ProfileImages';
import Shares from '../../../components/Shares';
import ShowMediaLinks from '../../../components/ShowMediaLinks';
import Layout from "../../../components/_layout/Layout/Layout";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './Place.scss';
import classes from "classnames";
import config from '../../../config';
import { Alert } from "react-bootstrap";
import { withRouter } from 'react-router';

const Place = ({
  titles,
  data,
  user,
  errors,
  redirectToClaim,
  placesRecommend,
  data: {
    id: placeId,
    logo,
    name,
    email,
    phoneNumber,
    socialMediaLinks,
    createdAt,
    updatedAt,
    hobbies,
    favorite,
    description,
    gallery,
    excelUploaded,
  },
  defaultBranch: {
   location,
   schedule,
  },
  showMore,
  onShowMore,
  defaultImage,
  actionButtonsList,
  activeImageIndex,
  onImageSelect,
  moveDownImage,
  moveUpImage,
  isAuthenticated,
  tabOptions,
  activeTabItemIndex,
  onActiveTabChange,
}) => (
  <Layout
    hasSidebar
    hasAds
    contentHasBackground
    placeOrProfHobbies={hobbies}
  >
    <div className={s.root}>

      <div className={s.profileDetails}>
        <div className={s.avatar}>
          {
            (logo && (
              <img src={logo.src} alt={name} />
            )) || (
              <i className='icon-map-marker' />
            )
          }
        </div>
        <div className={s.details}>
          <h3 className={s.userName}>
            {name}
          </h3>

          <div className={s.userPosition}>
            {titles.map(name => name).join(', ') }
          </div>
          <div className={s.aside}>
            <div className={s.detaildsField}>
              <i className="icon-map-marker" />
              {location.label}
            </div>
            {
              phoneNumber && (
                <div className={s.detaildsField}>
                  <i className="icon-phone" />
                  {phoneNumber}
                </div>
              )
            }
            {
              email && (
                <div className={s.detaildsField}>
                  <i className="icon-envelope" />
                  {email}
                </div>
              )
            }
            {
              schedule && (
                <div className={s.detaildsField}>
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
            {
              excelUploaded && ! user.placeDetails &&(
                <div className={s.detaildsField} style={{display: 'flex'}}>
                  <i className="icon-info" />
                   <a onClick={redirectToClaim}>{I18n.t('agent.claimAccount')}</a>
                </div>
              )
            }
          </div>
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.actionButtons}>
          {actionButtonsList}
           </div>
        <Shares
          title={name}
          shareUrl={`/places/${slugify(name)}-${placeId}`}
        />
      </div>

      <span id="url_field_Place" className={s.hidden}>{`${config.uiUrl}/places/${slugify(name)}-${placeId}`}</span>
      <ProfileImages gallery={gallery} />

      {
        errors && (
          <Alert className="alert-sm" bsStyle="danger">
            {errors}
          </Alert>
        )
      }

      {
        showMore &&(
          <p className={s.description}>{description}</p>
        )
      }

      <div className={s.buttonExtind}>
        <button className={s.extind} onClick={onShowMore}>
        {
          (showMore &&(
            I18n.t('general.elements.showLess')
          )) || (
            I18n.t('general.elements.showMore'))
        }
          &nbsp;
        <i className={classes('icon-angle-down', {
          [s.rotate]: showMore
        })}
           onClick={onShowMore}
         />
      </button>
      </div>

      <Tabs
        items={tabOptions}
        activeItemIndex={activeTabItemIndex}
        onChange={onActiveTabChange}
      />

    </div>
  </Layout>
);

export { Place as PlaceWithoutDecorators };
export default withRouter(withStyles(s)(Place));
