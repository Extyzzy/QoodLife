import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from 'classnames';
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import { MOBILE_VERSION } from '../../actions/app';
import s from './TimeRangePicker.scss';

class TimeRangePicker extends Component {
  static defaultProps = {
    hasInterval: false,
    enablePrevDaysToNow: false,
    datePickerFormat: false,
    timePickerFormat: false,
    intervalLength: false, //should be number of days
    imputDateTimeFormat: 'DD/MM/YYYY hh:mm A',
    defaultStart: null,
    defaultEnd: null
  };

  constructor(props, context) {
    super(props, context);
    const { defaultStart, defaultEnd, timePickerFormat } = this.props;

    this.state = {
      selectedstart: defaultStart? moment.unix(defaultStart) : null,
      selectedEnd: defaultEnd
        ? timePickerFormat
          ? moment.unix(defaultEnd)
          : moment.unix(defaultEnd).utc()
        : null,
      startViewMode: 'days',
      endviewMode: 'days',
      startIsChecked: false,
      endIsChecked: false,
      displayCalendars: false,
      hasRange: true,
      extended: false,
    };

    this.handleOutsideClick = this.handleOutsideClick.bind(this);
  };

  componentWillReceiveProps(nextProps) {
    const { defaultStart, defaultEnd, timePickerFormat } = nextProps;

      this.setState({
        selectedstart: defaultStart? moment.unix(defaultStart) : null,
        selectedEnd: defaultEnd
          ? timePickerFormat
            ? moment.unix(defaultEnd)
            : moment.unix(defaultEnd).utc()
          : null,
      })
  }

  getUIVersion() {
    const { UIVersion } = this.props;

    if(UIVersion === MOBILE_VERSION){
      return true
    }

    return false;
  }

  handleClick(block) {
    const { displayCalendars } = this.state;

    if (!displayCalendars) {
      document.addEventListener('click', this.handleOutsideClick, false);
    } else {
      document.removeEventListener('click', this.handleOutsideClick, false);
    }

    this.setState({
      displayCalendars: !displayCalendars,
      startIsChecked: displayCalendars && false,
      endIsChecked: displayCalendars && false,
    });
  }

  handleOutsideClick(e) {
    if(this.node !== null){
      const isInside = this.node.compareDocumentPosition(e.target);

      if (isInside >= 20 || isInside === 0 ) {
        return false;
      } else {
        this.handleClick();
      }
    }
  }

