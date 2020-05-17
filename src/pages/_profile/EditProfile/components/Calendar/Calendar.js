import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { MOBILE_VERSION } from '../../../../../actions/app';
import { forEach } from 'lodash';
import Loader from "../../../../../components/Loader";
import EventsList from "./EventsList";
import moment from 'moment';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Calendar.scss';
import {FILTER_OWNED} from "../../../../../helpers/filter";
import {
  fetchRelatedEventsWithStore,
  setFilterCalendar,
  clearFilterCalendar
} from "../../../../../actions/calendar";
import {
  clearEvents,
  fetchEventsWithStore,
} from "../../../../../actions/events";
import {fetchAuthorizedApiRequest} from "../../../../../fetch";
import {appendToFormData} from "../../../../../helpers/form";
import {SilencedError} from "../../../../../exceptions/errors";
import config from "../../../../../config";
import { I18n } from 'react-redux-i18n';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Popup from "../../../../../components/_popup/Popup";
import PopupContent from "./PopupContent";

class Calendar extends Component {
  constructor(props, context) {
    super(props, context);

    const { eventsList, activeMonth } = this.props;
    const activeMonthWithStore = moment.unix(activeMonth);

    this.state = {
      eventsList,
      activeMonth: activeMonthWithStore._i === 0
      ? moment()
      : activeMonthWithStore,
      fullCalendar: true,
      isLoaded: false,
      selectedDate: null,
      dayInterval: null,
      clipBoardWasClicked: false,
      showFilterModal: false,
    };
  };

  componentDidMount() {
    const {
      dispatch,
      calendarPlace
    } = this.props;

    this.getEventsList();

    dispatch(
      setFilterCalendar(calendarPlace)
    )

  }

  componentWillReceiveProps(nextProps) {
    const {
      eventsList,
      activeMonth,
      intervalWasChanged,
      selectedFilterCalendar: NextSelectedFilterCalendar
    } = nextProps;

    const {dayInterval} = this.state;

    const {selectedFilterCalendar} = this.props;

    if (selectedFilterCalendar !== NextSelectedFilterCalendar) {
      this.getEventsList(NextSelectedFilterCalendar);
      this.getEventsListUnderCalendar(dayInterval, NextSelectedFilterCalendar);
      this.setState({fullCalendar: false})
    }

    this.setState({
      eventsList,
      activeMonth: moment.unix(activeMonth),
      ...(intervalWasChanged? {
        selectedDate: null } :  {})
    })
  }

  componentWillUnmount() {
    const {dispatch} = this.props;

    dispatch(
      clearFilterCalendar()
    );

    if (this.fetchEventsListFetcher instanceof Promise) {
      this.fetchEventsListFetcher.cancel();
    }
  }

  getUIVersion() {
    const { UIVersion } = this.props;

    if(UIVersion === MOBILE_VERSION){
      return true
    }

    return false;
  }

  resetCalendar() {
    const {dispatch} = this.props;

    this.setState({
      selectedDate: null,
      fullCalendar: true,
    });
    dispatch(
      clearEvents()
    )
  }

