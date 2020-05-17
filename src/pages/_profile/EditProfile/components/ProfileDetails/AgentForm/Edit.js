import React from "react";
import classes from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Alert } from "react-bootstrap";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import ErrorsList from '../../../../../../components/ErrorsList/ErrorsList';
import ChangeImagePopup from '../../../../../../components/ChangeImagePopup/Container';
import MultipleAdd from '../../../../../../components/MultipleAdd/MultipleAddContainer';
import s from "../ProfileDetails.scss";
import GalleryInput from '../../../../../../components/_inputs/GalleryInput/GalleryInput';
import WarningPopover from "../../../../../../components/WarningPopover";

const Edit = ({
   __name,
   __avatar,
   __images,
   __phoneNumber,
   __description,
   __hobbies,
   __socialMediaLinks,
   __branches,
   hasAvatar,
   isMobile,
   onAvatarChange,
   cropAvatar,
   onNameChange,
   onDescriptionChange,
   onSocialMediaLinksChange,
   onHobbiesChange,
   onCancelEdit,
   onBranchesChange,
   onPhoneNumberChange,
   placeRole,
   hobbiesList,
   onSubmit,
   errors,
   onDeleteAvatar,
   __companyEmail,
   onEmailChange,
   onImageChange,
   defaultImageIndex,
   setDefaultImage,
   deleteImage,
   cropImage,
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
              userRole="place"
              imageWidth={200}
              image={__avatar}
              onImageChange={onAvatarChange}
              deleteImage={onDeleteAvatar}
              cropAvatar={cropAvatar}
            />
          )
        }
        <div className={s.profileDetails}>
          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.name')} <span className={s.required}>*</span>
            </label>
            <input
              value={__name}
              onChange={onNameChange}
              className="form-control"
              type="text"
              required
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.emailPublic')}
            </label>
            <input
              value={__companyEmail}
              onChange={onEmailChange}
              className="form-control"
              type="email"
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
              {I18n.t('profile.editProfile.profileDetails.branches')} <span className={s.required}>*</span>
            </label>
            <MultipleAdd
              data={__branches}
              dataType='branches'
              onChange={onBranchesChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.socialMediaLinks')}
            </label>
            <MultipleAdd
              data={__socialMediaLinks}
              dataType='socialMediaLinks'
              onChange={onSocialMediaLinksChange}
            />
          </div>

          <div className="form-group">
            <label className="control-label">
              {I18n.t('profile.editProfile.profileDetails.domeins')} <span className={s.required}>*</span>
            </label>
            <MultipleAdd
              data={__hobbies}
              options={hobbiesList}
              dataType='hobbies'
              haveTitles
              role={placeRole}
              onChange={onHobbiesChange}
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
        {
          ( confirmed &&(
            <button
              type="submit"
              className='btn btn-red'
            >
              {I18n.t('profile.editProfile.profileDetails.save')}
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

export default withStyles(s)(Edit);
