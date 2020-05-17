import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import {updateConfirmed} from '../../../actions/user';
import ConfirmAccount from './ConfirmAccount';
import { fetchApiRequest } from '../../../fetch';
import { SilencedError } from "../../../exceptions/errors";
import connect from "react-redux/es/connect/connect";

class ConfirmAccountContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.confirmAccount();
  }

  componentWillUnmount() {
    if (this.confirmAccountFetcher instanceof Promise) {
      this.confirmAccountFetcher.cancel();
    }
  }

  confirmAccount() {
    const { token } = this.props.match.params;

    this.confirmAccountFetcher = fetchApiRequest(
      `/v1/account/confirm/${token}`
    );

    this.confirmAccountFetcher
      .then(response => {
        switch(response.status) {
          case 204:

            this.setState({
              isLoading: false,
            }, () => {
              this.props.dispatch(
                updateConfirmed()
              );
            });

            return Promise.resolve();

          case 500:

            return response.json().then(({message}) => {
              this.setState({
                isLoading: false,
                error: I18n.t('auth.confirmAccount.failedMessage'),
              });

              return Promise.reject(
                new SilencedError(message)
              );
            });

          default:

            this.setState({
              isLoading: false,
              error: I18n.t('auth.errorMessages.criticalError'),
            });

            return Promise.reject(
              new SilencedError('Account confirmation failed!')
            );

        }
      });
  }

  render() {
    const {
      isLoading,
      error,
    } = this.state;

    const {
      history,
    } = this.props;

    return (
      <ConfirmAccount
        isLoading={isLoading}
        error={error}
        onLoginClick={() => {
          history.push('/login');
        }}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(ConfirmAccountContainer));
