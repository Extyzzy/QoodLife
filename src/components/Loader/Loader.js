import classes from 'classnames';
import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Loader.scss';

const Loader = ({className, sm, contrast}) => (
  <div
    className={classes(s.root, {
      [s.contrast]: contrast,
    }, className)}
  />
);

export default withStyles(s)(Loader);
