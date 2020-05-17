import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { logoutUser } from '../../../actions/user';

class Logout extends Component {
  componentDidMount() {
    const {
      dispatch,
      accessToken,
      accessTokenExpiresOn,
      languagesList,
    } = this.props;

    dispatch(
      logoutUser(
        accessToken,
        accessTokenExpiresOn,
        languagesList
      )
    );
  }

  render() {
    return (
      <Redirect to="/" />
    );
  };
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    accessTokenExpiresOn: state.auth.accessTokenExpiresOn,
    languagesList: state.languages.list,
  };
}

export default connect(mapStateToProps)(Logout);
