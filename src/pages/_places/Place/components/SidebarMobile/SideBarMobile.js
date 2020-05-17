import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { FaClose } from 'react-icons/lib/fa/index';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import s from './SidebarMobile.scss';

import FiltreCalendar from './FilterCalendarMobile';
import FilterHobbiesEvents from './FilterHobbiesEventsMobile';

const SideBar = ({
  showCloseButton,
  viewSwitchMode,
  showSideBar,
  sideBar,
  calendarPlace,
  placeOrProfHobbies,
  eventsHobbies
}) => {
  return (
    <div className={s.root}>
      <div
        className={classes({
          [s.backgroundShadow]: showSideBar
        })}
        onClick={sideBar}
      />
      <div
        className={classes(s.containnerCategory, {
          [s.showSideBar]: showSideBar
        })}
      >
        <div className={s.buttonsCategory}>
          <div className={s.links}>
            {calendarPlace &&
              calendarPlace.status &&
              calendarPlace.filters.length > 0 && (
                <FiltreCalendar
                  title={I18n.t('general.sidebar.calendarFilters')}
                  calendarPlace={calendarPlace}
                  sideBar={sideBar}
                />
              )}
            {eventsHobbies.length > 0 && (
              <FilterHobbiesEvents
                placeOrProfHobbies={placeOrProfHobbies}
                sideBar={sideBar}
              />
            )}
          </div>
        </div>

        <div className={s.containerCloseButton}>
          <div className={s.closeButton} onClick={sideBar}>
            <FaClose className={s.icon} size={20} />
          </div>
        </div>
      </div>

      {showCloseButton && (
        <div className={s.swith}>
          <div className={s.containerButton} onClick={sideBar}>
            <div className={s.button}>
              {I18n.t('general.sidebar.sidebarFilters')}
            </div>
          </div>
          {viewSwitchMode}
        </div>
      )}
    </div>
  );
};

export { SideBar as SideBarWithoutStyles };
export default withStyles(s)(SideBar);
