import React from "react";
import classes from "classnames";
import moment from "moment";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItemMobile.scss";
import WarningPopover from '../../../../../components/WarningPopover';
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import {Link} from "react-router-dom";

const ListItem = ({
  data,
  data: {
    id,
    name,
    members,
    size,
    details,
    hobbies,
    updatedAt,
  },
  isFull,
  isMember,
  owner,
  since,
  until,
  location,
  notification,
  groupHasDate,
  defaultImage,
  onImageClick,
  actionButtons,
  onJoinToGroup,
  isJoining,
  showPopup,
  onPopupClose,
  showEditPopup,
  onEditPopupClose,
  onEditPopupSuccess,
  showOwnerDetails,
  onViewNotification,
  onPopupComponentWillUnmount,
  popupActionButtons,
  beforeFormDialogRender,
  beforeFormDialogClose,
  onFormDataChange,
  accountIsConfirmed,
  isAuthenticated,
}) => (
  <div
    className={classes(s.root, {
      [s.hasActionButtons]: !!actionButtons,
    })}
  >
    <div className={s.dayEvent}>
      {
        groupHasDate === 'not-null' && (
          <div className={s.date}>
            <span>{moment(since, 'X').format('ddd')}</span>
            <span className={s.day}>{moment(since, 'X').format('D')}</span>
            <span>{moment(since, 'X').format('MMM')}</span>
          </div>
        )
      }
      <span className={s.category}>
        <HobbiesBlock hobbiesList={hobbies} isPopup={false} maxHeight={80}/>
      </span>
    </div>
    <Link to={`/groups/${id}`} onClick={onViewNotification}>
      <div className={s.image}>
        <img
          src={defaultImage.src}
          alt={name}
          onClick={onImageClick}
        />
        <div className={s.members}>
          <i className="icon-man-bold" />
          <span className={s.currentNumberOfMembersOutOfTotal}>
            {`${members.length}/${size} people`}
          </span>
        </div>
      </div>
    </Link>
    {
      !isFull && !isMember && (
        <div className={s.actionButtons}>
          { isAuthenticated && (
            ( accountIsConfirmed && (
              <button className={s.joinToGroup} onClick={onJoinToGroup}>
                <i
                  className={classes({
                    'icon-reload icon-spin': isJoining,
                  }, {
                    'icon-plus': ! isJoining,
                  })}
                />
              </button>
            )) || (
              <WarningPopover>
                <button className={s.joinToGroup}>
                  <i className='icon-plus' />
                </button>
              </WarningPopover>
            )
          )
          }
        </div>
      )
    }
      <div className={s.text}>
        {name}
      </div>
    {
      !!actionButtons && !!actionButtons.length &&(
        <div className={s.actionButton}>
          { actionButtons }
        </div>
      )
    }
  </div>
);

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
