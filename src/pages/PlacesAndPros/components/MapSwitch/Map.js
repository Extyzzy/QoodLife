import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import React, {Component} from 'react';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import { connect } from 'react-redux';
import fancy from '../../../../styles/fancy-map.json';
import s from '../../../_events/Events/components/ListItem/Map/Map.scss';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popup from '../../../../components/_popup/Popup';
import PopupContentPros from '../../../_professionals/Professionals/components/PopupContent';
import PopupContentPlaces from '../../../_places/Places/components/PopupContent';

class Map extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      infoBox: null,
      infoBoxPlaces: null,
      popupIsOpened: null,
      popupIsOpenedPlaces: null,
      userLocation: null,
      placesBranch: null,
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
      popupIsOpenedPlaces,
      placesBranch,
      userLocation,
      infoBox,
      infoBoxPlaces,
      lat,
      lng,
    } = this.state;

    const {
      dataPros,
      dataPlaces,
      latitude,
      longitude,
    } = this.props;

    const pros = dataPros.find(e => e.id === popupIsOpened);
    const places = dataPlaces.find(e => e.id === popupIsOpenedPlaces);

    const markersPros = dataPros.map(x => {
      const objectProf = {
        firstName: x.firstName,
        lastName: x.lastName,
        images: x.gallery.images.find(i => i.default).src,
        id: x.id,
      };

      const workProf = x.workingPlaces.map((x, index) => {
        const position = {
          position: {
            label: x.location.label,
            lat: x.location.latitude,
            lng: x.location.longitude,
          },
        };

        return (
          <Marker
            key={index} {...position}
            onClick={() => {
              this.setState({
                infoBox: infoBox ? null : x.id,
                infoBoxPlaces: null,
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
                    <div
                      onClick={() => {
                        this.setState({
                          popupIsOpened: objectProf.id,
                        })
                      }}
                      className={s.image}>
                      <img src={objectProf.images} alt={objectProf.firstName}/>
                    </div>

                    <div
                      onClick={() => {
                        this.setState({
                          popupIsOpened: objectProf.id,
                        })
                      }}
                      className={s.title}>{objectProf.firstName} {objectProf.lastName}</div>

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

      return workProf;
    });

    const markersPlaces = dataPlaces.map(x => {
      const object = {
        title: x.name,
        id: x.id,
      };

      const branches = x.branches.map((x, index) => {
        const position = {
          position: {
              label: x.location.label,
              lat: x.location.latitude,
              lng: x.location.longitude
            },
          images: x.gallery.images.find(i => i.default).src,
          };

        return (
          <Marker
            key={index} {...position}
            onClick={() => {
              this.setState({
                infoBoxPlaces: infoBoxPlaces ? null : x.id,
                infoBox: null,
                lat: x.location.latitude,
                lng: x.location.longitude,
              });
            }}
          >
            {
              infoBoxPlaces === x.id && (
                <InfoBox
                  options={{
                    alignBottom: true,
                    closeBoxURL: "",
                    enableEventPropagation: true,
                  }}
                >
                  <div
                    className={s.container}
                    onClick={() => {
                      this.setState({
                        popupIsOpenedPlaces: object.id,
                        placesBranch: x.id,
                      })
                    }}
                  >
                    <div className={s.image}>
                      <img src={position.images} alt={object.title}/>
                    </div>

                    <div className={s.title}>{object.title}</div>

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
        )
      });

      return branches;
    });

    return (
      <div>
        <GoogleMap
          defaultZoom={14}
          center={lat ? {lat: lat, lng: lng } : latitude ? {lat: latitude, lng: longitude} : (userLocation ? userLocation : {lat: 0, lng: 0})}
          defaultOptions={{styles: fancy}}
        >
          { markersPros }
          { markersPlaces }
        </GoogleMap>
        {
          popupIsOpened && (
            <Popup onClose={() => {
              this.setState({
                popupIsOpened: null,
                infoBox: null,
              });
            }}>
              <PopupContentPros data={{
                ...pros,
              }} />
            </Popup>
          )
        }
        {
          popupIsOpenedPlaces && (
            <Popup onClose={() => {
              this.setState({
                popupIsOpenedPlaces: null,
                infoBoxPlaces: null,
              });
            }}>
              <PopupContentPlaces data={{
                ...places,
                placesBranch
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

export default connect(mapStateToProps)(withScriptjs(withGoogleMap((withStyles(s)(Map)))));
