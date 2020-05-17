import React  from 'react';
import moment from "moment";
import classes from "classnames";
import slugify from 'slugify';
import Slider from "react-slick";
import Popup from '../../../components/_popup/Popup/Popup';
import ChatPopup from '../../_profile/Chat/Components/ChatPopup';
import Comments from '../../../components/Comments';
import Shares from '../../../components/Shares';
import Layout from '../../../components/_layout/Layout/Layout';
import HobbiesBlock from "../../../components/HobbiesBlock/HobbiesBlock";
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Group.scss';
import config from '../../../config';
import { PrevArrow, NextArrow } from '../../../components/_carousel/CarouselArrows/CarouselArrows';

const Group = ({
 data: {
   id: groupId,
   name,
   details,
   hobbies,
   gallery,
   members,
   size,
   owner
 },
 location,
 since,
 until,
 postedLike,
 groupWithDate,
 showChatPopup,
 onClosePopup,
 viewMembersDetails,
 defaultImage,
 actionButtonsList,
 toggleDetails,
 sliderSettings
}) => (
  <Layout
    hasAds
    hasSidebar
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.title}>
        {name}
      </div>

      <div className={s.poster}>
        {
          (groupWithDate && (
            <div className={s.date}>
              <div className={s.dayOfWeek}>
                {moment(since, 'X').format('ddd')}
              </div>
              <div className={s.day}>
                {moment(since, 'X').format('D')}
              </div>
              <div className={s.month}>
                {moment(since, 'X').format('MMM')}
              </div>
              <div className={s.hobbies}>
                <HobbiesBlock hobbiesList={hobbies} isPopup={true} maxHeight={115}/>
              </div>
            </div>
          )) || (
            <div className={s.date}>
              <div className={s.hobbies}>
                <HobbiesBlock hobbiesList={hobbies} isPopup={true} maxHeight={115}/>
              </div>
            </div>
          )
        }
          <div className={s.sliderContainer}>
            {!viewMembersDetails &&
              ((gallery.images.length > 1 ? (
                <Slider
                  {...sliderSettings}
                  nextArrow={(
                    <NextArrow
                      arrowClassName={s.nextArrow}
                    />
                  )}
                  prevArrow={(
                    <PrevArrow
                      arrowClassName={s.prevArrow}
                    />
                  )}
                >
                  {gallery.images.map(item => (
                    <div key={`${item.key}_${item.id}`}>
                      <img className={s.slider} src={item.src} alt={name} />
                    </div>
                  ))}
                </Slider>) : (
                  <Slider
                  arrows={false}
                  swipe={false}
                  >
                    {gallery.images.map(item => (
                      <div key={`${item.key}_${item.id}`}>
                        <img className={s.slider} src={item.src} alt={name} />
                      </div>
                    ))}
                  </Slider>
                )

              ))}
          </div>
        <div className={classes(s.groupMembers, {
          [s.withDetails]: viewMembersDetails
        })}>
          <div className={s.owner}>
            <Link className={s.icon} to={`/${postedLike()}/${owner.id}`}>
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
            </Link>
            <div className={s.ownerDetails}>
              <div className={s.name}>
                <Link className={s.icon} to={`/${postedLike()}/${owner.id}`}> {owner.fullName}</Link>
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
                            alt=""
                          />
                        )) || (
                          <i className="icon-man" />
                        )
                      }
                      {
                        viewMembersDetails && (
                          <span className={s.name}>{m.fullName}</span>
                        )
                      }
                    </Link>
                  </div>
                ))
              }

              {
                !viewMembersDetails && (members.length > 7) && (
                  <div className={s.member}>
                    <div className={classes(s.numberOfUndisplayedMembers, 'text-muted')}>+{members.length - 7}</div>
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
      </div>

      <div className={s.controls}>
        {
          !!actionButtonsList && !!actionButtonsList.length && (
            <div className={s.actionButtons}>
              { actionButtonsList }
              <span id="url_field_Group" className={s.hidden}>{config.uiUrl}/groups/{groupId}</span>
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

    {
      showChatPopup && (
        <Popup
          notShowCloser
          onClose={onClosePopup}
        >
          <ChatPopup opponentId={owner.memberDetails.id} />
        </Popup>
      )
    }
  </Layout>
);


export { Group as GroupWithoutStyles };
export default withStyles(s)(Group);
