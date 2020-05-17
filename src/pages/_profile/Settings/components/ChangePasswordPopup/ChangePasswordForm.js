import React  from 'react';
import {Alert} from "react-bootstrap";
import withStyles from "isomorphic-style-loader/lib/withStyles";

import ErrorsList from '../../../../../components/ErrorsList/ErrorsList';
import s from "./ChangePasswordPopup.scss";

import {I18n} from 'react-redux-i18n';
import classes from "classnames";

const ChangePasswordForm = ({
  isFetching,
  onSubmit,
  __currentPassword,
  __newPassword,
  __newPasswordConfirmation,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onNewPasswordConfirmationChange,
  errors,
}) => (
  <div>
  <form className={s.root} onSubmit={onSubmit}>
    <div className="form-group">
      <label htmlFor="password.current">
        {I18n.t('profile.editProfile.changePassword.currentPassword')}
      </label>

      <input
        id="password.current"
        type="password"
        value={__currentPassword}
        onChange={onCurrentPasswordChange}
        className="idle-input"
        placeholder={I18n.t('profile.editProfile.changePassword.currentPasswordPlaceholder')}
        required
        maxLength="255"
      />
    </div>

    <div className="form-group">
      <label htmlFor="password.new">
        {I18n.t('profile.editProfile.changePassword.newPassword')}
      </label>

      <input
        id="password.new"
        type="password"
        value={__newPassword}
        onChange={onNewPasswordChange}
        className="idle-input"
        placeholder={I18n.t('profile.editProfile.changePassword.newPasswordPlaceholder')}
        required
        maxLength="255"
      />
    </div>

    <div className="form-group">
      <label htmlFor="password.new_confirmation">
        {I18n.t('profile.editProfile.changePassword.confirmPassword')}
      </label>

      <input
        id="password.new_confirmation"
        type="password"
        value={__newPasswordConfirmation}
        onChange={onNewPasswordConfirmationChange}
        className="idle-input"
        placeholder={I18n.t('profile.editProfile.changePassword.confirmPasswordPlaceholder')}
        required
        maxLength="255"
      />
    </div>

    {
      errors && (
        <Alert className="alert-sm" bsStyle="danger">
          <ErrorsList messages={errors} />
        </Alert>
      )
    }
  </form>
    <div className={s.buttons}>
      <button
        className={classes(s.submit, {
          'disabled': isFetching
        })}
        onClick={(e) => {
          onSubmit(e)
        }}
        disabled={isFetching}
      >
        {I18n.t('general.elements.submit')}
      </button>
    </div>
  </div>
);

export { ChangePasswordForm as ChangePasswordFormWithoutDecorators };
export default withStyles(s)(ChangePasswordForm);
