import React  from 'react';
import moment from 'moment';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../../components/_layout/Layout/Layout';
import Popup from "../../../components/_popup/Popup/Popup";
import ChatPopup from '../../_profile/Chat/Components/ChatPopup/Container';
import s from './PublicProfile.scss';
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';

const PublicProfile = ({
  isAuthenticated,
  onChatPopupOpen,
  onClosePopup,
  showChatPopup,
  profileDetails,
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
  <Layout contentHasBackground>
    <div className={classes(s.root, s.mobile)}>
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
          {
            roles[0].code === 'admin' ? null : dateOfBirth && (
              `, ${moment().diff(moment.unix(dateOfBirth), 'years')} years`
            )
          }
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
          email && (
            <div className={s.detaildsField}>
              <i className="icon-envelope" />
              <p>{email}</p>
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
      </div>
    </div>
    {
      showChatPopup && (
        <Popup
          onClose={onClosePopup}
        >
          <ChatPopup opponentId={userId} />
        </Popup>
      )
    }
  </Layout>
);

export default withStyles(s)(PublicProfile);
