import React from 'react';
import { I18n } from 'react-redux-i18n';
import classes from 'classnames';
import PlacesAutocomplete from '../../../../components/_inputs/PlacesAutocomplete';
import GalleryInput from '../../../../components/_inputs/GalleryInput';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../MultipleAdd.scss';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import WarningPopover from '../../../WarningPopover';

const Form = ({
  __description,
  __schedule,
  __images,
  __defaultImageIndex,
  __location,
  __isDefault,
  branchesList,
  isMobile,
  onSubmit,
  onClose,
  onLocationChange,
  onImageChange,
  onDeleteImage,
  setDefaultImage,
  onCropImage,
  onScheduleChange,
  onSetAsDefault,
  onDescriptionChange
}) => (
  <div className={s.childFormContainer}>
    <div className="form-group">
      <label>{I18n.t('general.components.multipleAdd.schedule')}</label>
      <input
        value={__schedule}
        onChange={onScheduleChange}
        className={classes('idle-input', {
          mobile: isMobile
        })}
        type="text"
      />
    </div>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.gallery')}{' '}
        <span className={s.required}>*</span>
      </label>
      <div
        className={classes('form-block', {
          [s.galleryMobile]:
            isMobile &&
            window.location.href.indexOf('/profile/settings/place') !== -1
        })}
      >
        <GalleryInput
          width={257}
          images={__images}
          onImageChange={onImageChange}
          defaultImageIndex={__defaultImageIndex}
          onChangeDefaultImage={setDefaultImage}
          onDeleteImage={onDeleteImage}
          onCropImage={onCropImage}
        />
      </div>
    </div>
    <div className="form-group">
      <label>
        {I18n.t('general.components.multipleAdd.location')}{' '}
        <span className={s.required}>*</span>
      </label>
      <div className="form-block">
        <PlacesAutocomplete
          className={classes('idle-input', 'placesAutocomplete', {
            mobile: isMobile,
            [s.placesMobile]:
              isMobile &&
              window.location.href.indexOf('/profile/settings/place') !== -1
          })}
          value={__location ? __location.label : ''}
          placeholder={I18n.t('general.components.multipleAdd.locationInput')}
          updateOnInputChange
          onChange={onLocationChange}
        />
      </div>
    </div>
    <div className={classes('form-group', s.containnerEditText)}>
      <label>
        {I18n.t('general.components.multipleAdd.description')}{' '}
        <span className={s.required}>*</span>
      </label>

      <div
        className={classes('form-block', s.editText, {
          [s.editorMobile]:
            isMobile &&
            window.location.href.indexOf('/profile/settings/place') !== -1
        })}
        id="post.content"
      >
        <Editor
          toolbarClassName="editor-toolbar"
          editorClassName={classes('editor-texarea', [s.toolbarEditor])}
          editorState={__description}
          onEditorStateChange={onDescriptionChange}
        />
        <p className="info-row">
          {I18n.t('general.formContainer.maxEditorLength')}
        </p>
      </div>
    </div>
    <div className="form-group">
      <input
        type="checkbox"
        className="form-checkbox"
        onChange={onSetAsDefault}
        checked={__isDefault}
      />
      <label className="control-label">
        {I18n.t('general.components.multipleAdd.defaultBranch')}
      </label>
    </div>
    <div className={s.formFooter}>
      {(!!__images.length &&
        __location &&
        __location.latitude &&
        __description !== '' && (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onSubmit}
          >
            {I18n.t('general.components.multipleAdd.addButton')}
          </button>
        )) || (
        <WarningPopover
          fullName={
            __location && __location.latitude
              ? I18n.t('general.components.multipleAdd.warning')
              : I18n.t('general.components.multipleAdd.locationInput')
          }
        >
          <span className="btn btn-red btn-sm">
            {I18n.t('general.components.multipleAdd.addButton')}
          </span>
        </WarningPopover>
      )}
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
