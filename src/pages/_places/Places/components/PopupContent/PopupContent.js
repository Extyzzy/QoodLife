import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import GalleryCarousel from '../../../../../components/_carousel/GalleryCarousel';
import ShowMediaLinks from '../../../../../components/ShowMediaLinks';
import SideArrowsCarousel from '../../../../../components/_carousel/sideArrowsCarusel';
import s from './PopupContent.scss';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import config from '../../../../../config';

const PopupContent = ({
  data: {
    id: placeId,
    name,
    email,
    logo,
    phoneNumber,
    createdAt,
    updatedAt,
    hobbies,
    socialMediaLinks,
    favorite,
    followers,
    gallery,
  },
  defaultBranch: {
    location,
    schedule,
  },
  branches,
  actionButtonsList,
  defaultImage,
  onImageSelect,
  activeImageIndex,
  comments,
  moveDownImage,
  moveUpImage,
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {name}
    </div>
    <div className={s.poster}>
      <div className={s.image}>
        <SideArrowsCarousel
          activeImage={defaultImage.src}
          alt={name}
          moveDown={moveDownImage}
          moveNext={moveUpImage}
          isCarousel={gallery.images.length}
        />
      </div>
    </div>

    <div className={s.controls}>
      {
        !!actionButtonsList && !!actionButtonsList.length && (
          <div className={s.actionButtons}>
            { actionButtonsList }
            <span id="url_field" className={s.hidden}>{`${config.uiUrl}/places/${slugify(name)}-${placeId}`}</span>
          </div>
        )
      }
      <Shares
        isPopup
        title={name}
        shareUrl={`/places/${slugify(name)}-${placeId}`}
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
        <div className={s.ownerDetails}>
          {
            (logo && (
              <img src={logo.src} alt={name} />
            )) || (
              <i className="icon-man"/>
            )
          }
          <div className={s.aside}>
            <h4>{name}</h4>
            <Link target="_blank" to={`/places/${slugify(name)}-${placeId}`}>
              {I18n.t('general.elements.viewProfile')}
            </Link>
          </div>
        </div>
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
        {
          branches.length > 1 && (
            <div>{I18n.t('agent.branches')}:</div>
          )
        }
        {
          branches.length > 1 && (
            branches.map((branch, i) => {
              return (
                <div key={i} className={s.branch}>
                  <i className="icon-map-marker" />
                  {branch.location.label}
                  <p>{branch.schedule}</p>
                </div>
              )
            })
          )
        }
      </div>
      <Comments
        identifierId={placeId}
        identifier={`places-${placeId}`}
        identifierName={name}
        identifierType='places'
      />
  </div>
);

export {PopupContent as PopupContentWithoutDecorators};
export default withStyles(s)(PopupContent);
