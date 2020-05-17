import React, {Component} from 'react';
import PropTypes from 'prop-types';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Map.scss';

import fancy from '../../../../../../../styles/fancy-map.json';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

class Map extends Component {
  static propTypes = {
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
  };

  render() {
    const {
      data,
      center,
      defaultImage,
    } = this.props;

    return (
      <GoogleMap
        onClick={() => {
          this.setState({
            activeMarker: null,
          })
        }}
        defaultZoom={14}
        defaultCenter={center}
        defaultOptions={{styles: fancy}}
      >
        <Marker
          key={data.id}
          position={{
            label: data.location.label,
            lat:  data.location.latitude,
            lng: data.location.longitude,
          }}
        >
            <InfoBox
              options={{
                alignBottom: true,
                closeBoxURL: "",
                enableEventPropagation: true,
              }}
            >
              <div
                style={{cursor: 'default'}}
                className={s.container}
              >
                <div className={s.image}>
                  <img src={defaultImage.src} alt={''}/>
                </div>

                <div className={s.title}>{data.location.label}</div>

                <div className={s.triangle}>
                  <div className={s.left}>
                    <div className={s.leftInner}/>
                  </div>
                  <div className={s.right}>
                    <div className={s.rightInner}/>
                  </div>
                </div>
              </div>
            </InfoBox>
        </Marker>
      </GoogleMap>
    )
  }
}

export default (withScriptjs(withGoogleMap(withStyles(s)(Map))))

