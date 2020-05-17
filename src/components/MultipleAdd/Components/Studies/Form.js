import React from 'react';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import WarningPopover from "../../../WarningPopover";

const Form = ({
  __institution,
  isMobile,
  onClose,
  onSubmit,
  onInstitutionChange
}) => (
  <div className={s.childFormContainer} >
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.institution')} <span className={s.required}>*</span>
      </label>
      <input
        value={__institution}
        onChange={onInstitutionChange}
        className={classes("idle-input", {
          "mobile": isMobile,
        })}
        type="text"
        required
      />
    </div>
    <div className={s.formFooter}>
      {
        (
          __institution !== '' &&(
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={onSubmit}
            >
              {I18n.t('general.components.multipleAdd.addButton')}
            </button>
          )) ||  (
          <WarningPopover fullName={I18n.t('general.components.multipleAdd.warning')}>
              <span
                className='btn btn-red btn-sm'
              >
                 {I18n.t('general.components.multipleAdd.addButton')}
              </span>
          </WarningPopover>
        )
      }
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
