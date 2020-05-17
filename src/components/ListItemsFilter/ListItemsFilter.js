import React, { Component } from 'react';
import { connect } from "react-redux";
import moment from 'moment';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ListItemsFilter.scss';
import PlacesAutocomplete from '../_inputs/PlacesAutocomplete';
import TimeRangePicker from '../../components/TimeRangePicker';
import { I18n } from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../actions/app';
import { getCurrentPosition } from '../../helpers/geo';

class ListItemsFilter extends Component {
  static defaultProps = {
    hasRange: false,
    hasSearchBox: false,
    hasDistanceRange: false,
    intervalValue: null,
    onCancelLocationchange: () => {}
  };

  constructor(props, context) {
    super(props, context);

    const interval = this.props.intervalValue;

    this.state = {
      distanceRangeValue: {},
      location: null,
      locationUser: false,
      latitude: null,
      longitude: null,
      rangeSince: interval? interval.since : moment().unix(),
      rangeUntil: interval? interval.until : moment().add(1, "day").unix(),
    };

    this.setDistance = this.setDistance.bind(this);
  };

  componentDidMount() {
    const { userLocation } = this.props;
    this.currentPositionGetter = getCurrentPosition();

    if (this.currentPositionGetter) {
        this.currentPositionGetter
            .then(({latitude, longitude}) => {
                    this.setState({
                        locationUser: !!latitude,
                        latitude,
                        longitude,
                    });
                }
            );
    }

    if (userLocation) {
      this.setState({
        locationUser: !!userLocation[0]
      });
    }
  }

  componentWillReceiveProps(nextProps) {
      const interval = nextProps.intervalValue;
      if(!!interval) {
        this.setState({
          rangeSince: interval.since,
          rangeUntil: interval.until
        })
      }
  }

  componentWillUnmount() {
    if (this.currentPositionGetter instanceof Promise) {
        this.currentPositionGetter.cancel();
    }
  }

  setDistance(value){
    this.setState({
      distanceRangeValue: value.target.value
    }, () => {
      this.props.changeDistanceRange(this.state.distanceRangeValue)
    });
  }

  getInterval () {
    const { rangeSince, rangeUntil } = this.state;
    const since = rangeSince? rangeSince.unix() : null;
    const until = rangeUntil? rangeUntil.unix() : null;
    return this.props.interval(since, until)
  }

  render() {
    const {
      hasRange,
      hasSearchBox,
      hasDistanceRange,
      onCancelLocationchange,
      userLocation,
      distance,
      UIVersion,
    } = this.props;

    const {
      distanceRangeValue,
      locationUser,
      latitude,
      longitude,
      rangeSince,
      rangeUntil
    } = this.state;

    return (
      <div className={classes(s.root, {
        [s.mobile]: UIVersion === MOBILE_VERSION
      })}>
        {
          hasSearchBox && (
            <div className={s.searchInput}>
              <label htmlFor="filter.searchInput">
                {
                  I18n.t('general.components.listFilter.searchLabel')
                }
              </label>
                <PlacesAutocomplete
                    className="form-control"
                    value={userLocation.length ? userLocation[0].label : ''}
                    placeholder={I18n.t('general.components.listFilter.placeholder')}
                    restrictions={{types: ['(cities)']}}
                    locationUser={userLocation}
                    updateOnInputChange={false}
                    geoLat={latitude}
                    geoLng={longitude}
                    onChange={location => {
                      this.setState({
                        location,
                        locationUser: true
                      }, () => {
                        this.props.getLocation(location)
                      })
                    }}
                />

                {
                  !!locationUser ? (
                    <p
                      className={s.onCancelPlaceChange}
                      onClick={() => {
                        document.getElementById('autocompleteInput').value = '';
                        this.setState({
                          location: null,
                          locationUser: false
                        }, () => onCancelLocationchange())
                      }}
                    />
                  ) : (
                    <p className={s.disabled}/>
                  )
                }
            </div>
          )
        }
        {
          hasDistanceRange && (
            <div className={classes(
              s.selectRange, {
                [s.disabled]: !locationUser,
              })
            }>
              <label htmlFor="filter.rangeSelect">
                {
                  I18n.t('general.components.listFilter.rangeLabel')
                }
              </label>
              <select
               id="filter.rangeSelect"
               onChange={this.setDistance}
               value={distance || distanceRangeValue}
               disabled={!locationUser}
              >
                 <option value="3">3 km</option>
                 <option value="25">25 km</option>
                 <option value="50">50 km</option>
                 <option value="100">100 km</option>
                 <option value="200">200 km</option>
                 <option value="400">400 km</option>
                 <option value="800">800 km</option>
                 <option value="1600">1600 km</option>
              </select>
            </div>
          )
        }
        {
            hasRange && (
                <TimeRangePicker
                    hasInterval
                    enablePrevDaysToNow
                    defaultStart={rangeSince}
                    defaultEnd={rangeUntil}
                    inputClass={s.oneColumn}
                    contentClass={s.timePickerContent}
                    imputDateTimeFormat={'DD/MM/YYYY'}
                    datePickerFormat={'DD/MM/YYYY'}
                    onChange={(rangeSince, rangeUntil) => {
                        this.setState({
                            rangeSince,
                            rangeUntil,
                        }, () => {
                            this.getInterval();
                        });
                    }}
                />
            )
        }
      </div>
    );
  }
}

function mapStateToProps(store) {
    return {
      UIVersion: store.app.UIVersion,
      userLocation: store.auth.isAuthenticated ? store.user.locations : false,
    };
}

export default connect(mapStateToProps)(withStyles(s)(ListItemsFilter));
