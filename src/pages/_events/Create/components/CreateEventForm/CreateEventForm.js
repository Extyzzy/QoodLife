import React from "react";
import classes from "classnames";
import Select from "react-select";
import "react-select/dist/react-select.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Editor} from "react-draft-wysiwyg";
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateEventForm.scss";
import TimeRangePicker from '../../../../../components/TimeRangePicker';
import ErrorsList from "../../../../../components/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput';
import MapInput from '../../../../../components/_inputs/MapInput';
import MultipleAdd from '../../../../../components/MultipleAdd';
import WarningPopover from "../../../../../components/WarningPopover";
import TimeField from 'react-simple-timefield';
import moment from "moment";

const CreateEventForm = ({
  confirmed,
  onSubmit,
  hobbiesOptions,
  gendersOptions,
  __title,
  __description,
  __images,
  __startDate,
  __endDate,
  __hobbies,
  __formattedAddress,
  __latitude,
  __longitude,
  __gender,
   getRolesOptions,
   onRolesChange,
   __userRoles,
   role,
  onTitleChange,
  onGenderChange,
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
  isFetching,
  goBackToEvents,
 __filterCalendar,
 filterCalendarOptions,
 onFilterCalendar,
 placeCalendar,
 __weekDays,
 onDayAdd,
 onDayRemove,
 isAdmin,
 __timeStart,
 __timeEnd,
 onTimeChangeStart,
 onTimeChangeEnd,
 __typeofRange,
 onTypeofRangeChange,
 daysOfWeekOptions,
 handleFocusStart,
 handleFocusEnd,
 __ticketURL,
 onTicketURLChange,
}) => (
  <div>
  <form
    className={s.root}
    onSubmit={onSubmit}
  >
    <div className="form-group">
      <label htmlFor="event.title">
        {I18n.t('general.formContainer.title')} <span className={s.required}>*</span>
      </label>

      <input
        id="event.title"
        name="event[title]"
        type="text"
        className="idle-input"
        value={__title}
        onChange={onTitleChange}
        required
        maxLength="255"
      />
    </div>

    <div className={classes("form-group" , s.containnerEditText)}>
      <label htmlFor="event.intro">
        {I18n.t('general.formContainer.description')}
      </label>

      <div className={classes("form-block", s.editText)} id="event.intro">
        <Editor
          toolbarClassName="editor-toolbar"
          editorClassName="editor-texarea"
          editorState={__description}
          onEditorStateChange={onDescriptionChange}
        />
        <p className="info-row">
          {I18n.t('general.formContainer.maxEditorLength')}
        </p>
      </div>
    </div>

    <div className="form-group">
      <label htmlFor="event.images">
        {I18n.t('general.formContainer.images')} <span className={s.required}>*</span>
      </label>

      <div
        id="event.images"
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
      <label htmlFor="event.period">
        {I18n.t('general.formContainer.period')} <span className={s.required}>*</span>
      </label>

      <div id="event.typeofRange" className="form-block">
        <Select
          name="event[typeofRange]"
          optionClassName="needsclick"
          value={__typeofRange}
          options={[
            {
              value: 'daily',
              label: 'Zilnic'
            },
            {
              value: 'periodic',
              label: 'Periodic'
            },
          ]}
          onChange={onTypeofRangeChange}
        />
      </div>
    </div>

    {
      __typeofRange.value  === 'daily' &&(
        <div className="form-group">
          <label />

          <div id="event.period" className="form-block">
            <div className={s.timeRangeContainer}>
            <TimeRangePicker
              hasInterval
              enablePrevDaysToNow
              imputDateTimeFormat={'DD/MM/YYYY'}
              datePickerFormat={'DD/MM/YYYY'}
              intervalCheckBox={false}
              defaultStart={__startDate ? __startDate : moment().utc().startOf('day').unix()}
              defaultEnd={__endDate ? __endDate : moment().utc().endOf('day').unix() }
              onChange={onDatesChange}
            />

            <div className={s.clockContainer}>
              <i className='icon-clock' />
              <TimeField
                value={__timeStart ? __timeStart : '00:00'}
                onChange={onTimeChangeStart}
                input={
                  <input
                    type="text"
                    className={s.clock}
                    ref={input => handleFocusStart(input) }
                  />}
              />
            </div>

              <i className={
                classes(
                  'icon-arrow-right',
                  s.clockDirection
                )} />

            <div className={s.clockContainer}>
              <i className='icon-clock' />
              <TimeField
                value={__timeEnd ? __timeEnd : '23:00'}
                onChange={onTimeChangeEnd}
                input={
                  <input
                    type="text"
                    className={s.clock}
                    id='foobar'
                    ref={input => handleFocusEnd(input) }
                  />}
              />
            </div>
            </div>
          </div>
        </div>
      )
    }

    {
      __typeofRange.value  === 'periodic' &&(
        <div className="form-group">
          <label />

          <div id="event.weedDays" className="form-block">
            <div id="event.period" className="form-block">
              <div className={s.timeRangeContainer}>
                <TimeRangePicker
                  imputDateTimeFormat={'DD/MM/YYYY'}
                  datePickerFormat={'DD/MM/YYYY'}
                  intervalCheckBox={false}
                  hasInterval
                  defaultStart={__startDate ? __startDate : moment().utc().startOf('day').unix()}
                  defaultEnd={__endDate ? __endDate : moment().utc().endOf('day').unix()}
                  enablePrevDaysToNow={false}
                  onChange={onDatesChange}
                />

                <div className={s.clockContainer}>
                  <i className='icon-clock' />
                  <TimeField
                    value={__timeStart ? __timeStart : '00:00'}
                    onChange={onTimeChangeStart}
                    input={
                      <input
                        type="text"
                        className={s.clock}
                        ref={input => handleFocusStart(input) }
                      />}
                  />
                </div>

                <i className={
                  classes(
                    'icon-arrow-right',
                    s.clockDirection
                  )} />

                <div className={s.clockContainer}>
                  <i className='icon-clock' />
                  <TimeField
                    value={__timeEnd ? __timeEnd : '23:00'}
                    onChange={onTimeChangeEnd}
                    input={
                      <input
                        type="text"
                        className={s.clock}
                        ref={input => handleFocusEnd(input) }
                      />}
                  />
                </div>
              </div>
            </div>

            <div className={s.daysOfWeekOptions}>
            {
              daysOfWeekOptions.map(data => {
                const { label, value } = data;
                const selected = __weekDays ? __weekDays.find(day => day.value === data.value) : false;

                return (
                  <div
                    key={value}
                    onClick={() => selected ? onDayRemove(data) : onDayAdd(data)}
                    className={classes({
                      [s.redColor]: label === 'SUN' || label === 'SAT',
                      [s.selectedDay]: selected,
                  })}>
                    {label}
                    </div>
                )
              })
            }
            </div>

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

    <div className="form-group">
      <label>
        {I18n.t('general.formContainer.ticketURL')}
      </label>

      <input
        name="event[ticketURL]"
        type="text"
        className="idle-input"
        onFocus={e => e.target.select()}
        value={__ticketURL}
        onChange={onTicketURLChange}
      />
    </div>

    <div className="form-group">
      <label>
        {I18n.t('profile.editProfile.profileDetails.audience')} <span className={s.required}>*</span>
      </label>

      <div id="event.gender" className="form-block">
        <Select
          name="event[gender]"
          value={__gender}
          options={gendersOptions}
          onChange={onGenderChange}
          optionClassName="needsclick"
          multi={false}
        />
      </div>
    </div>

    {
      ((( role.role === 'place' || (__userRoles && __userRoles.codeUser === 'place')) && placeCalendar && placeCalendar.status) || isAdmin) && (
        <div className="form-group">
          <label>
            For Calendar Filters
          </label>

          <div id="event.calendar" className="form-block">
            <Select
              name="event[calendar]"
              value={__filterCalendar}
              options={filterCalendarOptions}
              onChange={onFilterCalendar}
              optionClassName="needsclick"
              multi={false}
            />
          </div>
        </div>
      )
    }

    <div className="form-group">
      <label>
        {I18n.t('general.formContainer.location')} <span className={s.required}>*</span>
      </label>

      <div
        className={
          classes(
            'form-block',
            s.mapInput
          )
        }
      >
        <MapInput
          sendCoordinates={setCoordinates}
          location={{lat: __latitude, lng: __longitude, formattedAddress: __formattedAddress}}
          restrictions={{types: ['(cities)']}}
        />
      </div>
    </div>

    {
      (role || __userRoles) && (
        <div className="form-group">
          <label htmlFor="event.hobbies">
            {I18n.t('general.formContainer.hobbies')} <span className={s.required}>*</span>
          </label>
          <div className="form-block">
            <MultipleAdd
              data={__hobbies}
              dataType='hobbies'
              haveTitles={false}
              options={hobbiesOptions}
              onChange={onHobbiesChange}
            />
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
        onClick={goBackToEvents}
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

export default withStyles(s)(CreateEventForm);
