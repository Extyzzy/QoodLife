import React from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListItem.scss';
import DataList from '../DataList/DataList';
import {MOBILE_VERSION} from "../../../../../actions/app";

const ListItem = ({
 couldLoadMore,
 scrollDirection,
 scroll,
 time,
 onToggle,
 onClose,
 isOpened,
 onDetach,
 openedListItem,
 UIVersion,
 data: {
   hobby: {
     id: hobbyId,
     image,
     name,
   },
   total,
   lastSeen_1,
   lastSeen_2,
 },
}) => (
  <div
    className={classes(s.root, {
      [s.open]: isOpened,
      [s.noneBlock]: time,
    })}
    onClick={couldLoadMore}
  >

    <div className={classes(s.block, {
      [s.visible]: isOpened ? 25 > scroll ? false : scrollDirection === 'up' ? true : false : false,
      [s.mobileWidth]: UIVersion === MOBILE_VERSION,
    })}
         style={25 > scroll ? {opacity: 1} : null}>
      <div onClick={isOpened ?  onClose : onToggle}>
        <img
          src={image.src}
          alt={name}
        />
        <h3>{name}</h3>
      </div>

      <div className={s.buttons}>
        <span style={total > 0 ? {opacity: 0.5} : {opacity: 0}}>+ {total}</span>

        {UIVersion !== MOBILE_VERSION && isOpened && (
          <button
            onClick={isOpened ? onClose : onToggle}
            className={classes('toggle round-button', s.openButton, {
              'open': isOpened,
              [s.mobile]: UIVersion === MOBILE_VERSION,
            })}
          />
        )}

        {(!!isOpened || UIVersion !== MOBILE_VERSION) && (
          <button
          className={classes('remove round-button', s.detachButton)}
          onClick={onDetach}
        />
        )}
      </div>
    </div>

    {
      isOpened && (
        <DataList
          hobbyId={hobbyId}
          lastSeen_1={lastSeen_1}
          lastSeen_2={lastSeen_2}
          scrollDirection={scrollDirection}
          scroll={scroll}
        />
      )
    }
  </div>
);

export default withStyles(s)(ListItem);
