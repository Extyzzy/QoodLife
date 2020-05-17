import React from 'react';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import Popup from "../../../../../components/_popup/Popup/Popup";
import PopupContent from "../PopupContent";
import EventsViewOnMap from "./Map/Map";
import config from '../../../../../config';

export const MapPopup = withStyles(s)(({
  data: {
    id: eventId,
    location,
  },
  eventsList,
  onPopupMapClose,
}) => (
  <Popup onClose={onPopupMapClose}>
    <div className={s.divMap}>
      <EventsViewOnMap
        markerId={eventId}
        center={{lat: location.latitude, lng: location.longitude}}
        data={eventsList}
        containerElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
        mapElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
        loadingElement={<div />}
        googleMapURL={config.googleMapsApiV3Url}
      />
    </div>
  </Popup>
));

export const ItemPopup = withStyles(s)(({
  data,
  onPopupClose,
  popupActionButtons,
  onPopupComponentWillUnmount,
}) => (
  <Popup onClose={onPopupClose}>
    <PopupContent
      data={data}
      actionButtons={
        popupActionButtons
      }
      onPopupComponentWillUnmount={
        onPopupComponentWillUnmount
      }
    />
  </Popup>
));
