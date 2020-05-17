import React from 'react';
import { I18n } from 'react-redux-i18n';
import Select from "react-select";
import classes from 'classnames';
import "react-select/dist/react-select.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";
import WarningPopover from "../../../WarningPopover";

const Form = ({
  hobbiesList,
  hobbyTitlesList,
  hobbyAgeGroupsList,
  audienceOptions,
  __audienceForCommonHobbies,
  __ageGroups,
  __hobby,
  __title,
  isMobile,
  filters,
  audience,
  role,
  onClose,
  onSubmit,
  onHobbyChange,
  onTitleChange,
  onAgeGroupsChange,
  onAudienceChange
}) => (
  <div className={s.childFormContainer}>
    <div className="form-group">
      <label>
        {I18n.t('profile.editProfile.profileDetails.domeins')}
      </label>
      <Select
        className={classes("multiselect-input", {
          "mobile": isMobile,
        })}
        optionClassName="needsclick"
        value={__hobby}
        options={hobbiesList}
        onChange={onHobbyChange}
        multi={false}
      />
    </div>
    {
      hobbyTitlesList && !!hobbyTitlesList.length && (
        <div className="form-group">
          <label>
            {
              (filters &&
                I18n.t('general.components.multipleAdd.filter')
              ) || I18n.t('general.components.multipleAdd.title')
            }
          </label>
          <Select
            className={classes("multiselect-input", {
              "mobile": isMobile,
            })}
            optionClassName="needsclick"
            value={__title}
            options={hobbyTitlesList}
            onChange={onTitleChange}
            multi
          />
        </div>
      )
    }

    {
      audience === 'childrens' && (
        <div className="form-group">
          <label>
            {I18n.t('general.components.multipleAdd.audience')}
          </label>
          <Select
            className={classes("multiselect-input", {
              "mobile": isMobile,
            })}
            optionClassName="needsclick"
            value={__audienceForCommonHobbies}
            options={audienceOptions}
            onChange={onAudienceChange}
            multi={false}
          />
        </div>
      )
    }
    {
      hobbyAgeGroupsList && !!hobbyAgeGroupsList.length && (
        <div className="form-group">
          <label>
            {I18n.t('general.components.multipleAdd.ageGroups')}
          </label>
          <Select
            className={classes("multiselect-input", {
              "mobile": isMobile,
            })}
            optionClassName="needsclick"
            value={__ageGroups}
            options={hobbyAgeGroupsList}
            onChange={onAgeGroupsChange}
            multi
            placeholder={I18n.t('general.components.multipleAdd.ageGroupsDescritions')}
          />
        </div>
      )
    }

    <div className={s.formFooter}>
      {
        (
          __hobby &&(
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
