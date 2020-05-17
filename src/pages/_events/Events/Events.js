import React, { Component } from "react";
import PropTypes from "prop-types";
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Events.scss";
import config from '../../../config';
import { MOBILE_VERSION } from '../../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE } from '../../../constants';
import Layout from "../../../components/_layout/Layout";
import Loader from "../../../components/Loader";
import Map from './components/MapSwitch/Map';
import MobileAdsCarousel from '../../../components/MobileAdsCarousel';
import ViewModeSwitcher from '../../../components/ViewModeSwitcher';
import ComponentsList from "../../../components/ComponentsList";
import ListItemsFilter from "../../../components/ListItemsFilter";
import Calendar from '../../../components/Calendar';
import EventsListItem from "./components/ListItem";

class Events extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    events: PropTypes.array.isRequired,
    onItemComponentWillUnmount: PropTypes.func,
    onItemPopupComponentWillUnmount: PropTypes.func,
    showItemOwnerDetails: PropTypes.bool,
    itemActionButtons: PropTypes.func,
    itemPopupActionButtons: PropTypes.func,
    showLoadMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
    interval: PropTypes.func,
  };

  render() {
    const {
      isFetching,
      isLoaded,
      events,
      setDateInterval,
      onItemComponentWillUnmount,
      onItemPopupComponentWillUnmount,
      showItemOwnerDetails,
      itemActionButtons,
      itemPopupActionButtons,
      viewMode,
      onChangeViewMode,
      showLoadMore,
      onLoadMore,
      loadingMore,
      UIVersion,
      filterIntervalSince,
      changeDistanceRange,
      onSetDefaultLocation,
      intervalValue,
      latitude,
      longitude,
      interval,
      location,
      distance,
      intervalWasChanged,
    } = this.props;

    const eventsGroups = chunk(events, DEFAULT_ADS_BLOCKS_FREQUENCE);

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
        viewSwitchMode={
          <ViewModeSwitcher
            className={s.viewModeSwitcher}
            modes={['list', 'map']}
            mode={viewMode}
            onChange={onChangeViewMode}
          />
        }
      >
        <div className={s.root}>
          <div className={s.header}>
            {
              isFetching && (
                <Loader className={s.loader} sm contrast/>
              )
            }
          </div>

          {
            isLoaded && (
              <div>
                {
                  this.props.isAuthenticated && (
                    <Calendar
                      onDateChange={setDateInterval}
                      intervalWasChanged={intervalWasChanged}
                    />
                  )
                }
                <div className={s.filter}>
                <ListItemsFilter
                  hasRange
                  hasSearchBox
                  hasDistanceRange
                  changeDistanceRange={changeDistanceRange}
                  onCancelLocationchange={onSetDefaultLocation}
                  geolocationIsAllowed={!!longitude}
                  getLocation={location}
                  interval={interval}
                  intervalValue={intervalValue}
                  location={events.map(data => (data.location))}
                  distance={distance}
                />
                {
                  events && events.length > 0 && (
                     <div className={s.viewModeSwitcher}>
                          {
                            UIVersion !== MOBILE_VERSION && (
                            <ViewModeSwitcher
                              className={s.viewModeSwitcher}
                              modes={['list', 'map']}
                              mode={viewMode}
                              onChange={onChangeViewMode}
                            />
                          )
                          }
                    </div>
                  )
                }
              </div>
                {
                  isLoaded && (
                      (events && events.length > 0 && (
                        <div>
                          {
                            (viewMode === 'map' && (
                              <div className={s.divMap}>
                                <Map
                                  googleMapURL={config.googleMapsApiV3Url}
                                  data={events}
                                  latitude={latitude}
                                  longitude={longitude}
                                  loadingElement={<div />}
                                  containerElement={<div className={s.containerElement} />}
                                  mapElement={<div className={s.mapElement} />}
                                />
                              </div>
                            )) || (
                              <div>
                                {
                                  eventsGroups.map((group, groupKey) =>
                                    <div key={groupKey}>
                                      <ComponentsList
                                        className={s.eventsList}
                                        component={EventsListItem}
                                        list={group}
                                        onComponentWillUnmount={
                                          onItemComponentWillUnmount
                                        }
                                        onPopupComponentWillUnmount={
                                          onItemPopupComponentWillUnmount
                                        }
                                        showOwnerDetails={showItemOwnerDetails}
                                        actionButtons={itemActionButtons}
                                        popupActionButtons={itemPopupActionButtons}
                                        filterIntervalSince={filterIntervalSince}
                                      />

                                      {
                                        showLoadMore &&
                                        groupKey+1 === eventsGroups.length && (
                                          <div className="text-center">
                                          <button
                                            className="btn btn-default"
                                            disabled={loadingMore}
                                            onClick={() => onLoadMore(groupKey)}
                                          >
                                          {
                                            loadingMore
                                            ? I18n.t('general.elements.loading')
                                            : I18n.t('general.elements.loadMore')
                                          }
                                          </button>
                                          </div>
                                        )
                                      }

                                      {
                                        UIVersion === MOBILE_VERSION &&
                                        group.length === DEFAULT_ADS_BLOCKS_FREQUENCE && (
                                          <MobileAdsCarousel blockIndex={groupKey}/>
                                        )
                                      }
                                    </div>
                                  )
                                }
                              </div>
                            )
                          }
                        </div>
                      )) || (
                        <p>
                          {I18n.t('events.eventsNotFound')}
                        </p>
                      )
                  )
                }
              </div>
            )
          }
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    isAuthenticated: store.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Events));
