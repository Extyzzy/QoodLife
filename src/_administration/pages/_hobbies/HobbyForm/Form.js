import React  from 'react';
import { Link } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Select from "react-select";
import "react-select/dist/react-select.css";
import ErrorsList from '../../../../components/ErrorsList/ErrorsList';
import s from './Form.scss';
import Widget from '../../../../components/Widget';
import GalleryInput from '../../../../components/_inputs/GalleryInput';
import MultipleAdd from '../../../../components/MultipleAdd';

const Form = ({
  name,
  image,
  audience,
  forChildren,
  age_groups_list,
  age_interval,
  place_titles,
  professional_titles,
  hobby_filters,
  parent_category,
  hobbyDetails,
  categoryDetails,
  availableForFav,
  errors,
  editMode,
  isFetching,
  isLoaded,
  onSubmit,
  onCancelForm,
  onHobbyFiltersChange,
  onHobbyNameChange,
  onAudienceChange,
  onAudienceAgeIntervalChange,
  onImageChange,
  deleteImage,
  cropImage,
  onPlaceTitlesChance,
  onParentChange,
  onProfessionalTitlesChange,
  onFavAvailabilityStatusChange,
  avalaibleCategoriesList,
  audienceOptionsForAdults,
  onEighteenPlusStatusChange,
  publicStatusChange,
  hobbyIsPublic,
  eighteenPlus,
  userLanguage,
  filter_titles,
  onFilterTitlesChange,
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
      <li>
        {
          (isLoaded && !editMode && (
            <Link to={`/administration/hobbies/${hobbyDetails.category.id}`}>
              {hobbyDetails.category.name}
            </Link>
          )) || ( categoryDetails && (
            <Link to={`/administration/hobbies/${categoryDetails.category.id}`}>
              {categoryDetails.category.name}
            </Link>
          ))
        }
      </li>
      <li className="active">
        {(
          editMode && isLoaded && hobbyDetails.name
          ) || I18n.t('administration.hobbies.newHobby')
        }
      </li>
    </ul>
    <h2>
      {(
        editMode && isLoaded &&
        `${I18n.t('administration.hobbies.edit')} ${hobbyDetails.name}`
        ) || I18n.t('administration.hobbies.addHobby')
      }
    </h2>
    <h3>Setari pentru limba: {userLanguage.full}</h3>
    {   console.info(hobbyDetails)}
    <div className="row">
      <div className="col-sm-8">
        <Widget>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label className="control-label">
                {I18n.t('administration.hobbies.name')} -
                {hobbyDetails && (' ' + hobbyDetails.allNames.name_ro)}
              </label>
              <input
                className='form-control'
                value={name}
                onChange={onHobbyNameChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="control-label">
                Audience
              </label>
              {
                (!!categoryDetails
                && categoryDetails.category.for_children && (
                  <input
                    className='form-control'
                    value='Pentru Copii'
                    disabled
                  />
                )) || (
                  <Select
                    value={audience}
                    options={audienceOptionsForAdults}
                    onChange={onAudienceChange}
                    optionClassName="needsclick"
                    multi={false}
                  />
                )
              }
            </div>

            {
              ((audience && audience.value !== 'adults') || (!!categoryDetails
              && categoryDetails.category.for_children)) && (
                <div className="form-group">
                  <label className="control-label">
                    Age Groups
                  </label>
                  <Select
                    value={age_interval}
                    options={age_groups_list}
                    onChange={onAudienceAgeIntervalChange}
                    optionClassName="needsclick"
                    multi
                  />
                </div>
              )
            }

            {
              audience && audience.value === 'adults' &&(
                <div className="form-group">
                  <input
                    type="checkbox"
                    className='form-checkbox'
                    onChange={onEighteenPlusStatusChange}
                    checked={eighteenPlus}
                  />
                  <label className="control-label">
                    This hobby is 18 + ?
                  </label>
                </div>
              )
            }

            {
              isLoaded && editMode && (
                <div>
                  <div className="form-group">
                    <label className="control-label">
                      {I18n.t('administration.hobbies.parent')}
                    </label>
                    <Select
                      value={parent_category}
                      options={avalaibleCategoriesList}
                      onChange={onParentChange}
                      optionClassName="needsclick"
                      multi={false}
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label">
                      {I18n.t('administration.hobbies.hobbyPlaceTitlesLabel')}
                    </label>
                    <MultipleAdd
                      data={place_titles}
                      dataType='titles'
                      onChange={onPlaceTitlesChance}
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label">
                      {I18n.t('administration.hobbies.hobbyProfessionalsLabel')}
                    </label>
                    <MultipleAdd
                      data={professional_titles}
                      dataType='titles'
                      onChange={onProfessionalTitlesChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="control-label">
                      {I18n.t('administration.hobbies.filter')}
                    </label>
                    <MultipleAdd
                      data={hobby_filters}
                      dataType='titles'
                      onChange={onHobbyFiltersChange}
                    />
                  </div>
                  <div className="form-group footer">
                    <input
                      type="checkbox"
                      className='form-checkbox'
                      onChange={onFavAvailabilityStatusChange}
                      checked={availableForFav}
                    />
                    <label className="control-label">
                      Can be added to favorites
                    </label>
                  </div>
                </div>
              )
            }
            <div className="form-group footer">
              <input
                type="checkbox"
                className='form-checkbox'
                onChange={publicStatusChange}
                checked={hobbyIsPublic}
              />
              <label className="control-label">
                public
              </label>
            </div>
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
              <button
                className="btn btn-inverse"
                type="button"
                onClick={onCancelForm}
              >
                {I18n.t('administration.hobbies.cancel')}
              </button>
              <button
                className="btn btn-inverse"
                type="submit"
                disabled={isFetching}
              >
                {
                  (editMode && (
                    isFetching
                    ? I18n.t('administration.hobbies.updating')
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
  </div>
);

export default withStyles(s)(Form);
