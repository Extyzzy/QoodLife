import React from "react";
import {I18n} from 'react-redux-i18n';
import classes from "classnames";
import "react-select/dist/react-select.css";
import {Alert} from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateEventFormMobile.scss";
import MapInput from '../../../../../components/_inputs/MapInput/MapInput';
import TimeRangePicker from '../../../../../components/TimeRangePicker/TimeRangePicker';
import ErrorsList from "../../../../../components/ErrorsList/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';
import Select from "react-select";

const CreateEventForm = ({
   onSubmit,
   hobbiesOptions,
   gendersOptions,
   __gender,
   __title,
   __description,
   __images,
   __startDate,
   __endDate,
   __hobbies,
   __formattedAddress,
   __latitude,
   __longitude,
   isFetching,
   goBackToEvents,
    onGenderChange,
   onTitleChange,
   onDescriptionChange,
   onImageChange,
   onHobbiesChange,
   deleteImage,
   cropImage,
   setDefaultImage,
   defaultImageIndex,
   onDatesChange,
   setCoordinates,
   errors,
}) => (
<div>
  <form
    className={s.root}
    onSubmit={onSubmit}
  >
    <div className="form-group">
      <label>
        {I18n.t('general.formContainer.title')}
      </label>

      <input
        type="text"
        className={classes(
          'idle-input',
          s.input
        )}
        value={__title}
        onChange={onTitleChange}
        required
        maxLength="255"
      />
    </div>

    <div className="form-group">
      <label htmlFor="event.description">
        {I18n.t('general.formContainer.description')}
      </label>

      <div id="event.description" className={
        classes(
          'from-block',
          s.input
        )
      }>
        <Editor
          toolbarClassName="editor-toolbar"
          editorClassName="editor-texarea"
          editorState={__description}
          onEditorStateChange={onDescriptionChange}
        />
      </div>
    </div>

    <div className={
      classes(
      'form-group',
      s.image
    )}>
      <label>
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
      <TimeRangePicker
        imputDateTimeFormat={I18n.t('formats.dateTime')}
        datePickerFormat={I18n.t('formats.date')}
        timePickerFormat={I18n.t('formats.time')}
        intervalCheckBox={false}
        hasInterval
        defaultStart={__startDate}
        defaultEnd={__endDate}
        enablePrevDaysToNow={false}
        onChange={onDatesChange}
      />
    </div>

    <div className="form-group">
      <label>
        {I18n.t('profile.editProfile.profileDetails.gender')}
      </label>

      <div className={classes('form-block', s.input)}>
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
      <label>
        {I18n.t('general.formContainer.location')}
      </label>

      <div className={s.mapInput}>
        <MapInput
          sendCoordinates={setCoordinates}
          location={{lat: __latitude, lng: __longitude, formattedAddress: __formattedAddress}}
        />
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="event.hobbies">
        {I18n.t('general.formContainer.hobbies')}
      </label>
      <div className={classes(
        "form-block",
        s.input,
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
      onClick={goBackToEvents}
      disabled={isFetching}
    >
      {I18n.t('general.elements.cancel')}
    </button>
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
  </div>
</div>
);

export default withStyles(s)(CreateEventForm);
