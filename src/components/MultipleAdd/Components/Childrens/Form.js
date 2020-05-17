import React from 'react';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import Select from "react-select";
import moment from 'moment';
import Datetime from 'react-datetime';
import "react-select/dist/react-select.css";
import "react-datetime/css/react-datetime.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import WarningPopover from "../../../WarningPopover";

const Form = ({
  __childGender,
  __childDateOfBirth,
  __children_in_planning,
  isMobile,
  onSubmit,
  onGenderChange,
  onDateOfBirthChange,
  onChildStatusChange,
  gendersOptions,
}) => (
  <div className={s.childFormContainer} >
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.gender')}
      </label>
      {
        (__children_in_planning && (
          <input
            type="text"
            className="idle-input"
            disabled
          />
        )) || (
          <Select
            value={__childGender}
            options={gendersOptions}
            onChange={onGenderChange}
            className={classes("multiselect-input", {
              "mobile": isMobile,
            })}
            optionClassName="needsclick"
            multi={false}
      />
        )
      }
    </div>

    <div className={`${s.datePickerContainer} form-group`}>
      <label>
        {I18n.t('general.components.multipleAdd.birthDate')}
      </label>

      {
        (__children_in_planning && (
          <input
            type="text"
            className="idle-input"
            disabled
          />
        )) || (
          <Datetime
            readOnly
            closeOnSelect
            className="idle-input-gender"
            value={__childDateOfBirth}
            viewMode={'years'}
            dateFormat={'DD/MM/YYYY'}
            timeFormat={false}
            onChange={onDateOfBirthChange}
            isValidDate={current => {
              return (
                current.isBefore(
                  moment().subtract(1, 'day')
                ))
            }}
          />
        )
      }
    </div>

    <div className="form-group">
      <input
        type="checkbox"
        className='form-checkbox'
        onChange={onChildStatusChange}
        checked={__children_in_planning}
      />
      <label className="control-label">
        {I18n.t('general.components.multipleAdd.planning')}
      </label>
    </div>
    <div className={s.formFooter}>
      {
        (
        (__children_in_planning || (__childDateOfBirth && __childGender)) &&(
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
