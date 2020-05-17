import React from "react";
import moment from 'moment';
import "react-select/dist/react-select.css";
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import ErrorsList from '../../../../../../components/ErrorsList/ErrorsList';
import Datetime from 'react-datetime';
import Select from "react-select";
import 'react-datetime/css/react-datetime.css'
import MultipleAdd from '../../../../../../components/MultipleAdd/MultipleAddContainer';
import GalleryInput from '../../../../../../components/_inputs/GalleryInput/GalleryInput';
import ChangeImagePopup from '../../../../../../components/ChangeImagePopup/Container';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../ProfileDetails.scss";
import WarningPopover from "../../../../../../components/WarningPopover";

const ProfessionalEdit = ({
  __firstName,
  __lastName,
  __dateOfBirth,
  __images,
  __avatar,
  __socialMediaLinks,
  __workingPlaces,
  __studies,
  __phoneNumber,
  __description,
  __blogLanguages,
  __prosParent,
  __hobbies,
  hasAvatar,
  isFetching,
  hasParentSelector,
  toBeProsInvitationsList,
  invitationsToBeProsAreLoaded,
  isMobile,
  prosRole,
  hasPassword,
  popupIsOpen,
  onAvatarChange,
  deleteAvatar,
  onImageChange,
  defaultImageIndex,
  setDefaultImage,
  deleteImage,
  cropImage,
  onFirstNameChange,
  onLastNameChange,
  onDescriptionChange,
  onSocialMediaLinksChange,
  onStudiesChange,
  onworkingPlacesChange,
  onBlogLanguagesChange,
  onHobbiesChange,
  onCancelEdit,
  onPhoneNumberChange,
  onDateOfBirthChange,
  onProsParentChange,
  switchPasswordPopup,
  blogLanguagesList,
  hobbiesList,
  onSubmit,
  errors,
  publicEmail,
  onEmailChange,
  confirmed,
}) => (
  <div>
    <form className={s.root} onSubmit={onSubmit}>
      <div className={classes(
        s.options,
        {[s.mobile]: isMobile}
      )}>
        {
          hasAvatar && (
            <ChangeImagePopup
              boxClassName={s.avatar}
              popupLabel={I18n.t('profile.editProfile.profileDetails.addPhoto')}
              iconClassName="icon-plus"
              userRole="professional"
              imageWidth={200}
              image={__avatar}
              onImageChange={onAvatarChange}
              deleteImage={deleteAvatar}
            />
          )
        }
        <div className={s.profileDetails}>
          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.firstName')} <span className={s.required}>*</span>
            </label>
            <input
              value={__firstName}
              onChange={onFirstNameChange}
              className="form-control"
              type="text"
              required
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.lastName')} <span className={s.required}>*</span>
            </label>
            <input
              value={__lastName}
              onChange={onLastNameChange}
              className="form-control"
              type="text"
              required
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.description')}
            </label>
            <textarea
              type="text"
              className={`${s.textarea} form-control`}
              value={__description}
              onChange={onDescriptionChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.emailPublic')}
            </label>
            <input
              value={publicEmail}
              onChange={onEmailChange}
              className="form-control"
              type="email"
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.gallery')} <span className={s.required}>*</span>
            </label>
            <GalleryInput
              width={250}
              images={__images}
              onImageChange={onImageChange}
              defaultImageIndex={defaultImageIndex}
              onChangeDefaultImage={setDefaultImage}
              onDeleteImage={deleteImage}
              onCropImage={cropImage}
            />
          </div>

          <div className={`${s.datePickerContainer} form-group`}>
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.birthDate')}
            </label>

            <Datetime
              readOnly
              closeOnSelect
              value={__dateOfBirth ? __dateOfBirth :  ''}
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
              {I18n.t('profile.editProfile.profileDetails.socialMediaLinks')}
            </label>
            <MultipleAdd
              data={__socialMediaLinks}
              dataType={'socialMediaLinks'}
              onChange={onSocialMediaLinksChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.studies')} <span className={s.required}>*</span>
            </label>
            <MultipleAdd
              data={__studies}
              dataType={'studies'}
              onChange={onStudiesChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.workingPlaces')} <span className={s.required}>*</span>
            </label>
            <MultipleAdd
              data={__workingPlaces}
              dataType={'workingPlaces'}
              onChange={onworkingPlacesChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.phoneNumber')}
            </label>
            <input
              value={__phoneNumber}
              onChange={onPhoneNumberChange}
              placeholder={'+373xxxxxxxx'}
              className="form-control"
              type="tel"
              pattern="^[\d\(\)\-+]+$"
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.domeins')} <span className={s.required}>*</span>
            </label>
            <MultipleAdd
              data={__hobbies}
              dataType='hobbies'
              options={hobbiesList}
              haveTitles
              role={prosRole}
              onChange={onHobbiesChange}
            />
          </div>

          {
            hasParentSelector && invitationsToBeProsAreLoaded && (
              <div className="form-group">
                <label className="control-label">
                  {I18n.t('profile.editProfile.profileDetails.invitedBy')}
                </label>

                <Select
                  value={__prosParent}
                  options={toBeProsInvitationsList}
                  onChange={onProsParentChange}
                  optionClassName="needsclick"
                  multi={false}
                />
              </div>
            )
          }

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
        {
          ( confirmed &&(
            <button
              type="submit"
              className='btn btn-red'
            >
              {
                isFetching
                  ? I18n.t('profile.editProfile.profileDetails.saving')
                  : I18n.t('profile.editProfile.profileDetails.save')
              }
            </button>
          )) ||  (
            <WarningPopover fullName={I18n.t('general.components.accountConfirmPopover')}>
              <span
                className='btn btn-red'
              >
                {I18n.t('profile.editProfile.profileDetails.save')}
              </span>
            </WarningPopover>
          )
        }

      </div>
    </form>
  </div>
);

export default withStyles(s)(ProfessionalEdit);
