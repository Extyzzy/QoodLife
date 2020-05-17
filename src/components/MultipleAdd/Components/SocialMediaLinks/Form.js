import React from 'react';
import Select from "react-select";
import "react-select/dist/react-select.css";
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import WarningPopover from "../../../WarningPopover";

const Form = ({
  __mediaType,
  __linkUrl,
  isMobile,
  onSubmit,
  onClose,
  onMediaTypeChange,
  onLinkUrlChange,
  mediaOptions
}) => (
  <div className={s.childFormContainer}>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.mediaType')}
      </label>
      <Select
        className={classes("multiselect-input", {
          "mobile": isMobile,
        })}
        optionClassName="needsclick"
        value={__mediaType}
        options={mediaOptions}
        onChange={onMediaTypeChange}
        multi={false}
      />
    </div>

    <div className='form-group'>
      <label>
        {I18n.t('general.components.multipleAdd.url')}
      </label>
      <input
        value={__linkUrl}
        onChange={onLinkUrlChange}
        className={classes("idle-input", {
          "mobile": isMobile,
        })}
        type="url"
        required
      />
      <p className={s.url}>{I18n.t('general.components.multipleAdd.urlDescription')}</p>
    </div>
    <div className={s.formFooter}>
      {
        (
          (__mediaType && __linkUrl.length > 5) &&(
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
