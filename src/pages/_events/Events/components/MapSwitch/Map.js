import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import React, {Component} from 'react';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../ListItem/Map/Map.scss';
import { connect } from 'react-redux';
import fancy from '../../../../../styles/fancy-map.json';
import Popup from '../../../../../components/_popup/Popup';
import PopupContent from '../PopupContent';
import PropTypes from "prop-types";

class Map extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      infoBox: null,
      popupIsOpened: null,
      userLocation: null,
      lat: null,
      lng: null,
    };
  };

  componentDidMount() {
    const {userLocation} = this.props;

    if (userLocation.length) {
        this.setState({
            userLocation: {
                lat: userLocation[0].latitude,
                lng: userLocation[0].longitude,
            },
        });
    }
  }

  render() {
    const {
      popupIsOpened,
      userLocation,
      lat,
      lng,
    } = this.state;

    const {
      data,
      latitude,
      longitude,
    } = this.props;

    const event = data.find(e => e.id === popupIsOpened);
    const markers = data.map((x, index) => {
      const object = {
        position: {
          label: x.location.label,
          lat: x.location.latitude,
          lng: x.location.longitude,
        },
        title: x.title,
        images: x.gallery.images.find(i => i.default).src,
        since: x.since,
        hobbies: x.hobbies,
        id: x.id,
      };

      const {infoBox} = this.state;

      return (
        <Marker
          key={index} {...object}
          onClick={() => {
            this.setState({
              infoBox: infoBox ? null : x.id,
              lat: x.location.latitude,
              lng: x.location.longitude,
            });
          }}
        >
          {
            infoBox === x.id && (
              <InfoBox
                options={{
                  alignBottom: true,
                  closeBoxURL: "",
                  enableEventPropagation: true,
                }}
              >
                <div className={s.container}>
                  <div onClick={() => {
                    this.setState({
                      popupIsOpened: x.id,
                    })
                  }}
                    className={s.image}>
                    <img src={object.images} alt={object.title}/>
                  </div>

                  <div onClick={() => {
                      this.setState({
                        popupIsOpened: x.id,
                      })
                    }}
                    className={s.dayEvent}>
                    <div>{moment(x.dateStart, 'X').format('ddd')}</div>
                    <div className={s.day}>{moment(x.dateStart, 'X').format('D')}</div>
                    <div>{moment(x.dateStart, 'X').format('MMM')}</div>
                    <div className={s.category}>{object.hobbies.map(h => h.name).join(', ')}</div>
                  </div>

                  <div onClick={() => {
                    this.setState({
                      popupIsOpened: x.id,
                    })
                  }}
                  className={s.title}>{object.title}</div>

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
    });

    return (
      <div>
        <GoogleMap
          defaultZoom={14}
          center={lat ? {lat: lat, lng: lng } : latitude ? {lat: latitude, lng: longitude} : (userLocation ? userLocation : {lat: 0, lng: 0})}
          defaultOptions={{styles: fancy}}
        >
          { markers }
        </GoogleMap>

        {
          popupIsOpened && (
            <Popup onClose={() => {
              this.setState({
                popupIsOpened: null,
                infoBox: null,
              });
            }}>
              <PopupContent data={{
                ...event,
                date: event,
              }} />
            </Popup>
          )
        }
      </div>
    )
  }
}

function mapStateToProps(store) {
    return {
        userLocation: store.auth.isAuthenticated ? store.user.locations : false,
    };
}

export default connect(mapStateToProps)(withScriptjs(withGoogleMap(withStyles(s)(Map))));
