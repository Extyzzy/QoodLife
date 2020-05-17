import React from "react";
import classes from "classnames";
import moment from "moment";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import MapPopup from './Map';
import config from "../../../../../config";
import WarningPopover from '../../../../../components/WarningPopover';
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import Popup from "../../../../../components/_popup/Popup/Popup";
import NotificationsList from '../../../../../components/NotificationsList';
import ChatPopup from '../../../../_profile/Chat/Components/ChatPopup';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import PopupContent from "../PopupContent";
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import slugify from "slugify/index";

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
    createdAt,
    owner,
  },
  isFull,
  isMember,
  notification,
  since,
  until,
  postedLike,
  groupHasDate,
  location,
  defaultImage,
  onImageClick,
  actionButtons,
  onJoinToGroup,
  onViewNotification,
  isJoining,
  showPopup,
  onPopupClose,
  showOwnerDetails,
  onPopupComponentWillUnmount,
  popupActionButtons,
  onMapClick,
  showPopupMap,
  accountIsConfirmed,
  isAuthenticated,
  groupsList,
  onPopupMapClose,
  onChatPopupOpen,
  showChatPopup,
  onChatPopupClose,
  lastSeen,
}) => (
  <div
    className={classes(s.root, {
      [s.hasActionButtons]: !!actionButtons,
    })}
  >
    <div className={s.aside}>
      {
        groupHasDate === 'not-null' && (
          <div className={s.date}>
            <div className={s.dayOfWeek}>
              {
                moment(since, 'X').isValid() && moment(until, 'X').isValid() &&(
                  moment(since, 'X').format('ddd')
                )
              }
            </div>
            <div className={s.day}>
              {
                moment(since, 'X').isValid() && moment(until, 'X').isValid() &&(
                  moment(since, 'X').format('D')
                )
              }
            </div>
            <div className={s.month}>
              {
                moment(since, 'X').isValid() && moment(until, 'X').isValid() &&(
                  moment(since, 'X').format('MMM')
                )
              }
            </div>
          </div>
        )
      }
      <HobbiesBlock hobbiesList={hobbies} isPopup={false} maxHeight={140}/>
    </div>
    <div className={s.image}>
      <LazyLoadImage
        width="240px"
        height="160px"
        effect="blur"
        src={defaultImage.src}
        alt={name}
        onClick={onImageClick}
      />
      <div className={s.members}>
        <i className="icon-man-bold" />
        <span className={s.currentNumberOfMembersOutOfTotal}>
          {
            `${members.length}/${size}   ${I18n.t('general.elements.people')}`
          }
        </span>
      </div>
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
    </div>

    <div className={s.details}>
      <Link
        className={s.title}
        onClick={onViewNotification}
        to={`/groups/${slugify(name)}-${id}`}
      >
        <h4>{name}</h4>
      </Link>

      {
        showOwnerDetails && owner && (
          <div className={s.owner}>
            <i className="icon-man-bold"/>
            <Link to={`/${postedLike()}/${slugify(owner.fullName)}-${owner.id}`}>{owner.fullName}</Link>
          </div>
        )
      }

      {
        location && (
          <div className={s.map}>
              <i className="icon-map-marker" />
            <a href="#" onClick={onMapClick}>
            {location.label}
            </a>
          </div>
        )
      }

      <div className={s.description}>
        <i className="icon-info" />
        <p id='links' dangerouslySetInnerHTML={{__html: details}} />
      </div>

      <div className={s.footer}>
        <div className={s.dateTime}>
          { moment.unix(updatedAt).format(I18n.t('formats.dateTime')) }
        </div>
        {
          notification && !!notification.length && (
            <NotificationsList
              notificationsList={notification}
              activeModule="groups"
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

        {
          !!actionButtons && (
            <div className={s.actionButtons}>
              { actionButtons}
            </div>
          )
        }
      </div>
    </div>

    {
      showPopupMap && (
        <Popup onClose={onPopupMapClose}>
          <div className={s.divMap}>
            <MapPopup
              markerId={id}
              center={{lat: location.latitude, lng: location.longitude}}
              data={groupsList}
              containerElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
              mapElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
              loadingElement={<div />}
              googleMapURL={config.googleMapsApiV3Url}
            />
          </div>
        </Popup>
      )
    }

    {
      showPopup && (
        <Popup onClose={onPopupClose}>
          <PopupContent
            data={data}
            owner={owner}
            onChatPopupOpen={onChatPopupOpen}
            actionButtons={
              popupActionButtons
            }
            onPopupComponentWillUnmount={
              onPopupComponentWillUnmount
            }
          />
        </Popup>
      )
    }

    {
      showChatPopup && (
        <Popup onClose={onChatPopupClose}>
          <ChatPopup opponentId={owner.memberDetails.id} />
        </Popup>
      )
    }


  </div>
);

export {ListItem as ListItemWithoutStyles};
export default withStyles(s)(ListItem);
