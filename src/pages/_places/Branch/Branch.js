import React, { Component } from "react";
import s from './Branch.scss';
import Loader from '../../../components/Loader';
import { withRouter } from 'react-router';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from "../../../components/_layout/Layout/Layout";
import {settingsForListitem} from "../../../components/_carousel/SliderSettingsMobile";
import Slider from "react-slick";

class Branch extends Component {
  constructor(props, context) {
    super(props, context);

    const { data } = this.props.location.state;

    this.state = {
      dataBranch: data,
    };
  }

  render() {
    const {  name} = this.props;
    const { dataBranch } = this.state;

    const {
      gallery,
      location,
      schedule,
      description,
    } = this.state.dataBranch;

    if ( ! dataBranch) {
      return <Loader />
    }

    return (
      <Layout
        contentHasBackground
      >
      <div className={s.popupContent}>
        <div className={s.title}>
          {name}
        </div>
        <div className={s.poster}>
            {
              gallery.images && !!gallery.images.length && (
                <Slider
                  className={s.slider}
                  {...settingsForListitem}
                >
                  {
                    gallery.images.map(item => (
                      <div
                        key={`${item.key}_${item.id}`}
                      >
                        <img src={item.src} alt={name}/>
                      </div>
                    ))
                  }
                </Slider>
              )
            }
        </div>

        <div className={s.detailsPopup}>
          <div><i className="icon-map-marker" /><span>{location.label}</span></div>
          <div><i className="icon-clock" /><span>{schedule}</span></div>
          <div>
            <div
              id='links'
              className={s.content}
              dangerouslySetInnerHTML={{__html: description}}
            />
          </div>
        </div>
      </div>
      </Layout>
    )
  }
}

export default withRouter(withStyles(s)(Branch));

