import React from "react";
import classes from "classnames";
import { NextArrow, PrevArrow } from '../CarouselArrows/CarouselArrows';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./SideArrowsCarousel.scss";

class SideArrowsCarousel extends React.Component {
  constructor(props, context) {
    super(props, context);
    const { activeImage, isCarousel } = this.props;

    this.state = {
      activeImageSrc: activeImage,
      isCarousel: (isCarousel > 1)? true : false,
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      activeImageSrc: nextProps.activeImage,
      isCarousel: (nextProps.isCarousel > 1)? true : false,
    })
  }

  render() {
    const { moveDown, moveNext, leftArrow, alt, product } = this.props;
    const { activeImageSrc, isCarousel } = this.state;

    return (
      <div className={s.root}>
        {
          isCarousel && (
            <div
              className={classes(s.moveImage, s.left, {
                [s.leftArrow]: leftArrow,
              })}
              onClick={moveDown}
            >
              <PrevArrow/>
            </div>
          )
        }
          <img className={product ? parseInt(product.height, 10) > parseInt(product.width, 10) ?  s.product : null : null}
               src={activeImageSrc}
               alt={alt} />
        {
          isCarousel && (
            <div
              className={classes(s.moveImage, s.right)}
              onClick={moveNext}
            >
              <NextArrow/>
            </div>
          )
        }
      </div>
    );
  }
}

export default withStyles(s)(SideArrowsCarousel);
