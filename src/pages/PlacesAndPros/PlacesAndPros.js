import React, { Component } from "react";
import PropTypes from "prop-types";
import { chunk } from 'lodash';
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PlacesAndPros.scss";
import classes from "classnames";
import { MOBILE_VERSION } from '../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE_GRID } from '../../constants';
import Layout from '../../components/_layout/Layout';
import ListItemsFilter from "../../components/ListItemsFilter";
import Professionals from '../_professionals/Professionals';
import Places from '../_places/Places';
import ViewModeSwitcher from '../../components/ViewModeSwitcher';
import config from "../../config";
import Map from './components/MapSwitch/Map';

class PlacesAndPros extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    professionalsList: PropTypes.array.isRequired,
    placesList: PropTypes.array.isRequired,
    couldLoadMore: PropTypes.bool.isRequired,
    loadMorePros: PropTypes.func.isRequired,
    loadMorePlaces: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
  };

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      professionalsList,
      placesList,
      isLoadedPros,
      isLoadedPlaces,
      placesAreActive,
      professionalsAreActive,
      onSetDefaultLocation,
      latitude,
      longitude,
      distance,
      viewMode,
      UIVersion,
      changeDistanceRange,
      getLocation,
      onChangeViewModeSwitcher,
      loadMorePros,
      loadMorePlaces,
      couldLoadMorePlaces,
      loadingMorePlaces
    } = this.props;

    const placesGroupLength = chunk(placesList, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID).length;

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
      >
        <div className={classes(s.root, {
          [s.mobile]: UIVersion === MOBILE_VERSION,
        })}>
          <div className={s.filter}>
            <ListItemsFilter
              hasDistanceRange
              hasSearchBox
              changeDistanceRange={changeDistanceRange}
              onCancelLocationchange={onSetDefaultLocation}
              distance={distance}
              geolocationIsAllowed={!!longitude}
              getLocation={getLocation}
            />
            {
              (professionalsList || placesList) && (professionalsList.length || placesList.length) > 0 && (
                <div className={s.viewModeSwitcher}>
                  {
                    UIVersion !== MOBILE_VERSION && (
                      <ViewModeSwitcher
                        className={s.viewModeSwitcher}
                        modes={['list', 'icons', 'map']}
                        mode={viewMode}
                        onChange={onChangeViewModeSwitcher}
                      />
                    )
                  }
                </div>
              )
            }
          </div>
          {
            (viewMode === 'map' && (
              <div>
              {
                ((professionalsList || placesList) && (professionalsList.length || placesList.length) > 0 && (
                  <div className={s.divMap}>
                    <Map
                      googleMapURL={config.googleMapsApiV3Url}
                      dataPros={professionalsList}
                      dataPlaces={placesList}
                      latitude={latitude}
                      longitude={longitude}
                      loadingElement={<div />}
                      containerElement={<div className={s.containerElement} />}
                      mapElement={<div className={s.mapElement} />}
                    />
                  </div>
                )) || (
                  I18n.t('placesAndPros.notFound')
                )
              }
              </div>
            )) || (
              <div>
                {
                  professionalsAreActive && (
                    <div className={s.professionalsList}>
                      <h3>{I18n.t('placesAndPros.professionals')}</h3>
                      <Professionals
                        isFetching={isFetching}
                        isLoaded={isLoadedPros}
                        professionalsList={professionalsList}
                        placesGroupLength={placesGroupLength}
                        onLoadMore={loadMorePros}
                        showLoadMore={couldLoadMore}
                        loadingMore={loadingMore}
                        viewMode={viewMode}
                        UIVersion={UIVersion}
                      />
                    </div>
                  )
                }

                <hr />

                {
                  placesAreActive && (
                    <div className={s.placesList}>
                      <h3>{I18n.t('placesAndPros.places')}</h3>
                      <Places
                        isFetching={isFetching}
                        isLoaded={isLoadedPlaces}
                        placesList={placesList}
                        onLoadMore={loadMorePlaces}
                        showLoadMore={couldLoadMorePlaces}
                        loadingMore={loadingMorePlaces}
                        viewMode={viewMode}
                        UIVersion={UIVersion}
                      />
                    </div>
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

export default (withStyles(s)(PlacesAndPros));
