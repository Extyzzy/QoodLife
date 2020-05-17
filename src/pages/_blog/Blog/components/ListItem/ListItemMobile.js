import React from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import slugify from 'slugify';
import s from './ListItemMobile.scss';
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  data: {
    id: postId,
    title,
    shortTitle,
    owner,
    image,
    intro,
  },
  actionButtonsList,
  showOwnerDetails,
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

    <div className={s.details}>
      <div className={s.name} >
        {shortTitle? shortTitle :title}
      </div>
    </div>

    <Link to={{pathname: `/blog/post/${slugify(title)}-${postId}`, state: {data}}}>
      <div className={s.image}>
        <img
          src={image.src}
          alt={title}
        />
      </div>
    </Link>

    {
      showOwnerDetails && (
        <div className={s.owner}>
          <i className="icon-man-bold" />
          <div className={s.ownerDetails}>{owner.fullName}</div>
        </div>
      )
    }

    <p className={s.intro}>
      {intro}
    </p>

    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }

  </div>
);

export { ListItem as ListItemWithoutDecorators };
export default withStyles(s)(ListItem);
