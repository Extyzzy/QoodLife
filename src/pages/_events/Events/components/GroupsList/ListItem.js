import React from "react";
import moment from "moment";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import WarningPopover from '../../../../../components/WarningPopover';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import s from "./ListItem.scss";

const ListItem = ({
  data: {
    id,
    details,
    gallery,
    hobbies,
    members,
    name,
    size,
    event: {
      since,
      until,
      location,
    }
  },
  owner,
  isFull,
  isMobile,
  isAuthenticated,
  isMember,
  accountIsConfirmed,
  onJoinToGroup,
  onUserProfileOpen,
  isJoining,
  showJoinButton,
}) => (
  <div className={s.root}>
    <div className={s.poster}>
      <div className={classes(s.date, {[s.mobile]: isMobile})}>
       {
         moment(since, 'X').isValid() && moment(until, 'X').isValid() && (
           <div className={s.dayOfWeek}>
             {moment(since, 'X').format('ddd')}
           </div>
         )
        }
        {
          moment(since, 'X').isValid() && moment(until, 'X').isValid() && (
           <div className={s.day}>
             {moment(since, 'X').format('D')}
           </div>
         )
        }
        {
          moment(since, 'X').isValid() && moment(until, 'X').isValid() && (
           <div className={s.month}>
             {moment(since, 'X').format('MMM')}
           </div>
         )
        }
        <div className={s.hobbies}>
          <HobbiesBlock hobbiesList={hobbies} maxHeight={100}/>
        </div>
      </div>

      <div className={classes(s.groupMembers, {[s.mobile]: isMobile})}>
        <div className={s.owner}>
          <div className={s.icon} onClick={() => onUserProfileOpen(owner.id)}>
            {
              (owner.avatar && (
                <img
                  className={s.ownerAvatarImg}
                  src={owner.avatar.src}
                  alt=""
                />
              )) || (
                <i className="icon-man" />
              )
            }
          </div>
          <div className={classes(s.ownerDetails, {[s.mobile]: isMobile})}>
            <div className={s.name}>
              {owner.fullName}
            </div>
            <div className={s.currentNumberOfMembersOutOfTotal}>
              <i className="icon-man" />
              {
                `${members.length}/${size}   ${I18n.t('general.elements.people')}`
              }
            </div>
          </div>
        </div>
        <div className={s.members}>
          <div className={s.membersList}>
            {
              isAuthenticated && !isFull && !isMember && showJoinButton && (
                <div className={s.member}>
                  {
                    (accountIsConfirmed && (
                      <button
                        className={s.joinToGroup}
                        onClick={onJoinToGroup}
                      >
                        <i
                          className={classes(
                            {'icon-reload icon-spin': isJoining},
                            {'icon-plus': !isJoining}
                          )}
                        />
                      </button>
                    )) || (
                      <WarningPopover>
                        <button className={s.joinToGroup}>
                          <i className='icon-plus' />
                        </button>
                      </WarningPopover>
                    )
                  }
                </div>
              )
            }
            {
              members.slice(0, 3).map((m, i) => (
                <div key={i} className={s.member}>
                  <div
                    className={s.icon}
                    onClick={() => onUserProfileOpen(m.id)}
                  >
                    {
                      (m.avatar && (
                        <img
                          className={s.memberAvatarImg}
                          src={m.avatar.src}
                          alt=""
                        />
                      )) || (
                        <i className="icon-man" />
                      )
                    }
                  </div>
                </div>
              ))
            }
            {
              members.length > 3 && (
                <div className={s.member}>
                  <div className={s.numberOfUndisplayedMembers}>
                    {`+ ${members.length - 3}`}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
      <div className={classes(s.details, {[s.mobile]: isMobile})}>
        <Link to={`/groups/${id}`}>
          <h4 className={s.title}>{name}</h4>
        </Link>
        {
          location && (
            <div className={s.map}>
              <i className="icon-map-marker" />
              {location.label}
            </div>
          )
        }
        <div className={s.description}>
          <i className="icon-info" />
          <div
            id='links'
            className={s.content}
            dangerouslySetInnerHTML={{__html: details}} />
        </div>
      </div>
    </div>
  </div>
);

export default withStyles(s)(ListItem);
