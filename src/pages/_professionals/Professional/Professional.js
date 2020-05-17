import React  from 'react';
import Tabs from '../../../components/Tabs/Tabs';
import ProfileImages from '../../../components/ProfileImages';
import Layout from "../../../components/_layout/Layout/Layout";
import Shares from '../../../components/Shares';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './Professional.scss';
import {I18n} from "react-redux-i18n";
import {Helmet} from "react-helmet";
import classes from "classnames";
import config from '../../../config';
import { Alert } from "react-bootstrap";

const Professional = ({
  titles,
  data: {
    id: professionalId,
    avatar,
    description,
    firstName,
    lastName,
    gallery,
    studies,
    workingPlaces,
    socialMediaLinks,
    schedule,
    phoneNumber,
    email,
    hobbies,
  },
  onShowMore,
  showMore,
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
  errors,
}) => (
  <Layout
    hasSidebar
    hasAds
    contentHasBackground
    placeOrProfHobbies={hobbies}
  >
    <Helmet>
      <meta charSet="utf-8" />
      <title>qood.life - {`${firstName} ${lastName}`}</title>
      <meta property="og:title" content="qood.life - Traieste-ti viata cu pasiune !" />
      <meta property="og:description" content={`${description}`} />
      <meta property="og:image" content={`${(avatar && avatar) || "https://api.qood.life/storage/public/images/2rQ7bxcmgJhnWytKz90G6RyalWDsNXO4CRPjJipA.png?_=1542132559"}`} />
      <meta property="og:url" content={`${config.uiUrl}/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="og:site_name" content="Moldovean social-media hobby platform" />
      <meta name="twitter:image:alt" content="QoodLife overview" />
    </Helmet>
    <div className={s.root}>
      <div className={s.profileDetails}>
        <div className={s.avatar}>
          {
            (avatar && (
              <img src={avatar.src} alt={`${firstName}-${lastName}`} />
            )) || (
              <i className='icon-man' />
            )
          }
        </div>
        <div className={s.details}>
          <h3 className={s.userName}>
            {`${firstName} ${lastName}`}
          </h3>

          {
            titles && titles[0] &&(
              <div className={s.userPosition}>
                {titles.map(name => name).join(', ') }
              </div>
            )
          }

          <div className={s.aside}>
              {
                email && (
                  <div className={s.detaildsField}>
                    <i className="icon-envelope" />
                    <p>{email}</p>
                  </div>
                )
              }

              {
                studies && (
                  <div>
                    <p className={s.bold}>{I18n.t('professionals.study')}:</p>
                    {
                      studies.map(data => {

                      return (
                      <div className={s.detaildsField}>
                      <p>{data.institution}</p>
                      </div>
                      )
                    })
                    }
                  </div>
                )
              }

            {
              workingPlaces && (
                <div>
                  <p className={s.bold}>{I18n.t('professionals.workingPlaces')}:</p>
                  {
                    workingPlaces.map(data => {

                      return (
                        <div className={s.detaildsField}>
                          <p><span className={s.bold}>{I18n.t('professionals.institution')}</span> {data.institution}</p>
                          <p><span className={s.bold}>{I18n.t('professionals.position')}:</span> {data.position}</p>
                          <div>
                          <i className="icon-map-marker" />
                          <p>{data.location.label}</p>
                          </div>
                        </div>
                      )
                    })
                  }
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
      </div>

      <div className={s.controls}>
        <div className={s.actionButtons}>
          {actionButtonsList}
        </div>
        <Shares
          title={`${firstName} ${lastName}`}
          shareUrl={`/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
        />
      </div>
      <span id="url_field_Prof" className={s.hidden}>{`${config.uiUrl}/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}</span>
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
        <button className={classes(s.extind, 'icon-angle-down', {
          [s.rotate]: showMore
        })} onClick={onShowMore}>
          {
            (showMore &&(
              I18n.t('general.elements.showLess')
            )) || (
              I18n.t('general.elements.showMore'))
          }
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

export { Professional as ProfessionalWithoutDecorators };
export default withStyles(s)(Professional);
