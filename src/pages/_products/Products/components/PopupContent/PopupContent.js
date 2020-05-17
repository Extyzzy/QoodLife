import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import slugify from 'slugify';
import s from "./PopupContent.scss";
import GalleryCarousel from '../../../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../../../components/_carousel/sideArrowsCarusel';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import {I18n} from "react-redux-i18n";
import { Link } from 'react-router-dom';
import config from '../../../../../config';

const PopupContent = ({
  data,
  data: {
    id: productId,
    gallery,
    title,
    brand,
    description,
    owner,
  },
  postedLike,
  defaultImage,
  actionButtonsList,
  activeImageIndex,
  onImageSelect,
  comments,
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
          product={defaultImage}
        />
      </div>
    </div>

    <div className={s.controls}>
      {
        !!actionButtonsList && !!actionButtonsList.length && (
          <div className={s.actionButtons}>
            { actionButtonsList }
            <span id="url_field_Products" className={s.hidden}>{config.uiUrl}/products/{productId}</span>
          </div>
        )
      }
      <Shares
        isPopup
        title={title}
        shareUrl={`/products/${slugify(title)}-${productId}`}
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

    <div className={s.details}>
      {
        brand && (
          <div className={s.brand}>
            {
              brand.logo && (
                <div className={s.logo}>
                  <img src={brand.logo} alt=''/>
                </div>
              )
            }
            {
              brand.name && (
                <div className={s.brandName}>
                  {brand.name}
                </div>
              )
            }
            {
              brand.description && (
                <div className={s.description}>
                  {brand.description}
                </div>
              )
            }
            {
              brand.location && (
                <div className={s.adress}>
                  <i className="icon-map-marker"/>
                  {brand.location.label}
                </div>
              )
            }
            {
              brand.website && (
                <div className={s.website}>
                  <i className="icon-web"/>
                  <a href={brand.website.url}>{brand.website.name}</a>
                </div>
              )
            }
            {
              brand.phoneNumber && (
                <div className={s.phoneNumber}>
                  <i className="icon-phone"/>
                  {brand.phoneNumber}
                </div>
              )
            }
            {
              brand.email && (
                <div className={s.email}>
                  <i className="icon-envelope"/>
                  {brand.email}
                </div>
              )
            }
          </div>
        )
      }

      <div
        className={s.description}
        id='links'
        dangerouslySetInnerHTML={{__html: description}}
      />
    </div>
    <Comments
      identifierId={productId}
      identifier={`products-${productId}`}
      identifierName={title}
      identifierType='products'
    />
  </div>
);

export {PopupContent as PopupContentWithoutStyles};
export default withStyles(s)(PopupContent);
