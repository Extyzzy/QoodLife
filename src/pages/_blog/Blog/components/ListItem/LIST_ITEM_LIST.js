import React from 'react';
import classes from 'classnames';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { I18n } from "react-redux-i18n";
import s from './ListItem.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import NotificationsList from '../../../../../components/NotificationsList';

import {
  ItemPopup,
} from './Popups';

const ListItem = ({
  data,
  data: {
    id: postId,
    title,
    intro,
    image,
    updatedAt,
    createdAt,
    owner,
  },
  notification,
  postedLike,
  onImageClick,
  onViewNotifications,
  actionButtonsList,
  showPopup,
  onPopupClose,
  showOwnerDetails,
  onPopupComponentWillUnmount,
  popupActionButtons,
  showEditPopup,
  onEditPopupClose,
  onEditPopupSuccess,
  viewMode,
  className,
  beforeFormDialogRender,
  onFormDataChange,
  lastSeen,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: actionButtonsList && !!actionButtonsList.length,
      [s.public]: window.location.href.indexOf('profile') !== -1 && !data.public,
    }, {
      [className]: !!className,
    })}
  >
    <div className={s.image}>
      <LazyLoadImage
        width="100%"
        height="100%"
        effect="blur"
        src={image.src}
        alt=""
        onClick={onImageClick}
      />
    </div>

    <div className={s.details}>
      <Link className={s.title}
        to={`/blog/post/${slugify(title)}-${postId}`}
        onClick={onViewNotifications}
      >
        <h4>{title}</h4>
      </Link>


      {console.info(showOwnerDetails, owner)}
      {
        showOwnerDetails && !!owner.length &&(
          <div className={s.owner}>
            <i className="icon-man-bold" />
            <Link to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}>{owner.fullName}</Link>
          </div>
        )
      }

      <div className={s.intro}>
        <p>{intro}</p>
      </div>

      <div className={s.footer}>
        <div className={s.dateTime}>
          { moment.unix(updatedAt).format(I18n.t('formats.dateTime')) }
        </div>

        {
          actionButtonsList && !!actionButtonsList.length && (
            <div className={classes(s.actionButtons)}>
              { actionButtonsList }
            </div>
          )
        }

        {
          notification && !!notification.length && (
            <NotificationsList
              notificationsList={notification}
              activeModule="blog"
            />
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

export { ListItem as ListItemWithoutDecorators };
export default withStyles(s)(ListItem);
