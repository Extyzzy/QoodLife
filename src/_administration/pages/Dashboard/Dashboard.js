import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Dashboard.scss';
import Graphic from '../../components/_graphic/GraphicContainner';
import { connect } from 'react-redux';

class Dashboard extends Component {
  render() {
    return (
      <div className={s.root}>
        <Graphic
          route={'users'}
        />
        <Graphic
          route={'events'}
        />
        <Graphic
          route={'groups'}
        />
        <Graphic
          route={'products'}
        />
        <Graphic
          route={'posts'}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    user: state.user,
  };
}

export default (connect(mapStateToProps)(withStyles(s)(Dashboard)));
