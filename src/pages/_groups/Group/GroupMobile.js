import React  from 'react';
import moment from "moment";
import classes from "classnames";
import slugify from 'slugify';
import Slider from "react-slick";
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import { settingsForListitem } from '../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Layout from '../../../components/_layout/Layout/Layout';
import HobbiesBlock from "../../../components/HobbiesBlock/HobbiesBlock";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GroupMobile.scss';

const Group = ({
  data: {
    id: groupId,
    name,
    details,
    hobbies,
    members,
    size,
    gallery,
    owner,
  },
  location,
  since,
  until,
  postedLike,
  viewMembersDetails,
  actionButtonsList,
  toggleDetails,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
        <div className={s.title}>
          {name}
        </div>
        <div className={s.poster}>
          {
            gallery.images && !!gallery.images.length && (
              <Slider
                className={s.slider}
                {...settingsForListitem}
              >
                {
                  gallery.images.map(item => (
                    <div
                      key={`${item.key}_${item.id}`}
                    >
                      <img src={item.src} alt={name}/>
                    </div>
                  ))
                }
              </Slider>
            )
          }
          {(since._isValid) && (
            <div className={s.dayEvent}>
              <span>
                {moment(since, 'X').format('ddd')}
              </span>
              <span className={s.day}>
                {moment(since, 'X').format('D')}
              </span>
              <span>
                {moment(since, 'X').format('MMM')}
              </span>
              <span className={s.category}>
                <HobbiesBlock
                  hobbiesList={hobbies}
                  isPopup={false}
                  maxHeight={73}
                />
              </span>
            </div>
          )}
        </div>

      <div className={classes(s.groupMembers, {
        [s.withDetails]: viewMembersDetails
      })}>
        <div className={s.owner}>
          <Link className={s.icon} to={`/${postedLike}/${owner.id}`}>
            {
              (owner.avatar && (
                <img
                  className={s.ownerAvatarImg}
                  src={owner.avatar.src}
                  alt={name}
                />
              )) || (
                <i className="icon-man" />
              )
            }
          </Link>
        <div className={s.ownerDetails}>
          <div className={s.name}>
            <Link to={`/${postedLike()}/${owner.id}`}>{owner.fullName}</Link>
          </div>
          <div className={s.currentNumberOfMembersOutOfTotal}>
            <i className="icon-man"/>
            {`${members.length}/${size} people`}
          </div>
        </div>
        </div>
        <div className={s.members}>
          <div className={s.membersList}>
            {
              (viewMembersDetails ? members : members.slice(0, 7)).map((m, i) => (
                <div key={i} className={s.member}>
                  <Link className={s.icon} to={`/member/${m.id}`}>
                    {
                      (m.avatar && (
                        <img
                          className={s.memberAvatarImg}
                          src={m.avatar.src}
                          alt={name}
                        />
                      )) || (
                        <i className="icon-man" />
                      )
                    }
                  </Link>
                  {
                    viewMembersDetails && (
                      <span className={s.name}>{m.fullName}</span>
                    )
                  }
                </div>
              ))
            }
            {
              !viewMembersDetails && (members.length > 7) && (
                <div className={s.member}>
                  <div
                    className={classes(
                      s.numberOfUndisplayedMembers,
                      'text-muted'
                    )}>
                    {`+ ${members.length - 7}`}
                  </div>
                </div>
              )
            }
          </div>
          <div className={s.toggle}>
            <a onClick={toggleDetails}>
              {
                (viewMembersDetails && I18n.t('general.hide')) ||
                I18n.t('general.showAll')
              }
            </a>
          </div>
        </div>
      </div>

      <div className={s.controls}>
        {
          !!actionButtonsList && !!actionButtonsList.length && (
            <div className={s.actionButtons}>
              { actionButtonsList }
            </div>
          )
        }
        <Shares
          title={name}
          shareUrl={`/groups/${slugify(name)}-${groupId}`}
        />
      </div>

      <div className={s.details}>
        {
          location && (
            <div className={s.map}>
              <i className="icon-map-marker"/>
              {location.label}
            </div>
          )
        }
        {
          moment(since, 'X').isValid() && moment(until, 'X').isValid() && (
            <div className={s.schedule}>
              <i className="icon-calendar-o"/>
              {moment(since, 'X').format('ddd, D MMMM')}
              -
              {moment(until, 'X').format('ddd, D MMMM')}
            </div>
          )
        }
        <div className={s.description}>
          <i className="icon-info"/>
          <p id='links' dangerouslySetInnerHTML={{__html: details}} />
        </div>
      </div>
    </div>
    <Comments
      identifierId={groupId}
      identifier={`groups-${groupId}`}
      identifierName={name}
      identifierType='groups'
    />
  </Layout>
);

export { Group as GroupWithoutStyles };
export default withStyles(s)(Group);
