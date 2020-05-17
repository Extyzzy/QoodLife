import React from 'react';
import { I18n } from 'react-redux-i18n';
import PlacesAutocomplete from '../../../../components/_inputs/PlacesAutocomplete';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../MultipleAdd.scss';
import WarningPopover from '../../../WarningPopover';

const Form = ({
  __position,
  __institution,
  __location,
  isMobile,
  onClose,
  onSubmit,
  onInstitutionChange,
  onPositionchange,
  onLocationChange
}) => (
  <div className={s.childFormContainer}>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.institutionName')}{' '}
        <span className={s.required}>*</span>
      </label>
      <input
        value={__institution}
        onChange={onInstitutionChange}
        className={classes('idle-input', {
          mobile: isMobile
        })}
        type="text"
        required
      />
    </div>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.workingPosition')}{' '}
        <span className={s.required}>*</span>
      </label>
      <input
        value={__position}
        onChange={onPositionchange}
        className={classes('idle-input', {
          mobile: isMobile
        })}
        type="text"
        required
      />
    </div>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.location')}{' '}
        <span className={s.required}>*</span>
      </label>
      <div className="form-block">
        <PlacesAutocomplete
          className={classes('idle-input', 'placesAutocomplete', {
            [s.placesMobile]: isMobile
          })}
          value={__location ? __location.label : ''}
          placeholder={I18n.t('general.components.multipleAdd.locationInput')}
          updateOnInputChange={true}
          restrictions={null}
          onChange={onLocationChange}
        />
      </div>
    </div>
    <div className={s.formFooter}>
      {(__institution !== '' &&
        __position !== '' &&
        __location &&
        __location.latitude && (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onSubmit}
          >
            {I18n.t('general.components.multipleAdd.addButton')}
          </button>
        )) || (
        <WarningPopover
          fullName={
            __location && __location.latitude
              ? I18n.t('general.components.multipleAdd.warning')
              : I18n.t('general.components.multipleAdd.locationInput')
          }
        >
          <span
            className={classes('btn btn-success btn-sm', {
              [s.submitButton]: isMobile
            })}
          >
            {I18n.t('general.components.multipleAdd.addButton')}
          </span>
        </WarningPopover>
      )}
    </div>
    <i
      onClick={onClose}
      className={classes('icon-remove-o', [s.closeModal], {
        [s.closeModalMobile]: isMobile
      })}
    />
  </div>
);

export default withStyles(s)(Form);