  render() {
    const {
      selectedstart,
      selectedEnd,
      startIsChecked,
      endIsChecked,
      displayCalendars,
      hasRange,
      startViewMode,
      endviewMode,
    } = this.state;

    const {
      imputDateTimeFormat,
      timePickerFormat,
      datePickerFormat,
      enablePrevDaysToNow,
      intervalLength,
      hasInterval,
      inputClass,
      extended,
    } = this.props;

    const startDateWithoutHour = moment(selectedstart).format('DD/MM/YYYY');
    const endDateWithoutHour = moment(selectedEnd).format('DD/MM/YYYY');
    const oneDayRange = startDateWithoutHour === endDateWithoutHour;

    const startDateHour = moment(selectedstart).hour();
    const endDateHour = moment(selectedEnd).hour();
    const oneHourRange = startDateHour === endDateHour;
    return (
      <div
        className={classes(
          s.root,
          {[s.noTime]: !!timePickerFormat},
          {[s.mobile]: this.getUIVersion()}
        )}
      >
        <div
          className={classes(inputClass, s.dateInput, {
            [s.singleCalendar]: !hasInterval,
          }, {
            [s.noTime]: !!timePickerFormat
          }, {
            [s.mobile]: this.getUIVersion()
          }, {
            [s.open]: displayCalendars
          })}
          onClick={() => this.handleClick()}
        >
          <div className={classes(s.data, {
            [s.open]: displayCalendars
          })}>
            <i className='icon-calendar-o' />
            <p>
              {
                (selectedstart && (
                  moment(selectedstart).format(imputDateTimeFormat)
                )) || 'select date'
              }
            </p>
          </div>
          <i className={classes('icon-arrow-right', s.intervalArrow, {
            [s.open]: displayCalendars
          })}/>
          <div className={classes(s.data, {
            [s.open]: displayCalendars
          })}>
            <i className='icon-calendar-o' />
            <p>
              {
                (selectedEnd && hasInterval && (
                  moment(selectedEnd).format(imputDateTimeFormat)
                )) || 'select date'
              }
            </p>
          </div>
        </div>
        {
          displayCalendars && (
          <div
            ref={node => { this.node = node; }}
            className={classes(
              s.content,
              {[s.mobile]: this.getUIVersion()},
              {[s.noTime]: !timePickerFormat},
              {[s.extended]: extended}
            )}
          >
            <Datetime
              className={classes(
                s.calendarBody,
                {[s.mobile]: this.getUIVersion()},
              )}
              value={selectedstart}
              viewMode={'days'}
              defaultValue={moment()}
              disableOnClickOutside={true}
              dateFormat={datePickerFormat}
              timeFormat={timePickerFormat}
              input={false}
              onViewModeChange={(startViewMode) =>
                this.setState({startViewMode})
              }
              renderDay={(props, currentDate) => {
                const dayInInterval = moment(selectedstart).isBefore(currentDate) &&
                moment(selectedEnd).isAfter(currentDate);

                if(dayInInterval){
                  props.className= `rdtDay ${s.intervalDay}`;
                }
                return (
                  <td {...props} >
                    {currentDate.date() }
                  </td>
                )
              }}

              onChange={date => {
                const isSomeDay = !!selectedstart
                  && moment(date).date() === moment(selectedstart).date()
                  && startViewMode === 'days';

                const intervalStart = isSomeDay
                ? null
                : date;

                const intervalEnd = isSomeDay
                ? null
                : moment(selectedEnd).isBefore(date)
                    ? moment(date).add(1, 'minute')
                    : selectedEnd;

                this.setState({
                  startIsChecked: true,
                  selectedstart: intervalStart,
                  selectedEnd: intervalEnd,
                });

                this.props.onChange(intervalStart, intervalEnd);

                if(endIsChecked){
                  this.handleClick()
                }
              }}

              isValidDate={current => {
                if(enablePrevDaysToNow){
                  return true
                } else {
                  return (
                    current.isAfter(
                      moment().subtract(1, 'day')
                    )
                  )
                }
              }}
            />

            { hasInterval && (
              <Datetime
                className={classes(
                  s.calendarBody,
                  {[s.mobile]: this.getUIVersion()},
                )}
                onViewModeChange={(endviewMode) =>
                  this.setState({endviewMode})
                }
                value={selectedEnd}
                defaultValue={moment().add(1, 'minute')}
                disableOnClickOutside={true}
                dateFormat={datePickerFormat}
                input={false}
                renderDay={(props, currentDate) => {
                  const dayInInterval = moment(selectedstart).isBefore(moment(currentDate).add(1, 'day')) &&
                  moment(selectedEnd).isAfter(moment(currentDate).add(1, 'day'));

                  if(dayInInterval){
                    props.className= `rdtDay ${s.intervalDay}`;
                  }
                  return (
                    <td {...props} >
                      {currentDate.date() }
                    </td>
                  )
                }}
                {
                  ...(hasRange? {
                    timeFormat: timePickerFormat
                  } : {
                    timeFormat: false
                  })
                }
                onChange={date => {
                  const isSomeDay = !!selectedEnd
                    && moment(date).date() === moment(selectedEnd).date()
                    && endviewMode === 'days';

                  const intervalStart = isSomeDay
                  ? null
                  : selectedstart;

                  const intervalEnd = isSomeDay
                  ? null
                  : date;


                  this.setState({
                    endIsChecked: true,
                    selectedstart: intervalStart,
                    selectedEnd: intervalEnd,
                  });

                  this.props.onChange(intervalStart, intervalEnd);

                  if(startIsChecked){
                    this.handleClick()
                  }
                }}
                isValidDate={current => {
                  if(hasRange){
                    if(intervalLength){
                      return (
                        current.isBefore(
                          moment(selectedstart).add(intervalLength, 'day')
                        ) && current.isAfter(
                          moment(selectedstart).subtract(1, 'day')
                        )
                      )
                    }

                    return (
                      current.isAfter(
                        moment(selectedstart).subtract(1, 'day')
                      ))
                  }

                  return false
                }}
                timeConstraints={{
                  hours: {
                    min: (
                      oneDayRange
                        ? moment(selectedstart).hour()
                        : false
                    ),
                  },
                  minutes: {
                    min: oneDayRange && (
                      oneHourRange
                        ? moment(selectedstart).minute()
                        : false
                    ),
                  },
                }}
              />
            )}
          </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(withStyles(s)(TimeRangePicker));
