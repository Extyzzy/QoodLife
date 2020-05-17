import React from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from "slugify/index";
import s from './ListItem.scss';
import { Link } from 'react-router-dom';

import {
  ItemPopup,
} from './Popups';

const ListItem = ({
  data,
  data: {
    id: postId,
    title,
    shortTitle,
    image,
  },
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  onPopupComponentWillUnmount,
  popupActionButtons,
  viewMode,
  className,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: actionButtonsList && !!actionButtonsList.length,
    }, {
      [className]: !!className,
    })}
  >
    <div className={s.image}>
      <img
        src={image.src}
        alt={title}
        onClick={onImageClick}
      />
    </div>

    <div className={s.details}>
      <Link className={s.name} to={`/blog/post/${slugify(title)}-${postId}`}>
        {shortTitle? shortTitle :title}
      </Link>
    </div>

    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }

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
