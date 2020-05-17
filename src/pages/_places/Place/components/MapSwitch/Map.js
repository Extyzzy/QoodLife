import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import React, {Component} from 'react';
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Map.scss';
import fancy from '../../../../../styles/fancy-map.json';
import PropTypes from "prop-types";
import PopupContent from "../BranchesList/ListItem/PopupContent";
import Popup from "../../../../../components/_popup/Popup/Popup";

class Map extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      infoBox: null,
      showPopup: null,
      userLocation: null,
      lat: null,
      lng: null,
      activeImageIndex: 0,
    };
  };

  render() {
    const {
      showPopup,
      activeImageIndex,
      lat,
      lng,
      infoBox,
    } = this.state;

    const {
      data,
    } = this.props;

    const markers = data.map((x, index) => {
      const object = {
        position: {
          label: x.location.label,
          lat: x.location.latitude,
          lng: x.location.longitude,
        },
        schedule: x.schedule,
        images: x.gallery.images.find(i => i.default).src,
        since: x.since,
        hobbies: x.hobbies,
        id: x.id,
      };

      return (
        <Marker
          key={index} {...object}
          onClick={() => {
            this.setState({
              infoBox: x.id,
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
                  <span onClick={() => {
                    this.setState({
                      infoBox: null,
                    })
                  }}>
                     <i className="icon-plus" />
                    </span>

                  <div onClick={() => {
                    this.setState({
                      showPopup: x.id,
                    })
                  }}
                       className={s.image}>
                    <img src={object.images} alt={object.position.label} />
                  </div>

                  <div onClick={() => {
                    this.setState({
                      showPopup: x.id,
                    })
                  }}
                   className={s.title}>{x.schedule}</div>

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

    const branch = showPopup ? data.filter(e => e.id === showPopup) : null;
    const activeImage = showPopup ? branch[0].gallery.images[activeImageIndex] : null;
    const images = showPopup ? branch[0].gallery.images : null;
    const defaultBranch = data.find(br => br.default);


    return (
      <div>
        <GoogleMap
          defaultZoom={14}
          center={lat ? {lat,lng } : {lat: defaultBranch.location.latitude, lng: defaultBranch.location.longitude}}
          defaultOptions={{styles: fancy}}
        >
          { markers }
        </GoogleMap>

        {
          showPopup && (
            <Popup onClose={() => this.setState({showPopup: false})}>
              <PopupContent
                name={showPopup ? branch[0].location.label : null}
                data={showPopup ? branch[0] : null}
                defaultImage={activeImage}
                moveDownImage={() => {
                  this.setState({
                    activeImageIndex:
                      activeImageIndex === 0
                        ? images.length - 1
                        : activeImageIndex - 1,
                  })
                }}
                moveUpImage={() => {
                  this.setState({
                    activeImageIndex:
                      activeImageIndex === images.length - 1
                        ? 0
                        : activeImageIndex + 1
                    ,
                  })
                }}
                activeImageIndex={activeImageIndex}
                onImageSelect={activeImageIndex => this.setState({activeImageIndex})}
              />
            </Popup>
          )
        }

      </div>
    )
  }
}

export default withScriptjs(withGoogleMap(withStyles(s)(Map)));
