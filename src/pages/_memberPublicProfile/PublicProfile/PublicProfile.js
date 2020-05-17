import React  from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../../components/_layout/Layout/Layout';
import Popup from "../../../components/_popup/Popup/Popup";
import ChatPopup from '../../_profile/Chat/Components/ChatPopup';
import s from './PublicProfile.scss';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import Tabs from '../../../components/Tabs/Tabs';
import config from '../../../config';

const PublicProfile = ({
  inviteMemberToBePros,
  userWasInvited,
  onChatPopupOpen,
  onClosePopup,
  showChatPopup,
  canInviteMember,
  userIsPros,
  tabOptions,
  activeTabItemIndex,
  onActiveTabChange,
  isAuthenticated,
  profileDetails: {
    id: userId,
    avatar,
    fullName,
    email,
    roles,
    locations,
    children,
    dateOfBirth,
    phoneNumber,
    placeDetails,
    profDetails,
  },
}) => (
  <Layout
    hasSidebar
    hasAds
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.avatar}>
        {
          (avatar && (
            <img src={avatar.src} alt={fullName} />
          )) || (
            <i className='icon-man' />
          )
        }
      </div>
      <div className={s.profileDetails}>
        <h3 className={s.userName}>
          {fullName}
        </h3>
        <div className={s.userPosition}>
          {roles[0].name}
        </div>
        <div className={s.additionalProfilesLink}>
          {
            placeDetails && (
              <div className={s.item}>
                <i className="icon-map-marker" />
                <Link to={`/places/${placeDetails.id}`}>
                  {placeDetails.name}
                </Link>
              </div>
            )
          }

          {
            profDetails && (
              <div className={s.item}>
                <i className="icon-man-bold" />
                <Link to={`/professionals/${profDetails.id}`}>
                  {`${profDetails.firstName} ${profDetails.lastName}`}
                </Link>
              </div>
            )
          }
        </div>
        {
          !!locations.length && (
            <div className={s.detaildsField}>
              <i className="icon-map-marker" />
              <p>{locations[0].label}</p>
            </div>
          )
        }

        {
          phoneNumber && (
            <div className={s.detaildsField}>
              <i className="icon-phone" />
              <p>{phoneNumber}</p>
            </div>
          )
        }
        <div>
          {
            isAuthenticated && (
              <button
                className={classes("btn btn-white", s.writeMessageBtn)}
                onClick={onChatPopupOpen}
              >
                {I18n.t('general.elements.writeMessage')}
              </button>
            )
          }

          {
            userIsPros
            && isAuthenticated
            && !profDetails
            && canInviteMember
            && !userWasInvited && (
              <button
                className='btn btn-red'
                onClick={inviteMemberToBePros}
              >
                Invita Ca Prof
              </button>
            )
          }
        </div>
        <span id="url_field_Member" className={s.hidden}>
          {`${config.uiUrl}/member/${userId}`}
        </span>
      </div>
    </div>
    <Tabs
      items={tabOptions}
      className={s.relatedTabs}
      activeItemIndex={activeTabItemIndex}
      onChange={onActiveTabChange}
    />
    {
      showChatPopup && (
        <Popup
          notShowCloser
          onClose={onClosePopup}
        >
          <ChatPopup opponentId={userId} />
        </Popup>
      )
    }
  </Layout>
);

export default withStyles(s)(PublicProfile);
