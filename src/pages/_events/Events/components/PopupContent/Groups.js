import React  from 'react';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import moment from 'moment';
import GroupsList from '../GroupsList';
import HobbiesBlock from '../../../../../components/HobbiesBlock/HobbiesBlock';
import WarningPopover from '../../../../../components/WarningPopover';
import s from './PopupContent.scss';

const Groups = ({
  data,
  data: {
    id: eventId,
    title,
    description,
    location,
    hobbies,
    date,
    since,
    until
  },
  userCanAddGroup,
  defaultImage,
  closeGroupsList,
  createGroupForEvent,
  isAuthenticated,
}) => (
  <div className={classes(s.root, s.list)}>
    <div className={s.eventBlock}>
      <div className={s.date}>
        <div className={s.dayOfWeek}>
          {moment(date, 'X').format('ddd')}
        </div>
        <div className={s.day}>
          {moment(date, 'X').format('D')}
        </div>
        <div className={s.month}>
          {moment(date, 'X').format('MMM')}
        </div>
        <div className={s.hobbies}>
          <HobbiesBlock hobbiesList={hobbies} isPopup={false} maxHeight={73}/>
        </div>
      </div>

      <div className={s.image}>
        <img src={defaultImage.src} alt=""/>
      </div>

      <div className={s.details}>
        <h4 className={s.title}>{title}</h4>
        <div className={s.detailsRow}>
          <i className="icon-map-marker" />
          {location.label}
        </div>
        <div className={s.detailsRow}>
          <i className="icon-calendar-o" />
          {moment(since, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
          {' - '}
          {moment(until, 'X').format(I18n.t('formats.events.scheduleDateTime'))}
        </div>
        <div className={s.detailsRow}>
          <i className="icon-info" />
          <div
            id='links'
            className={s.description}
            dangerouslySetInnerHTML={{__html: description}}
          />
        </div>
      </div>
    </div>
    <div className={s.controls}>
      <div className={s.actionButtons}>
        <button
          className="btn btn-red"
          onClick={closeGroupsList}
        >
          {I18n.t('groups.backToDescription')}
        </button>

        {
          (!isAuthenticated &&(
            <div />
          )) || (
            userCanAddGroup  &&(
              <button
                className={s.groupsButtonAdd}
                onClick={createGroupForEvent}
              >
                {I18n.t('groups.addGroupButton')}
              </button>
          )) || (
            <WarningPopover isPopup={true}>
              <button className={s.groupsButtonAdd}>
                {I18n.t('groups.addGroupButton')}
              </button>
            </WarningPopover>
          )
        }
      </div>

    </div>
    <div className={s.groupsList}>
      <GroupsList
        data={data}
      />
    </div>
  </div>
);

export default withStyles(s)(Groups);
