import React from "react";
import classes from "classnames";
import slugify from 'slugify';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItemMobile.scss";
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import moment from "moment";
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  data: {
    id: eventId,
    title,
    shortTitle,
    hobbies,
    date,
  },
  viewMode,
  defaultImage,
  actionButtonsList,
  className,
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList,
    }, {
      [className]: !!className,
    })}
  >
    <Link to={{pathname: `/events/${slugify(title)}-${eventId}`, state: {data}}}>
    <div className={s.image}>
      <img
        src={defaultImage.src}
        alt={shortTitle? shortTitle:title}
      />
    </div>
    </Link>
    <div className={s.dayEvent}>
      <span>{moment(date, 'X').format('ddd')}</span>
      <span className={s.day}>{moment(date, 'X').format('D')}</span>
      <span>{moment(date, 'X').format('MMM')}</span>
      <span className={s.category}>
        <HobbiesBlock hobbiesList={hobbies} maxHeight={73}/>
      </span>
    </div>
    <div className={s.details}>
      <div className={s.name}>
        {title}
      </div>
    </div>
    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }
  </div>
);

export {ListItem as ListItemWithoutDecorators};
export default withStyles(s)(ListItem);
