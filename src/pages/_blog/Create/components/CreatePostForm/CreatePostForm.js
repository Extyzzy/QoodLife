import React from "react";
import {WithContext as ReactTags} from "react-tag-input";
import classes from 'classnames';
import Select from "react-select";
import "react-select/dist/react-select.css";
import {Alert} from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreatePostForm.scss";
import ErrorsList from '../../../../../components/ErrorsList/ErrorsList';
import GalleryInput from '../../../../../components/_inputs/GalleryInput/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd/MultipleAddContainer';
import {I18n} from 'react-redux-i18n';
import WarningPopover from "../../../../../components/WarningPopover";

const CreatePostForm = ({
                          confirmed,
                          isFetching,
                          onSubmit,
                          hobbiesOptions,
                          gendersOptions,
                          __title,
                          __intro,
                          __content,
                          __image,
                          __tags,
                          __hobbies,
                          __gender,
                          getRolesOptions,
                          onRolesChange,
                          __userRoles,
                          role,
                          onGenderChange,
                          onTitleChange,
                          onIntroChange,
                          onContentChange,
                          onImageChange,
                          cropImage,
                          onTagDelete,
                          onTagAddition,
                          onHobbiesChange,
                          errors,
                          languagesOptions,
                          onLanguagesChange,
                          __languages,
                          goBackToPosts,
                          _uploadImageCallBack
                        }) => (
  <div>
    <form
      className={s.root}
      onSubmit={onSubmit}
    >
      <div className="form-group">
        <label htmlFor="post.title">
          {I18n.t('general.formContainer.title')} <span className={s.required}>*</span>
        </label>

        <input
          id="post.title"
          name="post[title]"
          type="text"
          className="idle-input"
          value={__title}
          onChange={onTitleChange}
          required
          maxLength="255"
        />
      </div>

      <div className="form-group">
        <label htmlFor="post.intro">
          {I18n.t('general.formContainer.intro')} <span className={s.required}>*</span>
        </label>

        <textarea
          id="post.intro"
          name="post[intro]"
          type="text"
          className={
            classes(
              'idle-input',
              s.intro
            )
          }
          value={__intro}
          onChange={onIntroChange}
          required
        />
        <p className="info-intro">
          {I18n.t('general.formContainer.maxIntroductionLength')}
        </p>

      </div>

      <div className="form-group">
        <label htmlFor="post.image">
          {I18n.t('general.formContainer.image')} <span className={s.required}>*</span>
        </label>

        <div id="post.image" className="form-block">
          <GalleryInput
            images={__image ? [__image] : []}
            onImageChange={onImageChange}
            onCropImage={cropImage}
          />
        </div>
      </div>

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
        <label htmlFor="post.tags">
          {I18n.t('general.formContainer.tags')}
        </label>

        <div id="post.tags" className="form-block">
          <ReactTags
            tags={__tags}
            handleDelete={onTagDelete}
            handleAddition={onTagAddition}
            placeholder={I18n.t('general.formContainer.tagsPlaceholder')}
            classNames={{
              tag: s.tag,
              tagInput: 'tag-input',
              tagInputField: 'idle-input',
            }}
          />
          <p className="info-row">
            {I18n.t('general.formContainer.maxTagsLength')}
          </p>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="post.languages">
          {I18n.t('general.formContainer.blogLanguage')} <span className={s.required}>*</span>
        </label>

        <div id="post.hobbies" className="form-block">
          <Select
            name="post[language]"
            value={__languages}
            options={languagesOptions}
            onChange={onLanguagesChange}
            optionClassName="needsclick"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="post.hobbies">
          {I18n.t('general.formContainer.hobbies')} <span className={s.required}>*</span>
        </label>

        <div id="post.hobbies" className="form-block">
          <MultipleAdd
            data={__hobbies}
            dataType='hobbies'
            haveTitles={false}
            options={hobbiesOptions}
            onChange={onHobbiesChange}
          />
        </div>
      </div>

      <div className={classes("form-group" , s.containnerEditText)}>
        <label htmlFor="post.content">
          {I18n.t('general.formContainer.content')} <span className={s.required}>*</span>
        </label>

        <div className={classes("form-block", s.editText)} id="post.content">
          <Editor
            toolbarClassName="editor-toolbar"
            editorClassName="editor-texarea"
            editorState={__content}
            onEditorStateChange={onContentChange}
            toolbar={{
              image: {
                uploadCallback: _uploadImageCallBack,
                previewImage: true,
              },
            }}
          />
          <p className="info-row">
            {I18n.t('general.formContainer.maxEditorLength')}
          </p>
        </div>
      </div>

      {
        errors && (
          <Alert className="alert-sm" bsStyle="danger">
            <ErrorsList messages={errors} />
          </Alert>
        )
      }
    </form>
    <div className={s.button}>
      <button
        className={classes('btn btn-default', {
          [s.disabled]: isFetching
        })}
        onClick={goBackToPosts}
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

export default withStyles(s)(CreatePostForm);
