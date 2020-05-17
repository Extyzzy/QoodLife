import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Map.scss';

import fancy from '../../../../../../styles/fancy-map.json';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker
} from 'react-google-maps';

class Map extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    }).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      activeMarker: props.markerId,
    };
  };

  render() {
    const {
      data,
      center,
    } = this.props;

    const {
      activeMarker,
    } = this.state;

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
        {
          data.map((data, index) => {
            const {
              id: eventId,
              location,
              title,
              gallery,
              hobbies,
              dateStart,
            } = data;

            const image = gallery.images.find(i => i.default).src;

            return (
              <Marker
                key={eventId}
                position={{
                  label: location.label,
                  lat: location.latitude,
                  lng: location.longitude,
                }}
                onClick={() => {
                  this.setState({
                    activeMarker: activeMarker ? null : eventId,
                  });
                }}
              >
                {
                  activeMarker === eventId && (
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
                        onClick={() => {
                          this.setState({
                            activeMarker: eventId,
                          });
                        }}
                      >
                        <div className={s.image}  >
                          <img src={image} alt={title}/>
                        </div>

                        <div className={s.dayEvent}>
                          <div>{moment(dateStart, 'X').format('ddd')}</div>

                          <div className={s.day}>
                            {moment(dateStart, 'X').format('D')}
                          </div>

                          <div>{moment(dateStart, 'X').format('MMM')}</div>

                          <div className={s.category}>
                            {hobbies.map(h => h.name).join(', ')}
                          </div>
                        </div>

                        <div className={s.title}>{title}</div>

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
                  )
                }
              </Marker>
            );
          })
        }
      </GoogleMap>
    )
  }
}

export default (withScriptjs(withGoogleMap(withStyles(s)(Map))))
