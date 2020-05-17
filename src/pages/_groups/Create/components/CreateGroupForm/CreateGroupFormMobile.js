import React from "react";
import classes from "classnames";
import Select from "react-select";
import "react-select/dist/react-select.css";
import { Alert } from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { I18n } from 'react-redux-i18n';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateGroupFormMobile.scss";

import TimeRangePicker from '../../../../../components/TimeRangePicker';
import ErrorsList from "../../../../../components/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';
import MapInput from '../../../../../components/_inputs/MapInput';

const CreateGroupForm = ({
  isFetching,
  onSubmit,
  hobbiesOptions,
  gendersOptions,
  __gender,
  __name,
  __details,
  __amount,
  __images,
  __startDate,
  __endDate,
  __hobbies,
  __event,
  __latitude,
  __longitude,
  __formattedAddress,
  __userRoles,
  goBackTogGroups,
  getRolesOptions,
  onRolesChange,
  role,
  onGenderChange,
  onNameChange,
  onDetailsChange,
  onAmountChange,
  onImageChange,
  onHobbiesChange,
  imageHoverIndex,
  deleteImage,
  cropImage,
  setDefaultImage,
  defaultImageIndex,
  onDatesChange,
  focusedInput,
  onFocusChange,
  setCoordinates,
  basedOnEventGroup,
  errors,
 }) => (
  <div>
    <form
        className={s.root}
        onSubmit={onSubmit}
    >
        <div className="form-group">
          <label htmlFor="group.name">
            {I18n.t('general.formContainer.title')}
          </label>

          <input
            id="group.name"
            name="group[name]"
            type="text"
            className={classes('idle-input', s.input)}
            value={__name}
            onChange={onNameChange}
            required
            maxLength="255"
          />
        </div>

        <div className="form-group">
          <label htmlFor="group.details">
            {I18n.t('general.formContainer.details')}
          </label>

          <div id="group.details" className={
            classes(
              'from-block',
              s.input
            )
          }>
            <Editor
              toolbarClassName="editor-toolbar"
              editorClassName="editor-texarea"
              editorState={__details}
              onEditorStateChange={onDetailsChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="group.amount">
            {I18n.t('general.formContainer.amount')}
          </label>

          <input
            id="group.amount"
            name="group[amount]"
            type="number"
            className={classes('idle-input', s.input)}
            value={__amount}
            onChange={onAmountChange}
            required
            min="1"
          />
        </div>

        {
          (!basedOnEventGroup && (
            <div id="group.period" className="form-block">
              <TimeRangePicker
                inputClass={s.oneColumn}
                contentClass={s.timePickerContent}
                imputDateTimeFormat={I18n.t('formats.dateTime')}
                datePickerFormat={I18n.t('formats.date')}
                timePickerFormat={I18n.t('formats.time')}
                intervalCheckBox={false}
                hasInterval={true}
                defaultStart={__startDate}
                defaultEnd={__endDate}
                enablePrevDaysToNow={false}
                onChange={onDatesChange}
              />
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
          (!role || !basedOnEventGroup) && (
            <div className="form-group">
              <label>
                {I18n.t('profile.editProfile.profileDetails.roles')}
              </label>

              <div id="post.role" className={classes('form-block', s.input)}>
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

        <div className="form-group">
          <label>
            {I18n.t('profile.editProfile.profileDetails.gender')}
          </label>

          <div id="event.hobbies" className={classes('form-block', s.input)}>
            <Select
              value={__gender}
              options={gendersOptions}
              onChange={onGenderChange}
              optionClassName="needsclick"
              multi={false}
            />
          </div>
        </div>

        {
          !basedOnEventGroup && (
            <div>
              <div className={classes('form-group', s.image)}>
                <label htmlFor="group.images">
                  {I18n.t('general.formContainer.images')}
                </label>

                <GalleryInput
                  images={__images}
                  onImageChange={onImageChange}
                  defaultImageIndex={defaultImageIndex}
                  onChangeDefaultImage={setDefaultImage}
                  onDeleteImage={deleteImage}
                  onCropImage={cropImage}
                />
              </div>
              <div className="form-group">
                <label>
                  {I18n.t('general.formContainer.location')}
                </label>
                <div className={s.mapInput}>
                  <MapInput
                    sendCoordinates={setCoordinates}
                    location={{
                      lat: __latitude,
                      lng: __longitude,
                      formattedAddress: __formattedAddress
                    }}
                  />
                </div>
              </div>
              <div className="form-group">
                  <label htmlFor="group.hobbies">
                    {I18n.t('general.formContainer.hobbies')}
                  </label>

                  <div className={classes(
                      "form-block",
                      s.input,
                      s.displayBlock
                  )}>
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
      <button
        className={classes('btn btn-red', {
          [s.disabled]: isFetching
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

export default withStyles(s)(CreateGroupForm);
