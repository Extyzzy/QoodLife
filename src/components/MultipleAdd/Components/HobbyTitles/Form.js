import React from 'react';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import WarningPopover from "../../../WarningPopover";

const Form = ({
  __title,
  isMobile,
  onSubmit,
  onTitleChange,
}) => (
  <div className={s.childFormContainer} >
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.title')}
      </label>

      <input
        value={__title}
        onChange={onTitleChange}
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
          __title !== '' &&(
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
  </div>
);

export default withStyles(s)(Form);
