import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

import ChangePasswordForm from './ChangePasswordForm';
import { fetchAuthorizedApiRequest } from '../../../../../fetch';
import { UnprocessableEntity, InternalServerError } from '../../../../../exceptions/http';
import { appendToFormData, didFormDataHasChanged } from '../../../../../helpers/form';

class ChangePasswordFormContainer extends Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    onFetchingStateChange: PropTypes.func,
    beforeSubmit: PropTypes.func,
    onSuccess: PropTypes.func,
    onError: PropTypes.func,
    onFormDataChange: PropTypes.func,
  };

  static defaultProps = {
    isFetching: false,
  };

  constructor(props, context) {
    super(props, context);

    this.setInitialFormData({
      __currentPassword: '',
      __newPassword: '',
      __newPasswordConfirmation: '',
    });

    this.state = {
      isFetching: props.isFetching,
      ...this.getInitialFormData(),
      errors: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const { onFormDataChange } = this.props;

    if (onFormDataChange instanceof Function) {
      onFormDataChange(
        didFormDataHasChanged(
          this.getInitialFormData(),
          nextState
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }
  }

  setInitialFormData(formData) {
    this._initialFormData = formData;
  }

  getInitialFormData() {
    return this._initialFormData || {};
  }

  toggleIsFetchingState(state) {
    const { onFetchingStateChange } = this.props;
    const isFetching = state === undefined
      ? ! this.state.isFetching : state;

    this.setState({isFetching}, () => {
      if (onFetchingStateChange instanceof Function) {
        onFetchingStateChange(isFetching);
      }
    });
  }

  getFormData() {
    const {
      __currentPassword,
      __newPassword,
      __newPasswordConfirmation,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        'current': __currentPassword,
        'new': __newPassword,
        'new_confirmation': __newPasswordConfirmation,
      },
      'password'
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      beforeSubmit,
      onSuccess,
      onError,
    } = this.props;

    this.toggleIsFetchingState(true);

    if (beforeSubmit instanceof Function) {
      beforeSubmit();
    }

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/account/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormData(),
      })
    );

    this.submitFormDataFetcher
      .then(response => {
        switch(response.status) {
          case 204:

            this.setState({errors: null});

            return Promise.resolve();

          case 422:

            return response.json().then(({errors}) => {
              this.setState({errors});

              return Promise.reject(
                new UnprocessableEntity()
              );
            });

          default:

            return Promise.reject(
              new InternalServerError()
            );

        }
      })
      .then(
        () => {
          this.toggleIsFetchingState(false);

          if (onSuccess instanceof Function) {
            onSuccess();
          }
        },
        e => {
          this.toggleIsFetchingState(false);

          if (onError instanceof Function) {
            onError(e);
          }
        }
      );
  }

  onSubmit(e) {
    e.preventDefault();

    const { isFetching } = this.state;

    if (isFetching) {
      return false;
    }

    this.submitFormData();
  }

  render() {
    const {
      isFetching,
      __currentPassword,
      __newPassword,
      __newPasswordConfirmation,
      errors,
    } = this.state;

    return (
      <ChangePasswordForm
        isFetching={ isFetching }
        onSubmit={ this.onSubmit }
        __currentPassword={__currentPassword}
        __newPassword={__newPassword}
        __newPasswordConfirmation={__newPasswordConfirmation}
        onCurrentPasswordChange={({target: {value: __currentPassword}}) => {
          this.setState({__currentPassword});
        }}
        onNewPasswordChange={({target: {value: __newPassword}}) => {
          this.setState({__newPassword});
        }}
        onNewPasswordConfirmationChange={({target: {value: __newPasswordConfirmation}}) => {
          this.setState({__newPasswordConfirmation});
        }}
        errors={ errors }
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
  };
}

export default connect(mapStateToProps)(ChangePasswordFormContainer);
