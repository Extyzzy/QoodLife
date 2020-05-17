import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './ProductMobile.scss';
import Layout from '../../../components/_layout/Layout/Layout';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Slider from "react-slick";
import {settingsForListitem} from '../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile';
import {Link} from "react-router-dom";
import {I18n} from "react-redux-i18n";

const Product = ({
  data: {
    id: productId,
    title,
    brand,
    gallery,
    description,
    owner
  },
  postedLike,
  actionButtonsList
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
          title={title}
          shareUrl={`/products/${slugify(title)}-${productId}`}
        />
      </div>
        <div className={s.ownerDetails}>
          <div>
            {
              (owner.avatar && (
                <img src={owner.avatar.src} alt={owner.fullName} />
              )) || (
                <i className="icon-man" />
              )
            }
          </div>
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
