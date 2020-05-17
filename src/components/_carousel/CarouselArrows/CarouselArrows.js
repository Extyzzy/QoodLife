import React from "react";
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CarouselArrows.scss";

export const NextArrow = withStyles(s)(({
  arrowClassName,
  onClick
}) => (
  <button
    className={
      classes(
        s.nextArrow, {
          [arrowClassName]: !!arrowClassName,
        }
      )
    }
    onClick={onClick}
  />
));

export const PrevArrow = withStyles(s)(({
  arrowClassName,
  onClick
}) => (
  <button
    className={
      classes(
        s.prevArrow,
        {[arrowClassName]: !!arrowClassName},
      )
    }
    onClick={onClick}
  />
));
