import React from "react";
import classes from "classnames";
import "react-select/dist/react-select.css";
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreateProductFormMobile.scss";
import ErrorsList from "../../../../../components/ErrorsList/ErrorsList";
import GalleryInput from '../../../../../components/_inputs/GalleryInput/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';
import Select from "react-select";

const CreateProductForm = ({
   isFetching,
   onSubmit,
   hobbiesOptions,
   brandOptions,
   gendersOptions,
   __gender,
   __images,
   __title,
   __description,
   __brand,
   __hobbies,
   goBackToProducts,
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
   }) => (
  <div>
    <form
        className={s.root}
        onSubmit={onSubmit}
    >
        <div className="form-group">
            <label htmlFor="product.title">
                {I18n.t('general.formContainer.title')}
            </label>

            <input
                id="product.title"
                name="product[title]"
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
            <label htmlFor="product.brand">
                {I18n.t('general.formContainer.brand')}
            </label>

            <div id="product.brand"         className={classes(
                'form-block',
                s.input
            )}>
                <Select
                    name="product[brand]"
                    value={__brand}
                    options={brandOptions}
                    onChange={onBrandChange}
                    optionClassName="needsclick"
                    multi={false}
                />
            </div>
        </div>

        <div className="form-group">
          <label htmlFor="product.description">
            {I18n.t('general.formContainer.description')}
          </label>

          <div id="product.description" className={
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

        <div className={classes('form-group', s.image)}>
          <label htmlFor="product.images">
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
            {I18n.t('profile.editProfile.profileDetails.gender')}
          </label>

          <div className={classes(
            "form-block",
            s.input,
            s.displayBlock
          )}>
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
            <label htmlFor="product.hobbies">
                {I18n.t('general.formContainer.hobbies')}
            </label>

            <div id="product.hobbies" className={classes(
                "form-block",
                s.input,
                s.displayBlock
            )}>
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
