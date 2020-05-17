import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './Product.scss';
import Layout from '../../../components/_layout/Layout/Layout';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import GalleryCarousel from '../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../components/_carousel/sideArrowsCarusel';
import {I18n} from "react-redux-i18n";
import config from '../../../config';
import { Link } from 'react-router-dom';

const Product = ({
  data: {
    id: productId,
    title,
    brand,
    gallery,
    description,
    owner,
  },
  postedLike,
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
            product={defaultImage}
            activeImage={defaultImage.src}
            alt={title}
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
              <span id="url_field_Product" className={s.hidden}>{config.uiUrl}/products/{productId}</span>
            </div>
          )
        }
        <Shares
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
            overWhiteBackground
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
              to={{
                pathname: `/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`,
                state: {
                  profileActiveTabIndex: 3
                }
              }}
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
                    <img src={brand.logo} alt='' />
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
                    <i className="icon-map-marker" />
                    {brand.location.label}
                  </div>
                )
              }
              {
                brand.website && (
                  <div className={s.website}>
                    <i className="icon-web" />
                    <a href={brand.website.url}>{brand.website.name}</a>
                  </div>
                )
              }
              {
                brand.phoneNumber && (
                  <div className={s.phoneNumber}>
                    <i className="icon-phone" />
                    {brand.phoneNumber}
                  </div>
                )
              }
              {
                brand.email && (
                  <div className={s.email}>
                    <i className="icon-envelope" />
                    {brand.email}
                  </div>
                )
              }
            </div>
          )
        }

        <div
          id='links'
          className={s.description}
          dangerouslySetInnerHTML={{__html: description}}
        />
      </div>
    </div>
    <Comments
      identifierId={productId}
      identifier={`products-${productId}`}
      identifierName={title}
      identifierType='products'
    />
  </Layout>
);

export { Product as ProductWithoutStyles };
export default withStyles(s)(Product);
