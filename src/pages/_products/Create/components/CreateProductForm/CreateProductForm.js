import React from "react";
import classes from "classnames";
import Select, { Creatable } from "react-select";
import "react-select/dist/react-select.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {Editor} from "react-draft-wysiwyg";
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateProductForm.scss";
import ErrorsList from "../../../../../components/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';

const CreateProductForm = ({
  confirmed,
  isFetching,
  onSubmit,
  hobbiesOptions,
  brandOptions,
  gendersOptions,
  getRolesOptions,
  onRolesChange,
  role,
  __images,
  __title,
  __description,
  __brand,
  __suggestedBrand,
  __userRoles,
  __hobbies,
  __gender,
  brandTypeoptions,
  onBrandTypeChange,
  onSuggestedbrandChange,
  onGenderChange,
  onTitleChange,
  onDescriptionChange,
  onImageChange,
  onHobbiesChange,
  onBrandChange,
  onImageLeave,
  deleteImage,
  cropImage,
  setDefaultImage,
  defaultImageIndex,
  errors,
  goBackToProducts
}) => (
  <div>
    <form
        className={s.root}
        onSubmit={onSubmit}
    >
        <div className="form-group">
            <label htmlFor="product.title">
                {I18n.t('general.formContainer.title')} <span className={s.required}>*</span>
            </label>

            <input
                id="product.title"
                name="product[title]"
                type="text"
                className="idle-input"
                value={__title}
                onChange={onTitleChange}
                required
                maxLength="255"
            />
        </div>

        <div className={classes("form-group" , s.containnerEditText)}>
          <label htmlFor="product.description">
            {I18n.t('general.formContainer.description')}
          </label>

          <div className={classes("form-block", s.editText)} id="product.description">
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
            <label htmlFor="product.brand">
                {I18n.t('general.formContainer.brand')} <span className={s.required}>*</span>
            </label>

            <div id="product.brand" className="form-block">
              <Creatable
                className={s.brandSelect}
                value={__brand}
                options={brandOptions}
                onChange={onBrandChange}
                multi={false}
                promptTextCreator={(value) => {
                  return  `${I18n.t('general.formContainer.suggestABrand')}: ${value}`}
                }
              />
            </div>
        </div>

        <div className="form-group">
            <label htmlFor="product.images">
                {I18n.t('general.formContainer.images')} <span className={s.required}>*</span>
            </label>

            <div
                id="group.images"
                className="form-block"
            >
                <GalleryInput
                    images={__images}
                    cropAspect={0}
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
            {I18n.t('profile.editProfile.profileDetails.audience')} <span className={s.required}>*</span>
          </label>

          <div className="form-block">
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
        <label htmlFor="product.hobbies">
          {I18n.t('general.formContainer.hobbies')} <span className={s.required}>*</span>
        </label>

        <div id="product.hobbies" className="form-block">
          <MultipleAdd
            data={__hobbies}
            dataType='hobbies-filters'
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
        onClick={goBackToProducts}
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

export default withStyles(s)(CreateProductForm);
