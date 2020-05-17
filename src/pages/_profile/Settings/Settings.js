import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Layout from '../../../components/_layout/Layout';
import s from './Settings.scss';
import ChangePasswordPopup from './components/ChangePasswordPopup/ChangePasswordPopup';
import Popup from '../../../components/_popup/Popup/Popup';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import Select from 'react-select';

const Settings = ({
  user,
  open,
  showGetPowerButton,
  getPowerToPros,
  switchPasswordPopup,
  popupIsOpen,
  optionsLanguages,
  language,
  onLanguageChange,
  optionsRoles,
  role,
  onRoleChange,
  defaultProfile,
  onDeactivateProfile,
  onReactivateProfile,
  onDeleteProfile,
  onDefaultProfileChange,
  optionsDefaultProfile,
  onSubmit,
  accountIsActivated,
  apiUrl
}) => (
  <Layout hasSidebar hasAds whichSidebar="My Profile" contentHasBackground>
    <div className={s.root}>
      <div className="form-group">
        <label className="control-label">
          {I18n.t(
            'profile.editProfile.changePassword.changePasswordPopupTitle'
          )}
        </label>
        <span className={classes('form-control', s.password)}>
          {I18n.t('settings.insertPassword')}
          <span
            className={classes('icon-pen', s.edit)}
            onClick={switchPasswordPopup}
          />
        </span>
      </div>

      <div className="form-group">
        <label className="control-label">
          {I18n.t('settings.changeLanguages')}
        </label>
        <Select
          value={language}
          options={optionsLanguages}
          onChange={onLanguageChange}
          optionClassName="needsclick"
        />
      </div>

      <div className="form-group">
        <label className="control-label">
          {I18n.t('settings.profile.show')}
        </label>

        <Select
          value={defaultProfile}
          options={optionsDefaultProfile}
          onChange={onDefaultProfileChange}
          optionClassName="needsclick"
        />
      </div>

      <div className="form-group">
        <Select
          value={role}
          options={optionsRoles}
          onChange={onRoleChange}
          optionClassName="needsclick"
          multi
        />
      </div>


      {apiUrl === 'http://api.qoodlife.artsintez.md' && (
        <div className={s.mButtonsContainer}>
        {accountIsActivated ? (
          <button
            className={classes('btn btn-warning', [s.deactivateAccount])}
            onClick={onDeactivateProfile}
          >
            {I18n.t('profile.editProfile.profileDetails.deactivateAccount')}
          </button>
        ) : (
          <button
            className={classes('btn btn-warning', [s.reactivateAccount])}
            onClick={onReactivateProfile}
          >
            {I18n.t('profile.editProfile.profileDetails.reactivateAccount')}
          </button>
        )}

        <button
          className={classes('btn btn-danger', [s.deleteAccount])}
          onClick={onDeleteProfile}
        >
          {I18n.t('profile.editProfile.profileDetails.deleteAccount')}
        </button>
      </div>
      )}
      

      <div className={s.button}>
        <button onClick={onSubmit} className="btn btn-red">
          {I18n.t('profile.editProfile.profileDetails.save')}
        </button>
      </div>
    </div>

    {showGetPowerButton && (
      <button
        onClick={getPowerToPros}
        className="btn btn-default"
        style={{ position: 'relative', left: '20px', bottom: '20px' }}
      >
        Reqest Ability to invite Users
      </button>
    )}

    {popupIsOpen && (
      <Popup onClose={switchPasswordPopup}>
        <ChangePasswordPopup
          closePopUp={switchPasswordPopup}
          onSuccess={switchPasswordPopup}
        />
      </Popup>
    )}
  </Layout>
);

export default withStyles(s)(Settings);
