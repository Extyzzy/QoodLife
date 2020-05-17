import React from "react";
import moment from 'moment';
import Select from "react-select";
import classes from 'classnames';
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import ErrorsList from '../../../../../../components/ErrorsList/ErrorsList';
import PlacesAutocomplete from '../../../../../../components/_inputs/PlacesAutocomplete/PlacesAutocomplete';
import ChangeImagePopup from '../../../../../../components/ChangeImagePopup/Container';
import MultipleAdd from '../../../../../../components/MultipleAdd/MultipleAddContainer';
import Datetime from 'react-datetime';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import 'react-datetime/css/react-datetime.css'
import "react-select/dist/react-select.css";
import s from "../ProfileDetails.scss";

const Edit = ({
  __firstName,
  __lastName,
  __avatar,
  __gender,
  __blogLanguages,
  __hobbies,
  __children,
  __phoneNumber,
  __dateOfBirth,
  __location,
  __hobbiesForChildrens,
  onHobbiesForChildrensChange,
  isMobile,
  hasPassword,
  popupIsOpen,
  showChildrenHobbiesSelect,
  childrenHobbiesOptions,
  onAvatarChange,
  onDeleteAvatar,
  onCropAvatar,
  onFirstNameChange,
  onLastNameChange,
  onBlogLanguagesChange,
  onDescriptionChange,
  onGenderChange,
  onHobbiesChange,
  switchPasswordPopup,
  onCancelEdit,
  onPlaceChange,
  onChildrensChange,
  onPhoneNumberChange,
  onDateOfBirthChange,
  blogLanguagesList,
  gendersOptions,
  hobbiesList,
  onSubmit,
  errors,
}) => (
  <div>
    <form className={s.root} onSubmit={onSubmit}>
      <div className={classes(
        s.options,
        {[s.mobile]: isMobile},
      )}>
        <ChangeImagePopup
          boxClassName={s.avatar}
          popupLabel={I18n.t('profile.editProfile.profileDetails.addPhoto')}
          iconClassName="icon-plus"
          userRole="member"
          imageWidth={200}
          image={__avatar}
          onImageChange={onAvatarChange}
          deleteImage={onDeleteAvatar}
        />

        <div className={s.profileDetails}>
          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.location')}
            </label>
            <PlacesAutocomplete
              className="form-control"
              updateOnInputChange
              value={__location? __location.label : ''}
              placeholder={I18n.t('general.components.mapInput')}
              onChange={onPlaceChange}
            />
          </div>

          <div className={`${s.datePickerContainer} form-group`}>
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.birthDate')}
            </label>

            <Datetime
              readOnly
              closeOnSelect
              value={__dateOfBirth}
              viewMode={'years'}
              dateFormat={'DD/MM/YYYY'}
              timeFormat={false}
              onChange={onDateOfBirthChange}
              isValidDate={current => {
                return (
                  current.isBefore(
                    moment().subtract(3, 'years')
                  )
                )
              }}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.gender')}
            </label>

            <Select
              value={__gender}
              options={gendersOptions}
              onChange={onGenderChange}
              optionClassName="needsclick"
              multi={false}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.childrens')}
            </label>
            <MultipleAdd
              data={__children}
              dataType='childrens'
              onChange={onChildrensChange}
            />
          </div>

          {
            showChildrenHobbiesSelect && (
              <div className="form-group">
                <label className="control-label">
                  {I18n.t('profile.editProfile.profileDetails.childrenHobbies')}
                </label>
                <Select
                  value={__hobbiesForChildrens}
                  options={childrenHobbiesOptions}
                  onChange={onHobbiesForChildrensChange}
                  optionClassName="needsclick"
                  closeOnSelect={false}
                  multi
                />
              </div>
            )
          }

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.hobbies')}
            </label>
            <Select
              value={__hobbies}
              options={hobbiesList}
              onChange={onHobbiesChange}
              optionClassName="needsclick"
              closeOnSelect={false}
              multi
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.language')}
            </label>
            <Select
              value={__blogLanguages}
              options={blogLanguagesList}
              onChange={onBlogLanguagesChange}
              optionClassName="needsclick"
              closeOnSelect={false}
              multi
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.firstName')}
            </label>
            <input
              value={__firstName}
              onChange={onFirstNameChange}
              className="form-control"
              type="text"
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.lastName')}
            </label>
            <input
              value={__lastName}
              onChange={onLastNameChange}
              className="form-control"
              type="text"
            />
          </div>

          {
            errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={errors} />
              </Alert>
            )
          }
        </div>
      </div>
      <div className={s.formFooter}>
        <button
          type="button"
          onClick={onCancelEdit}
          className='btn'
        >
          {I18n.t('profile.editProfile.profileDetails.cancel')}
        </button>
        <button
          type="submit"
          className='btn btn-red'
        >
          {I18n.t('profile.editProfile.profileDetails.save')}
        </button>
      </div>
    </form>
  </div>
);

export default withStyles(s)(Edit);
