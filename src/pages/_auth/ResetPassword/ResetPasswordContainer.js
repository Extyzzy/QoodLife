import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router';
import { appendToFormData } from '../../../helpers/form';
import { fetchAuthorizedApiRequest } from "../../../fetch";
import { SilencedError } from "../../../exceptions/errors";
import ResetPassword from './ResetPassword';

class ResetPasswordContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      __email: '',
      isFetching: false,
      sendSuccess: false,
    };

    this.sendResetPasswordMail = this.sendResetPasswordMail.bind(this);
  }

  sendResetPasswordMail(e) {
    e.preventDefault();

    const {
      dispatch
    } = this.props;

    const {
      __email,
      isFetching,
    } = this.state;



    if (isFetching) {
      return false;
    }

    this.setState({isFetching: true});

    this.resetFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/account/send-reset-pass', {
        method: 'POST',
        body: appendToFormData(
          new FormData(), {
            email: __email
          }
        )
      })
    );

    this.resetFetcher
      .then(response => {
        switch (response.status) {
          case 201:
            return response.json();
          default:
            return Promise.reject(
              new SilencedError('Failed to fetch reset password details.')
            );
        }
      })
      .then(() => {
        this.setState({
          isFetching: false,
          sendSuccess: true,
        });
        return Promise.resolve();
      })
  }

  render() {
    const {
      history,
      isAuthenticated,
      errors,
    } = this.props;

    if (isAuthenticated) {
      return (
        <Redirect to={'/profile/edit'} />
      );
    }

    const {
      __email,
      isFetching,
      sendSuccess,
    } = this.state;

    return (
      <ResetPassword
        isFetching={isFetching}
        onSubmit={this.sendResetPasswordMail}
        sendSuccess={sendSuccess}
        errors={errors}
        __email={__email}
        onEmailChange={({target: {value: __email}}) => {
          this.setState({__email});
        }}

        onCancelSignup={() => {
          history.push('/login', { from: '/resetPassword' })
        }}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(ResetPasswordContainer));
