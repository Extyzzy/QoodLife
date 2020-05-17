import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { SIDEBAR_GROUP_RELATED } from '../../actions/navigation'
import { fetchRelatedEventsWithStore } from '../../actions/calendar';
import { MOBILE_VERSION } from '../../actions/app';
import { forEach } from 'lodash';
import Loader from "../Loader";
import moment from 'moment';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Calendar.scss';

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
      fullCalendar: false,
      isLoaded: false,
      selectedDate: null
    };
  };

  componentDidMount() {
    const interval = this.getEventsInterval();
    this.getEventsList(interval);
  }

  componentWillReceiveProps(nextProps) {
    const { eventsList, activeMonth, intervalWasChanged } = nextProps;

    this.setState({
      eventsList,
      activeMonth: moment.unix(activeMonth),
      ...(intervalWasChanged? {
        selectedDate: null } :  {})
    })
  }

  componentWillUnmount() {
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
    this.setState({
      selectedDate: null,
    });
    this.props.onDateChange();
  }

  getEventsList(interval) {
    const {
      dispatch,
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
          navigation: {
            sidebarOpenedGroup: SIDEBAR_GROUP_RELATED,
          },
          __GET: {
            calendar: 1,
            expired: 1,
            since: {
              until: interval.until,
            },
            until: {
              since: interval.since,
            },
            take: 'ALL',
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

  getEventsInterval(){
    const { activeMonth, fullCalendar } = this.state;
    let since;
    let until;

    if(fullCalendar){
      //month
      const monthStart = moment(activeMonth).utc().startOf('month');
      const monthEnd = moment(activeMonth).utc().endOf('month');

      const prevMonthDaysNr = moment(monthStart).day();
      const nextMonthDaysNr = 6 - moment(monthEnd).day() + moment.localeData().firstDayOfWeek();

      const prevDays = prevMonthDaysNr === 0
      ? 6
      : moment(monthStart).day() - 1;

      const nextdays = nextMonthDaysNr === 7
      ? 1
      : nextMonthDaysNr;

      since = moment(monthStart).startOf('month').subtract(prevDays, 'days').unix();
      until = moment(monthEnd).add(nextdays, 'days').unix();
    } else {
      //one week
      since = moment().utc().startOf('week').unix();
      until = moment().utc().endOf('week').unix();
    }

    return {
      since,
      until,
    }
  }

  transformKeyInDate(i, eventsDetails){
    const {
      activeMonth,
      fullCalendar,
    } = this.state;

    const {
      history,
      onDateChange,
    } = this.props;

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

    const goingEvents = eventsDetails.filter(item => item.going);
    const allEventsOrdered = eventsDetails.sort((s, v) => {
      return s.going === v.going? 0 : s.going? -1 : 1
    });

    const eventImg = goingEvents.filter(e => {
      if (e.goingDate) {
        return (
          e.goingDate <= dayInterval.until &&
          e.goingDate >= dayInterval.since &&
          isCurentMonth
        )
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
      if (e.goingDate) {
        return (
          e.goingDate <= dayInterval.until &&
          e.goingDate >= dayInterval.since &&
          isCurentMonth
        )
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
            });
            if(history.location.pathname === '/events'){
              onDateChange(dayInterval);
            } else {
              history.push('/events', dayInterval);
            }
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

  render() {
    const {
      activeMonth,
      fullCalendar,
      eventsList,
      isLoaded,
      selectedDate
    } = this.state;

    const {
      calendarIsOpen
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

    const eventsDetails = eventsList.map(({
      id,
      going,
      sinceUTC,
      since,
      until,
      untilUTC,
      gallery,
      days,
      goingDate
    }) => ({
      id,
      going,
      since: moment.unix(since),
      sinceUTC,
      until: moment.unix(until),
      untilUTC,
      days,
      goingDate,
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
              ! isMobile && (
                <h4>My Calendar</h4>
              )
            }
            {
              fullCalendar && (
                <div className={s.calendarNavigation}>
                  <button
                    className={`${s.prevArrow} icon-angle-down`}
                    onClick={() => {
                      this.setState({
                        activeMonth: moment(activeMonth).subtract(1, 'month')
                      }, () => {
                        const interval = this.getEventsInterval();
                        this.getEventsList(interval);
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
                        const interval = this.getEventsInterval();
                        this.getEventsList(interval);
                      })
                    }}
                  />
                </div>
              )
            }
            {
              !!selectedDate &&  (
                <button
                  onClick={()=>{this.resetCalendar()}}
                  className={classes(s.revert, 'btn', {
                    [s.revertMobile]: isMobile,
                  })}
                >
                  Clear filter
                </button>
              )
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
                  const interval = this.getEventsInterval();
                  this.getEventsList(interval);
                })
              }}
            />
          </div>
        </div>
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
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Calendar)));
