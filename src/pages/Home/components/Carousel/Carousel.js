import React, { Component } from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import { fetchApiRequest } from '../../../../fetch';
import classes from 'classnames';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Carousel.scss";
import { SilencedError } from "../../../../exceptions/errors";
import { PrevArrow, NextArrow } from '../../../../components/_carousel/CarouselArrows/CarouselArrows';
import { I18n } from 'react-redux-i18n';
import {
  MOBILE_VERSION,
} from '../../../../actions/app';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';



class Carousel extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: null,
    };
  };

  componentDidMount() {
    this.dataFetcher = fetchApiRequest('/v1/galleries/HOME_CAROUSEL');

    this.dataFetcher
        .then(response => {
          switch (response.status) {
            case 200:
              return response.json();
            default:
              return Promise.reject(
                new SilencedError('Failed to fetch home gallery..')
              );
          }
        })
        .then(data => {
          this.setState({data});
          return Promise.resolve();
        })
  }

  componentWillUnmount() {
    if (this.dataFetcher instanceof Promise) {
      this.dataFetcher.cancel();
    }
  }

  render() {
    const { data } = this.state;

    const {
      userType,
      demo,
      isAuthenticated,
      UIVersion
    } = this.props;

    const admin = isAuthenticated ? userType.find(role =>  role.code === 'admin') : false;

    const sliderSettings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      nextArrow: (
        <NextArrow
          arrowClassName={s.nextArrow}
        />
      ),
      prevArrow: (
        <PrevArrow
          arrowClassName={s.prevArrow}
        />
      ),
    };

    if( !data ) {
      return null;
    }

    return (
      <div className={s.root}>
        {
          data.images && !!data.images.length && (
            <Slider
              className={s.slider}
              {...sliderSettings}
            >
              {
                data.images.sort((s,v) => {return s.default? 0 : 1})
                .map(item => (
                  <div key={`${item.key}_${item.id}`}>
                    <LazyLoadImage effect='blur' style={UIVersion !== MOBILE_VERSION ? {height: 420} : {width: '100%'}} src={item.src} alt={item.label}/>
                  </div>
                ))
              }
            </Slider>
          )
        }

        {
          (!!admin || !demo) &&(
            <Link
              className={
                classes(
                  'btn btn-red',
                  s.goToHobbies
                )
              }
              to="/hobbies"
            >
              {I18n.t('home.carousel.browseHobbies')}
            </Link>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hobbiesList: state.hobbies.list,
    userType: state.user.roles,
    demo: state.app.demo,
    UIVersion: state.app.UIVersion,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Carousel));
