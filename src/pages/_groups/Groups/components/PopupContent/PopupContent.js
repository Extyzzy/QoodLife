import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PopupContent.scss';
import moment from "moment";
import classes from "classnames";
import slugify from 'slugify';
import Comments from '../../../../../components/Comments';
import Shares from '../../../../../components/Shares';
import Slider from "react-slick";
import HobbiesBlock from "../../../../../components/HobbiesBlock/HobbiesBlock";
import { I18n } from 'react-redux-i18n';
import { Link } from 'react-router-dom';
import config from '../../../../../config';
import { PrevArrow, NextArrow } from '../../../../../components/_carousel/CarouselArrows/CarouselArrows';

const PopupContent = ({
  data,
  data: {
    id: groupId,
    gallery,
    name,
    details,
    event,
    hobbies,
    members,
    size,
    owner,
  },
  postedLike,
  location,
  since,
  until,
  viewMembersDetails,
  defaultImage,
  actionButtonsList,
  toggleDetails,
  comments,
  sliderSettings
}) => (
  <div className={s.root}>
    <div className={s.title}>
      {name}
    </div>
    <div className={s.poster}>
      <div className={s.date}>
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
          <HobbiesBlock hobbiesList={hobbies} isPopup={true} maxHeight={100}/>
        </div>
      </div>
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
          {
            (owner.avatar && (
              <img
                className={s.ownerAvatarImg}
                src={owner.avatar.src}
                alt={owner.avatar.fullName}
              />
            )) || (
              <i className="icon-man" />
            )
          }
          <div className={s.ownerDetails}>
            <div className={s.name}>
              <Link className={s.icon} to={`/${postedLike(data.postedLike.code)}/${slugify(owner.fullName)}-${owner.id}`}>
                {owner.fullName}
              </Link>
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
              (viewMembersDetails ? members : members.slice(0, 7)).map((m, i) => (
                <div key={i} className={s.member}>
                  <Link className={s.icon} to={`/member/${slugify(m.fullName)}-${m.id}`}>
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
                  </Link>
                  {
                    viewMembersDetails && (
                      <span className={s.name}>
                        <Link className={s.icon} to={`/member/${slugify(m.fullName)}-${m.id}`}>
                          {m.fullName}
                         </Link>
                      </span>
                    )
                  }
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
                (viewMembersDetails && I18n.t('general.elements.hide')) || (
                  I18n.t('general.elements.showAll')
                )
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
            <span id="url_field_Groups" className={s.hidden}>{config.uiUrl}/groups/{groupId}</span>

          </div>
        )
      }
      <Shares
        isPopup
        title={name}
        shareUrl={`/groups/${slugify(name)}-${groupId}`}
      />
    </div>


    <div className={s.details}>
      {
        location && (
          <div className={s.map}>
            <i className="icon-map-marker" />
            {location.label}
          </div>
        )
      }
      {
        moment(since, 'X').isValid() && moment(until, 'X').isValid() && (
          <div className={s.schedule}>
            <i className="icon-calendar-o" />
            {moment(since, 'X').format('ddd, D MMMM')}
            -
            {moment(until, 'X').format('ddd, D MMMM')}
          </div>
        )
      }
      <div className={s.description}>
        <i className="icon-info" />
        <p  id='links' dangerouslySetInnerHTML={{__html: details}} />
      </div>
    </div>
    <Comments
      identifierId={groupId}
      identifier={`groups-${groupId}`}
      identifierName={name}
      identifierType='groups'
    />
  </div>
);

export {PopupContent as PopupContentWithoutStyles};
export default withStyles(s)(PopupContent);