  getEventsList(selectedFilterCalendar) {
    const {
      dispatch,
      user,
      ownerID,
      accessToken,
    } = this.props;

    const {
      fullCalendar,
      activeMonth,
    } = this.state;

    this.fetchEventsListFetcher = dispatch(
      fetchRelatedEventsWithStore(
        accessToken,
        {
          isOpen: fullCalendar,
          activeMonth: activeMonth.unix(),
        },
        {
          group: FILTER_OWNED,
          __GET: {
            role: 'place',
            expired: 1,
            take: 'ALL',
            user: ownerID ? ownerID : user.id,
            filters: selectedFilterCalendar ? [selectedFilterCalendar] : null
          },
        },
      )
    );

    this.fetchEventsListFetcher
      .finally(() => {
        if ( ! this.fetchEventsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      })
  }

  getEventsListUnderCalendar(interval, selectedFilterCalendar) {
    const {
      dispatch,
      user,
      ownerID,
      accessToken,
    } = this.props;

    dispatch(
      fetchEventsWithStore(
        accessToken,
        {
          group: FILTER_OWNED,
          __GET: {
            filters: selectedFilterCalendar ? [selectedFilterCalendar] : null,
            role: 'place',
            user: ownerID ? ownerID : user.id,
            expired: 1,
            since: !selectedFilterCalendar ? {
              until: interval ? interval.until : null,
            } : null,
            until: !selectedFilterCalendar ? {
              since: interval ? interval.since : null,
            } : null,
          },
        },
      )
    )
  }

  transformKeyInDate(i, eventsDetails) {
    const {
      activeMonth,
      fullCalendar,
    } = this.state;

    const month = fullCalendar? activeMonth : moment();
    const dayOfWeek = moment().day() === 0
      ? 7
      : moment().day();

    const key = fullCalendar
      ? i - 1 + moment.localeData().firstDayOfWeek()
      : moment().date() + i - dayOfWeek - 1 + moment.localeData().firstDayOfWeek();

    const prevMonth = moment(month).subtract(1, 'month');
    const nextMonth = moment(month).add(1, 'month');

    const firstDayOfMonthWeekDay = moment(month).startOf('month').day() > 0
    ? moment(month).startOf('month').day()
    : 7;

    const prevMonthDays = moment(prevMonth).daysInMonth() - firstDayOfMonthWeekDay + key + 1;

    const currentMonthDays = key - firstDayOfMonthWeekDay + 1;

    const nextMonthdays = key - firstDayOfMonthWeekDay - moment(month).daysInMonth() + 1;

    let formatedDate;
    let formatedMonth;
    let isCurentMonth = true;

    if(fullCalendar){
      if(key < firstDayOfMonthWeekDay){
        isCurentMonth = false;
        formatedDate = prevMonthDays;
        formatedMonth = moment(prevMonth);
      } else {
        if(key - firstDayOfMonthWeekDay >= moment(month).daysInMonth()){
          isCurentMonth = false;
          formatedDate = nextMonthdays;
          formatedMonth = moment(nextMonth);
        } else {
          formatedDate = currentMonthDays;
          formatedMonth = moment(month);
        }
      }
    } else {
      if(key < 1){
        isCurentMonth = false;
        formatedDate = prevMonthDays + firstDayOfMonthWeekDay - 1;
        formatedMonth = moment(prevMonth);
      } else {
        if(key > moment(month).daysInMonth()){
          isCurentMonth = false;
          formatedDate = nextMonthdays + firstDayOfMonthWeekDay - 1;
          formatedMonth = moment(nextMonth);
        } else {
          formatedDate = key;
          formatedMonth = moment(month);
        }
      }
    }

    const monthVal = moment(month).month() + 1;
    const year = moment(month).year();
    const selectedDate = moment.utc(
      `${monthVal}-${formatedDate}-${year}`,
      'MM-DD-YYYY'
    );

    const dayInterval = {
      since: moment(selectedDate).unix(),
      until: moment(selectedDate).add(24, 'hours').subtract(1, 'second').unix()
    };

    const allEventsOrdered = eventsDetails.sort((s, v) => {
      return s.going === v.going? 0 : s.going? -1 : 1
    });

    const eventImg = eventsDetails.filter(e => {
      if (e.days.length) {
        return null
      } else {
        return (
          e.sinceUTC <= dayInterval.until &&
          e.untilUTC >= dayInterval.since &&
          isCurentMonth
        )
      }
    });

    const nearlyEventImg = this.closestEvent(
      moment(selectedDate).unix(),
      eventImg
    );

    const currentKeyDate = fullCalendar? currentMonthDays : key;
    const orderedEvents = allEventsOrdered.filter(e => {
      if (e.days.length) {
        return null
      } else {
        return (
          e.sinceUTC <= dayInterval.until &&
          e.untilUTC >= dayInterval.since &&
          isCurentMonth
        )
      }
    });

    const isPastDate = moment(selectedDate).startOf('day').utc().isBefore(moment().startOf('day').utc())

    return (
      <div
        className={
          classes(
            s.details,
            {[s.currentDate]: currentKeyDate === moment().date()},
            {[s.otherMonth]: !isCurentMonth},
            {[s.pastDate]: isPastDate},
            {[s.color]: this.state.selectedDate &&
              moment(this.state.selectedDate).isSame(selectedDate, 'day')
            },
          )
        }
        onClick={() => {
            this.setState({
              selectedDate: selectedDate,
              fullCalendar: false,
              dayInterval
            });
            this.getEventsListUnderCalendar(dayInterval);
        }}
      >
        {
          nearlyEventImg && (
            <img
              className={s.dateImg}
              src={nearlyEventImg.image}
              alt=''
            />
          )
        }

        {
          nearlyEventImg &&
          (<div className={s.imageCover} />)
        }
        <p
          className={classes(s.date, {
            [s.withEvent]: !!nearlyEventImg
          })}
        >
          {formatedDate}
        </p>
        <p
          className={classes(s.monthName, {
            [s.withEvent]: !!nearlyEventImg
          })}
        >
          {moment(formatedMonth).format('MMM')}
        </p>
        <div className={s.pointers}>
          {
            orderedEvents.slice(0,5).map((e, i) => {
              const relatedEvent = eventImg.some(rel => rel.id === e.id);
              return (
                <div
                  key={i}
                  className={classes(
                    s.point,
                    {[s.related]: relatedEvent},
                    {[s.withEvent]: !!nearlyEventImg}
                  )}>
                </div>
              )
            })
          }
          {
            orderedEvents.length > 5 && (
              <i className={classes(
                "icon-plus",
                s.plusPoint,
                {[s.withEvent]: !!nearlyEventImg}
              )}/>
            )
          }
        </div>
      </div>
    )
  }

  closestEvent(num, arr = []) {
    if(!!arr.length){
      let curr = arr[0];
      let diff = Math.abs(num - curr.sinceUTC);
      forEach(arr, val => {
        let newdiff = Math.abs(num - val.sinceUTC);
        if (newdiff < diff) {
            diff = newdiff;
            curr = val;
        }
      })

      return curr;
    }

    return false;
  }

  shareCalendar(statusCalendar) {
    const {
      dispatch,
      accessToken
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/calendar/change-status`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: appendToFormData(
            new FormData(),
            {
              status: statusCalendar
            }
          )
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed to set calendar.')
            );
        }
      })
      .then(() => {
        window.location.reload();
      })
  }


  clipBoard() {
    const el = document.createElement('textarea');

    this.setState({
      clipBoardWasClicked: true
    }, () => {
      el.value = `${config.uiUrl}/places/calendar-${this.props.user.placeDetails.name}-${this.props.user.placeDetails.id}`;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    })
  }

  checkIfIncludesDays(days, number)
  {
    let check = false;

    days.forEach(day => {
      if (day.day === number) {
        check = true;
      }
    });

    return check;
  }

  /**
   * Dublicate event
   * 
   * @param {object} event - The event details 
   */
  dublicateEvent(event)
  {
    let dublicatedEvents = [];
    let now = moment.unix(event.since);

    while (now.isSameOrBefore(moment.unix(event.until))) {
      if (this.checkIfIncludesDays(
        event.days, now.day()
      )) {
        dublicatedEvents.push(
          {
            id: event.id,
            days: event.days,
            going: event.going,
            sinceUTC: now.unix(),
            since: now.unix(),
            until: now.unix(),
            untilUTC: now.unix(),
            gallery: event.gallery
          }
        );
      }

      now.add(1, 'days');
    }

    return dublicatedEvents;
  }

  /**
   * Multiplicate events with changed since/until
   * 
   * @param {collection} events - The list of events
   */
  multiplicateEventsWithDays(events)
  {
    let multiplicatedEvents = [];

    events.forEach(event => {
      if (event.days.length > 0) {
        multiplicatedEvents = multiplicatedEvents.concat(
          this.dublicateEvent(event)
        );
      } else {
        multiplicatedEvents.push(event);
      }
    });

    return multiplicatedEvents;
  }

  render() {
    const {
      activeMonth,
      fullCalendar,
      eventsList,
      isLoaded,
      selectedDate,
      dayInterval,
      showFilterModal
    } = this.state;

    const {
      calendarIsOpen,
      ownerID,
      location
    } = this.props;

    const isMobile = this.getUIVersion();
    const firstDayOfMonthWeekDay = moment(activeMonth).startOf('month').day() > 0
    ? moment(activeMonth).startOf('month').day()
    : 7;

    const nrOfDaysFull = moment(activeMonth).daysInMonth() + firstDayOfMonthWeekDay - moment.localeData().firstDayOfWeek();

    const numberOfDaysNextMonth = nrOfDaysFull > 35
    ? 42 - nrOfDaysFull
    : 35 - nrOfDaysFull;

    const numberOfDays = fullCalendar
      ? nrOfDaysFull + numberOfDaysNextMonth
      : 7;

    const weekDaysArray = moment.weekdays(true);
    const days = Array.apply(null, Array(numberOfDays))

    const eventsDetails = this.multiplicateEventsWithDays(eventsList).map(({
        id,
        days,
        going,
        sinceUTC,
        since,
        until,
        untilUTC,
        gallery,
      }) => ({
        id,
        days,
        going,
        since: moment.unix(since),
        sinceUTC,
        until: moment.unix(until),
        untilUTC,
        image: gallery.images.find(i => i.default).src,
      }));

    return (
      <div>
        <div className={classes(s.root, {
          [s.mobile]: isMobile,
          [s.calendarIsOpen]: calendarIsOpen,
        })}>
          <div className={classes(s.head, {[s.haveRevert]: !!selectedDate})}>
            {
              fullCalendar && (
                <div className={s.calendarNavigation}>
                  <button
                    className={`${s.prevArrow} icon-angle-down`}
                    onClick={() => {
                      this.setState({
                        activeMonth: moment(activeMonth).subtract(1, 'month')
                      }, () => {
                        this.getEventsList();
                      })
                    }}
                  />
                  <p className={s.monthName}>
                    {moment(activeMonth).format('MMMM YYYY')}
                  </p>
                  <button
                    className={`${s.nextArrow} icon-angle-down`}
                    onClick={() => {
                      this.setState({
                        activeMonth: moment(activeMonth).add(1, 'month')
                      }, () => {
                        this.getEventsList();
                      })
                    }}
                  />
                </div>
              )
            }
            {
              (!!selectedDate &&  (
                <button
                  onClick={()=>{this.resetCalendar()}}
                  className={classes(s.revert,'btn')}
                >
                  Clear filter
                </button>
              )) || (location.pathname.indexOf('profile') >= 0 &&(
                  <div className={s.buttons}>
                    <button
                      className='edit round-button'
                      onClick={() => this.setState({showFilterModal: true})}
                    />
                    <OverlayTrigger placement="bottom" overlay={
                      <Tooltip id="tooltip">
                        {I18n.t('general.elements.showCalendar')}
                      </Tooltip>
                    }>
                      <button
                        className={classes(s.shareButton, s.copyLink, {[s.activated]: this.state.clipBoardWasClicked})}
                        onClick={() => this.clipBoard()}
                      >
                        <i className="icon-link" />
                      </button>
                    </OverlayTrigger>
                    <button
                      className={classes('remove round-button', s.remove)}
                      onClick={() => {
                        this.shareCalendar(false)
                      }}
                    />
                  </div>
              ))
            }
          </div>
          <div className={s.body}>
            {
              (isLoaded && (
                <div className={s.weekDaysLabel}>
                  {
                    weekDaysArray.map((day, i) => {
                      return (
                        <div
                          key={i}
                          className={classes(s.item, {
                          [s.mobile]: isMobile
                          })}
                        >
                          {day}
                        </div>
                      )
                    })
                  }
                </div>
              )) || (
                <Loader className={s.loader} sm contrast/>
              )
            }
            <div className={s.daysBox}>
              {
                days.map((n, i) => {
                  return (
                    <div
                      key={i}
                      className={classes(s.dayItem, {
                        [s.mobile]: isMobile
                      })}
                    >
                      {this.transformKeyInDate(i+1, eventsDetails)}
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className={s.footer}>
            <button
              className={classes("calendar round-button", {
                "open": fullCalendar
              })}
              onClick={() => {
                this.setState({
                  fullCalendar: !fullCalendar
                }, () => {
                  this.getEventsList();
                })
              }}
            />
          </div>
        </div>

        {
          !fullCalendar &&(
            <EventsList
              ownerID={ownerID}
              interval={dayInterval}
            />
          )
        }

        {
          showFilterModal &&(
            <Popup  onClose={() => this.setState({showFilterModal: false})}>
              <PopupContent
                onSuccess={() => this.setState({showFilterModal: false})}
              />
            </Popup>
          )
        }

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    UIVersion: state.app.UIVersion,
    eventsList: state.calendar.events,
    activeMonth: state.calendar.activeMonth,
    calendarIsOpen: state.calendar.isOpen,
    user: state.user,
    selectedFilterCalendar: state.navigation.selectedFilterCalendar,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Calendar)));
