import React,  { Component } from "react";
import PropTypes from 'prop-types';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {I18n} from 'react-redux-i18n';
import ChangePasswordFormContainer from './ChangePasswordFormContainer';
import s from "./ChangePasswordPopup.scss";

class ChangePasswordPopup extends Component {
  static propTypes = {
    onSuccess: PropTypes.func,
    onFormDataChange: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isFetching: false,
    };
  }

  render() {
    const {
      onSuccess,
      onFormDataChange,
    } = this.props;

    return (
      <div className={s.root}>
        <div className={s.title}>
          <h4>
            {I18n.t('profile.editProfile.changePassword.changePasswordPopupTitle')}
          </h4>
        </div>

        <div className={s.body}>
          <ChangePasswordFormContainer
            onFetchingStateChange={isFetching => {
              this.setState({isFetching});
            }}
            onSuccess={onSuccess}
            onFormDataChange={onFormDataChange}
          />
        </div>
      </div>
    );
  }
}

export { ChangePasswordPopup as ChangePasswordPopupWithoutDecorators };
export default withStyles(s)(ChangePasswordPopup);
