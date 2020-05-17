import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { I18n } from "react-redux-i18n";
import NotificationsList from '../../../../../components/NotificationsList';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import {
  ItemPopup,
} from './Popups';

const LIST_ITEM_LIST = ({
  data,
  data: {
    id: productId,
    title,
    description,
    updatedAt,
    createdAt,
    owner,
    brand,
  },
  onViewNotifications,
  notification,
  postedLike,
  viewMode,
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  showOwnerDetails,
  onPopupComponentWillUnmount,
  popupActionButtons,
  showEditPopup,
  onEditPopupClose,
  onEditPopupSuccess,
  className,
  beforeFormDialogRender,
  beforeFormDialogClose,
  onFormDataChange,
  lastSeen
  }) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList && !!actionButtonsList.length,
      [s.public]: window.location.href.indexOf('profile') !== -1 && !data.public,
    }, {
      [className]: !!className,
    })}
  >
    <div className={s.image}>
      <LazyLoadImage
        width="100%"
        height="100%"
        effect={'blur'}
        src={defaultImage.src}
        alt={title}
        onClick={onImageClick}
        style={parseInt(defaultImage.height, 10) < parseInt(defaultImage.width, 10) ? {width: '100%'} : null}
      />
    </div>

    <div className={s.content}>
      <Link
        className={s.title}
        to={`/products/${slugify(title)}-${productId}`}
        onClick={onViewNotifications}
      >
        {title}
      </Link>

      <div className={s.details}>
        <div className={s.product}>
          <div className={s.brand}>
            {brand && brand.name}
          </div>
          <div className={s.description}>
          <p id='links' dangerouslySetInnerHTML={{__html: description}} />
          </div>
        </div>
        <div className={s.contacts}>
          {
            owner.fullName &&(
              <div className={s.fullname}>
                <i className="icon-man-bold"/>
                <Link
                  target="_blank"
                  to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}
                >
                  {owner.fullName}
                </Link>
                </div>
            )
          }

          {
            owner.email &&(
              <div className={s.email}>
                <i className="icon-envelope" />
                {owner.email}
                </div>
            )
          }

          {
            owner.phonesNumber &&(
              <div className={s.phone}>
                <i className="icon-phone" />
                {owner.phonesNumber}
                </div>
            )
          }
          
          {
            
            owner.website && !!owner.website.length &&(
              <div className={s.phone}>
                <i className='icon-globe' />
                <a href={owner.website[0].url} target="_blank">{owner.website[0].url}</a>
              </div>
            )
          }

          {
            owner.location &&(
              <div className={s.location}>
                <i className="icon-map-marker" />
                  {owner.location.label || owner.location.location.label}
                </div>
            )
          }

        </div>
      </div>

      <div className={s.footer}>
        {
          notification && !!notification.length && (
            <NotificationsList
              notificationsList={notification}
              activeModule="products"
            />
          )
        }

        {
          !!actionButtonsList && !!actionButtonsList.length && (
            <div className={s.actionButtons}>
              { actionButtonsList }
            </div>
          )
        }

        {
          ( window.location.href.indexOf('timeline') !== -1 && createdAt > lastSeen ) &&(
            <div className={s.lastSeen}>
              {I18n.t('profile.timeline.new')}
            </div>
          )
        }
      </div>
    </div>

    {
      showPopup && (
        <ItemPopup
          data={data}
          onPopupClose={onPopupClose}
          popupActionButtons={popupActionButtons}
          onPopupComponentWillUnmount={onPopupComponentWillUnmount}
        />
      )
    }

  </div>
);

export {LIST_ITEM_LIST as LIST_ITEM_LIST_WITHOUT_STYLES};
export default withStyles(s)(LIST_ITEM_LIST);
