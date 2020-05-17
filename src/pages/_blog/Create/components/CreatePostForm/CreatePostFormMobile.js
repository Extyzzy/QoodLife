import React from "react";
import {WithContext as ReactTags} from "react-tag-input";
import classes from 'classnames';
import Select from "react-select";
import "react-select/dist/react-select.css";
import {Alert} from "react-bootstrap";
import {Editor} from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CreatePostFormMobile.scss";
import ErrorsList from '../../../../../components/ErrorsList/ErrorsList';
import GalleryInput from '../../../../../components/_inputs/GalleryInput/GalleryInput';
import MultipleAdd from '../../../../../components/MultipleAdd';

import {I18n} from 'react-redux-i18n';
const CreatePostForm = ({
    isFetching,
    onSubmit,
    goBackToPosts,
    hobbiesOptions,
    gendersOptions,
    __title,
    __intro,
    __content,
    __image,
    __tags,
    __hobbies,
    __gender,
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
  }) => (
  <div>
    <form
      className={s.root}
      onSubmit={onSubmit}
    >

      <div className="form-group">
        <label htmlFor="post.title">
          {I18n.t('general.formContainer.title')}
        </label>

        <input
          id="post.title"
          name="post[title]"
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
        <label htmlFor="post.intro">
          {I18n.t('general.formContainer.intro')}
        </label>

        <textarea
          id="post.intro"
          name="post[intro]"
          type="text"
          className={
            classes(
              'idle-input',
              s.intro,
              s.input
            )
          }
          value={__intro}
          onChange={onIntroChange}
          required
          maxLength="350"
        />
      </div>

      <div className="form-group">
        <label htmlFor="post.content">
          {I18n.t('general.formContainer.content')}
        </label>

        <div id="post.content" className={
          classes(
            'from-block',
            s.input
          )
        }>
          <Editor
            toolbarClassName={s.toolbarEditor}
            editorClassName="editor-texarea"
            editorState={__content}
            onEditorStateChange={onContentChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="post.image">
          {I18n.t('general.formContainer.image')}
        </label>

        <GalleryInput
          images={__image ? [__image] : []}
          onImageChange={onImageChange}
          onCropImage={cropImage}
        />
      </div>

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

      <div className="form-group">
        <label htmlFor="post.tags">
          {I18n.t('general.formContainer.tags')}
        </label>

        <div id="post.tags" className={classes('form-block', s.input)}>
          <ReactTags
            tags={__tags}
            handleDelete={onTagDelete}
            handleAddition={onTagAddition}
            classNames={{
              tag: s.tag,
              tagInput: 'tag-input',
              tagInputField: 'idle-input',
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="post.hobbies">
          {I18n.t('general.formContainer.hobbies')}
        </label>

        <div id="post.hobbies" className={
          classes(
            'form-block',
            s.input
          )
        }>
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

export default withStyles(s)(CreatePostForm);
