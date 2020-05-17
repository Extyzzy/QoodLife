import React, { Component } from "react";
import { I18n } from 'react-redux-i18n';
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";
import Slider from "react-slick";
import ListItem from "../../../../../pages/_places/Place/components/BranchesList/ListItem";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./BranchesList.scss";
import classes from "classnames";
import ViewModeSwitcher from '../../../../../components/ViewModeSwitcher';
import config from "../../../../../config";
import {getCurrentPositionByIp} from "../../../../../helpers/geo";
import Map from '../MapSwitch/Map';

class BranchesList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      viewMode: 'list',
    };
  }

  componentDidMount() {
    getCurrentPositionByIp().then(({lat, lon}) => {
      if(lat && lon) {
        this.setState({
          latitude: lat,
          longitude: lon,
        })
      }}).catch(() => {
        return Promise.reject();
      });
  }

  render() {
    const {
      branchesList,
      name,
      isMobile
    } = this.props;

    const {
      viewMode,
      latitude,
      longitude,
    } = this.state;

    return (
      <div className={s.root}>
        {
          (branchesList && !!branchesList.length && (
            (isMobile && (
              <Slider
                className={s.slider}
                {...settingsForListitem}
              >
                {
                  branchesList.map(branch =>
                    <div key={branch.id}>
                      <ListItem
                        data={branch}
                        name={name}
                        viewMode="icons"
                      />
                    </div>
                  )
                }
              </Slider>
            )) || (
              <div>
                {
                  !isMobile && (
                    <ViewModeSwitcher
                      className={s.viewModeSwitcher}
                      modes={['list', 'icons', 'map']}
                      mode={viewMode}
                      onChange={(m) => {
                        if (m !== viewMode) {
                          this.setState({
                            viewMode: m,
                          });
                        }
                      }}
                    />
                  )
                }
                <div className={
                  classes({
                    [s.listItem]: viewMode === 'icons'
                  })
                }>
                  {
                    (viewMode === 'map' &&(
                      <div className={s.divMapRel}>
                        <Map
                          googleMapURL={config.googleMapsApiV3Url}
                          data={branchesList}
                          latitude={latitude}
                          longitude={longitude}
                          loadingElement={<div />}
                          containerElement={<div className={s.containerElement} />}
                          mapElement={<div className={s.mapElement} />}
                        />
                      </div>
                    )) || (
                      branchesList.map(branch =>
                        <ListItem
                          key={branch.id}
                          data={branch}
                          name={name}
                          viewMode={viewMode}
                        />
                      )
                    )
                  }

                </div>
              </div>
            ))) || I18n.t('agent.placesNotFound')
        }
      </div>
    );
  }
}

export default withStyles(s)(BranchesList);
