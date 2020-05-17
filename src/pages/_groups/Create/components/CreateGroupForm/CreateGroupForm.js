import React from "react";
import classes from "classnames";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Editor} from "react-draft-wysiwyg";
import {Alert} from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateGroupForm.scss";
import TimeRangePicker from '../../../../../components/TimeRangePicker';
import ErrorsList from "../../../../../components/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';
import MapInput from '../../../../../components/_inputs/MapInput';
import {I18n} from 'react-redux-i18n';
import WarningPopover from "../../../../../components/WarningPopover";

const CreateGroupForm = ({
  confirmed,
  onSubmit,
  hobbiesOptions,
  gendersOptions,
  __name,
  __details,
  __amount,
  __images,
  __startDate,
  __endDate,
  __hobbies,
  __latitude,
  __longitude,
  __formattedAddress,
  __event,
  __gender,
  __userRoles,
  getRolesOptions,
  onRolesChange,
  role,
  onGenderChange,
  onNameChange,
  onDetailsChange,
  onAmountChange,
  onImageChange,
  onHobbiesChange,
  deleteImage,
  cropImage,
  setDefaultImage,
  defaultImageIndex,
  basedOnEventGroup,
  onDatesChange,
  setCoordinates,
  errors,
  isFetching,
  goBackTogGroups
 }) => (
   <div>
    <form
        className={s.root}
        onSubmit={onSubmit}
    >
        <div className="form-group">
            <label htmlFor="group.name">
              {I18n.t('general.formContainer.title')} <span className={s.required}>*</span>
            </label>
            <input
              id="group.name"
              name="group[name]"
              type="text"
              className="idle-input"
              value={__name}
              onChange={onNameChange}
              required
              maxLength="255"
            />
        </div>

        <div className={classes("form-group" , s.containnerEditText)}>
          <label htmlFor="group.details">
              {I18n.t('general.formContainer.details')}
          </label>

          <div className={classes("form-block", s.editText)} id="group.details">
            <Editor
              toolbarClassName="editor-toolbar"
              editorClassName="editor-texarea"
              editorState={__details}
              onEditorStateChange={onDetailsChange}
            />
            <p className="info-row">
              {I18n.t('general.formContainer.maxEditorLength')}
            </p>
          </div>
        </div>

        <div className="form-group">
            <label htmlFor="group.amount">
              {I18n.t('general.formContainer.amount')} <span className={s.required}>*</span>
            </label>

            <input
              id="group.amount"
              name="group[amount]"
              type="number"
              className="idle-input"
              value={__amount}
              onChange={onAmountChange}
              required
              min="0"
            />
        </div>

        {
          (!basedOnEventGroup && (
            <div className="form-group">
                <label htmlFor="group.period">
                    {I18n.t('general.formContainer.period')}
                </label>

                <div id="group.period" className="form-block">
                  <TimeRangePicker
                      imputDateTimeFormat={I18n.t('formats.dateTime')}
                      datePickerFormat={I18n.t('formats.date')}
                      timePickerFormat={I18n.t('formats.time')}
                      intervalCheckBox={false}
                      hasInterval
                      extended
                      defaultStart={__startDate}
                      defaultEnd={__endDate}
                      enablePrevDaysToNow={false}
                      onChange={onDatesChange}
                  />
                </div>
            </div>
          )) || (
            <div className="form-group">
                <label htmlFor="group.event">
                  {I18n.t('general.formContainer.event')}
                </label>

                <div id="group.event" className="form-block">
                  <input
                    name="group[event]"
                    type="text"
                    value={__event.label}
                    className="idle-input disabled"
                    disabled
                  />
                </div>
            </div>
          )
        }

        {
          !role &&(
            <div className="form-group">
              <label>
                {I18n.t('profile.editProfile.profileDetails.roles')}
              </label>

              <div id="post.role" className="form-block">
                <Select
                  name="post[role]"
                  value={__userRoles}
                  options={getRolesOptions}
                  onChange={onRolesChange}
                  optionClassName="needsclick"
                  multi={false}
                />
              </div>
            </div>
          )
        }

        {
          !basedOnEventGroup && (
            <div>
              <div className="form-group">
                <label>
                  {I18n.t('profile.editProfile.profileDetails.audience')} <span className={s.required}>*</span>
                </label>

                <div id="event.hobbies" className="form-block">
                  <Select
                    value={__gender}
                    options={gendersOptions}
                    onChange={onGenderChange}
                    optionClassName="needsclick"
                    multi={false}
                  />
                </div>
              </div>

              <div className="form-group">
                  <label htmlFor="group.images">
                    {I18n.t('general.formContainer.images')} <span className={s.required}>*</span>
                  </label>

                  <div
                    id="group.images"
                    className="form-block"
                  >
                    <GalleryInput
                      images={__images}
                      onImageChange={onImageChange}
                      defaultImageIndex={defaultImageIndex}
                      onChangeDefaultImage={setDefaultImage}
                      onDeleteImage={deleteImage}
                      onCropImage={cropImage}
                    />
                  </div>
              </div>

              <div className="form-group">
                <label>
                  {I18n.t('general.formContainer.location')} <span className={s.required}>*</span>
                </label>

                <div className={classes('form-block', s.mapInput)}>
                  <MapInput
                    sendCoordinates={setCoordinates}
                    location={{lat: __latitude, lng: __longitude, formattedAddress: __formattedAddress}}
                    restrictions={{types: ['(cities)']}}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="group.hobbies">
                  {I18n.t('general.formContainer.hobbies')} <span className={s.required}>*</span>
                </label>

                <div id="group.hobbies" className="form-block">
                  <MultipleAdd
                    data={__hobbies}
                    dataType='hobbies'
                    haveTitles={false}
                    options={hobbiesOptions}
                    onChange={onHobbiesChange}
                  />
                </div>
              </div>
            </div>
          )
        }
        {
            errors && (
                <Alert className="alert-sm" bsStyle="danger">
                    <ErrorsList messages={errors}/>
                </Alert>
            )
        }
    </form>
     <div className={s.button}>
       <button
         className={classes('btn btn-default', {
           [s.disabled]: isFetching
         })}
         onClick={goBackTogGroups}
         disabled={isFetching}
       >
         {I18n.t('general.elements.cancel')}
       </button>
       {
         ( confirmed &&(
           <button
             className={classes('btn btn-red', {
               [s.disabled]: isFetching
             })}
             onClick={(e) => {
               onSubmit(e);
             }}
             disabled={isFetching}
           >
             {I18n.t('general.elements.submit')}
           </button>
         )) || (
           <WarningPopover>
             <button className={classes(
               'btn btn-white',
             )}>
               {I18n.t('general.elements.submit')}
             </button>
           </WarningPopover>
         )
       }
     </div>
   </div>
);

export default (withStyles(s)(CreateGroupForm));
