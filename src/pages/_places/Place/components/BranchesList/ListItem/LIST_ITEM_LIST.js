import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Popup from "../../../../../../components/_popup/Popup/Popup";
import Map from "./Map";
import s from "../BranchesList.scss";
import PopupContent from "./PopupContent";
import config from "../../../../../../config";

const ListItem = ({
  data,
  name,
  defaultImage,
  onPopupClose,
  openPopup,
  showPopup,
  moveDownImage,
  moveUpImage,
  activeImage,
  activeImageIndex,
  onImageSelect,
  onMapClick,
  onMapClickClose,
  showPopupMap,
}) => (
  <div className={s.list}>
    <div className={s.img}>
      <img
        src={defaultImage.src}
        onClick={openPopup}
        alt=""
      />
    </div>
    <div className={s.details}>

      <div>
        <i className="icon-map-marker" />
        <a href='#' onClick={onMapClick}>
          {data.location.label}
        </a>
      </div>

      <div>
        <i className="icon-clock" />
          <span>{data.schedule}</span>
        </div>

      <div className={s.description}>
        <div><i className="icon-info" /></div>
        <div
          id='links'
          className={s.content}
          dangerouslySetInnerHTML={{__html: data.description}}
        />
      </div>

    </div>

    {
      showPopup && (
        <Popup onClose={onPopupClose}>
          <PopupContent
            data={data}
            defaultImage={activeImage}
            name={name}
            moveDownImage={moveDownImage}
            moveUpImage={moveUpImage}
            activeImageIndex={activeImageIndex}
            onImageSelect={onImageSelect}
          />
        </Popup>
      )
    }

    {
      showPopupMap && (
        <Popup onClose={onMapClickClose}>
          <div className={s.divMap}>
            <Map
              center={{lat: data.location.latitude, lng: data.location.longitude}}
              data={data}
              containerElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
              mapElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
              loadingElement={<div />}
              googleMapURL={config.googleMapsApiV3Url}
              defaultImage={activeImage}
            />
          </div>
        </Popup>
      )
    }
  </div>
);

export default withStyles(s)(ListItem);
