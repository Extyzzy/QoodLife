import React  from 'react';
import { Link } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Form.scss';
import Select from "react-select";
import "react-select/dist/react-select.css";
import Widget from '../../../../components/Widget';
import ErrorsList from '../../../../components/ErrorsList/ErrorsList';
import GalleryInput from '../../../../components/_inputs/GalleryInput';

const Form = ({
  name,
  defaultName,
  image,
  parent,
  parentOptions,
  categoryDetails,
  errors,
  editMode,
  isFetching,
  isLoaded,
  onSubmit,
  onCategoryNameChange,
  onParentChange,
  onImageChange,
  deleteImage,
  cropImage,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li>
        <Link to="/administration/hobbies">
          {I18n.t('administration.hobbies.hobbies')}
        </Link>
      </li>
      <li className="active">
        {(isLoaded && categoryDetails.category.name) || I18n.t('administration.hobbies.addCategory')}
      </li>
    </ul>
    <h2>{
      (editMode && isLoaded && `Edit ${categoryDetails.category.name}`) || I18n.t('administration.hobbies.addCategory')
    }</h2>

    <div className="col-sm-8">
      <Widget>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label className="control-label">
              {I18n.t('administration.hobbies.name')} - {defaultName}
            </label>
            <input
              className='form-control'
              value={name}
              onChange={onCategoryNameChange}
              required
            />
          </div>
          {
            !editMode && (
              <div className="form-group">
                <label className="control-label">
                  {I18n.t('administration.hobbies.parent')}
                </label>
                <Select
                  value={parent}
                  options={parentOptions}
                  onChange={onParentChange}
                  optionClassName="needsclick"
                  multi={false}
                />
              </div>
            )
          }
          <div className="form-group">
            <label className="control-label">
              {I18n.t('administration.hobbies.image')}
            </label>
            <GalleryInput
              cropAspect={49/25}
              width={392}
              allowNulls
              mobileV
              editable={false}
              addButtonClass={s.addPhotoZone}
              addPhotoButtonText='Add Image'
              images={image ? [image] : []}
              onImageChange={onImageChange}
              onDeleteImage={deleteImage}
              onCropImage={cropImage}
              multiple={false}
            />
          </div>
          {
            errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={errors} />
              </Alert>
            )
          }
          <div className="form-group footer">
            <Link
              className="btn btn-inverse"
              to={(editMode && isLoaded && `/administration/hobbies/${categoryDetails.category.id}`) || '/administration/hobbies'
              }
            >
              {I18n.t('administration.hobbies.cancel')}
            </Link>
            <button
              className="btn btn-inverse"
              type="submit"
              disabled={isFetching}
            >
              {
                (editMode && (
                  isFetching
                  ? I18n.t('administration.hobbies.updateupdating')
                  : I18n.t('administration.hobbies.update')
                )) || (
                  isFetching
                  ? I18n.t('administration.hobbies.creating')
                  : I18n.t('administration.hobbies.create')
                )
              }
            </button>
          </div>
        </form>
      </Widget>
    </div>
  </div>
);

export default withStyles(s)(Form);
