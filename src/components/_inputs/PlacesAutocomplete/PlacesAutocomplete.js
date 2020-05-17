import React from 'react';
import config from '../../../config';
import StandaloneAutocomplete from "./StandaloneAutocomplete";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PlacesAutocomplete.scss';

import {
  compose,
  withProps,
  lifecycle
} from "recompose";

import { withScriptjs } from "react-google-maps";

const PlacesAutocomplete = compose(
  withProps({
    googleMapURL: config.googleMapsApiV3Url,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillUnmount() {
      const restDiv = document.getElementsByClassName('pac-container pac-logo');
      if(!!restDiv[0]){
        restDiv[0].parentNode.removeChild(restDiv[0]);
      }
    },
    componentWillMount() {
      const refs = {};
      const {
        updateOnInputChange,
        restrictions,
        placeholder,
      } = this.props;

      this.setState({
        updateOnInputChange,
        restrictions,
        inputClassName: this.props.className,
        placeholder,
        defaultValue: this.props.value ? this.props.value : '',

        onAutocompleteMounted: ref => {
          refs.autocomplete = ref;
        },

        onInputChange: (e) => {
          this.props.onChange({
            label: !!e.target.value.length? e.target.value : null,
            latitude: null,
            longitude: null,
          });
        },

        onPlaceChanged: () => {
          const {
              locationUser,
              geoLat,
              geoLng
          } = this.props;
          const place = refs.autocomplete.getPlace();
          const userLocationCoords = locationUser? locationUser[0] : false;

          const placedata = {
            label: place.formatted_address,
            latitude: place.geometry ? place.geometry.location.lat(lat => lat) : (
              geoLat
              ? geoLat
              : userLocationCoords
                ? userLocationCoords.latitude
                : null
            ),
            longitude: place.geometry ? place.geometry.location.lng(lng => lng) : (
              geoLng
              ? geoLng
              : userLocationCoords
                ? userLocationCoords.longitude
                : null
            ),
            country_init: place.address_components ? place.address_components.find(c => c.types[0] === "country").short_name : null,
          };
          this.props.onChange(placedata);
        },
      })
    },
  }),
  withScriptjs,
)(props =>
  <div>
    <StandaloneAutocomplete
      ref={props.onAutocompleteMounted}
      bounds={props.bounds}
      onPlaceChanged={props.onPlaceChanged}
      restrictions={props.restrictions}
    >
      <input
        type="text"
        id="autocompleteInput"
        onFocus={e => e.target.select()}
        className={props.inputClassName}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        {...(props.updateOnInputChange
          ? {onChange: props.onInputChange}
          : {})
        }
      />
    </StandaloneAutocomplete>
  </div>
);

export default (withStyles(s)(PlacesAutocomplete));
