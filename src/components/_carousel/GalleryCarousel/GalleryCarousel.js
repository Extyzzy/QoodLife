import React, { Component } from "react";
import PropTypes from "prop-types";
import classes from "classnames";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./GalleryCarousel.scss";
import {PrevArrow, NextArrow} from '../CarouselArrows/CarouselArrows';

class GalleryCarousel extends Component {
  static propTypes = {
    gallery: PropTypes.shape({
      images: PropTypes.arrayOf(
        PropTypes.shape({
          src: PropTypes.string.isRequired,
        })).isRequired,
    }).isRequired,
    overWhiteBackground: PropTypes.bool,
  };

  static defaultProps = {
    overWhiteBackground: false,
    profileCarousel: false,
  };

  gallery() {
    const {
      gallery,
      activeImageIndex,
      onImageSelect,
      profileCarousel,
    } = this.props;

    return(
      gallery.images.map((i, index) => {
        const isActive = index === activeImageIndex;

        return (
          <div
            key={index}
            className={classes({
              [s.active]: isActive,
              [s.image]: !profileCarousel,
              [s.profileCarousel]: profileCarousel,
            })}
            onClick={() => onImageSelect(index)}
          >
            <img src={i.src} alt=""/>
          </div>
        );
      })
    )
  }

  render() {
    const {
      gallery,
      overWhiteBackground,
      profileCarousel,
    } = this.props;

    const settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 6,
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

    if (gallery.images.length > 6) {
      return(
        <Slider
          className={
            classes(
              {
                [s.overWhiteBackground]: overWhiteBackground,
                [s.gallery]: !profileCarousel,
              }
            )
          }
          {...settings}
        >
          {this.gallery()}
        </Slider>
      )
    } else {
      return (
        <div
          className={
            classes(
              s.hasNoControls, {
                [s.gallery]: !profileCarousel,
                [s.overWhiteBackground]: overWhiteBackground,
              }
            )
          }
        >
          {this.gallery()}
        </div>
      )
    }
  }
}

export default withStyles(s)(GalleryCarousel);
