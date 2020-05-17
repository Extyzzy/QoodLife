import React  from 'react';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import GalleryCarousel from '../../../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../../../components/_carousel/sideArrowsCarusel';
import ShowMediaLinks from '../../../../../components/ShowMediaLinks';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './PopupContent.scss';
import config from '../../../../../config';

const PopupContent = ({
  data,
  data: {
    id: professionalId,
    gallery,
    avatar,
    firstName,
    lastName,
    workingPlaces,
    socialMediaLinks,
    phoneNumber,
    email,
    followers,
  },
  defaultImage,
  actionButtonsList,
  activeImageIndex,
  onImageSelect,
  moveDownImage,
  moveUpImage,
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {firstName} {lastName}
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
    </div>

    <div className={s.controls}>
      {
        !!actionButtonsList && !!actionButtonsList.length && (
          <div className={s.actionButtons}>
            { actionButtonsList }
            <div className="followersCount">
              <i className="icon-man-bold" /> / { followers }
            </div>
            <span id="url_field_Proff" className={s.hidden}>
              {`${config.uiUrl}/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
            </span>
          </div>
        )
      }
      <Shares
        isPopup
        title={`${firstName} ${lastName}`}
        shareUrl={`/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
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
          (avatar && (
            <img src={avatar.src} alt={`${firstName}-${lastName}`} />
          )) || (
            <i className="icon-man"/>
          )
        }
        <div className={s.aside}>
          <h4>{firstName} {lastName}</h4>
          <Link
            target="_blank"
            to={`/professionals/${slugify(firstName)}-${slugify(lastName)}-${professionalId}`}
          >
            {I18n.t('general.elements.viewProfile')}
          </Link>
        </div>
      </div>
      {
        phoneNumber && (
          <div>
            <i className="icon-phone" />
            {phoneNumber}
          </div>
        )
      }
      {
        email && (
          <div>
            <i className="icon-envelope" />
            <a>{email}</a>
          </div>
        )
      }
      {
        !!socialMediaLinks.length && (
          <ShowMediaLinks linksList={socialMediaLinks} />
        )
      }
      {
        !!workingPlaces.length && (
          <div>
            {I18n.t('profile.editProfile.profileDetails.workingPlaces')}:
          </div>
        )
      }
      {
        !!workingPlaces.length && (
          workingPlaces.map((place, i) => {
            return (
              <div key={i}>
                {`${place.institution}, ${place.position}`}
              </div>
            )
          })
        )
      }
    </div>
    <Comments
      identifierId={professionalId}
      identifier={`professionals-${professionalId}`}
      identifierName={`${firstName}-${lastName}`}
      identifierType='professionals'
    />
  </div>
);

export {PopupContent as PopupContentWithoutStyles};
export default withStyles(s)(PopupContent);
