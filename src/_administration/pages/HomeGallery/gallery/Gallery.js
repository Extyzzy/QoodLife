import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GalleryInput from '../../../../components/_inputs/GalleryInput';
import ErrorsList from '../../../../components/ErrorsList';
import Widget from '../../../../components/Widget';
import s from './HomeGallery.scss';
import classes from "classnames";
import Popup from '../../../../components/_popup/Popup/Popup';

const Gallery = ({
  __images,
  imagesAreLoaded,
  onImageChange,
  defaultImageIndex,
  setDefaultImage,
  deleteImage,
  cropImage,
  onSubmit,
  errors,
  pendingImages,
  accept,
  reject,
  show,
  close,
  popup,
}) => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        gallery
      </li>
    </ul>
    <h2>Home Page Gallery</h2>
    <Widget title={
      <div>
        <h5 className="mt-0 mb-0">
          <span className="fw-semi-bold">
            {I18n.t('administration.list')}
          </span>
        </h5>
      </div>
    }>
      <form className={s.imagesList} onSubmit={onSubmit}>
        <GalleryInput
          images={__images}
          onImageChange={onImageChange}
          defaultImageIndex={defaultImageIndex}
          onChangeDefaultImage={setDefaultImage}
          onDeleteImage={deleteImage}
          onCropImage={cropImage}
          multiple={true}
          cropAspect={16 / 5.3}
        />
        <div className={s.bottom}>
          {
            errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={ errors } />
              </Alert>
            )
          }
          <button
            type="submit"
            className="btn btn-success btn-sm"
            disabled={!imagesAreLoaded}
          >
            {I18n.t('profile.editProfile.profileDetails.save')}
          </button>
        </div>

        {
          pendingImages && pendingImages.length > 0 &&(
            <div>
            <h4 className="mt-0 mb-0">
              <span className="fw-semi-bold">
                {I18n.t('administration.galleryPending')}
              </span>
            </h4>

              {
                pendingImages.map(data => {

                  return(
                    <div className={s.pending}>
                      <div className={s.image} onClick={show}>
                        <img src={data.image.src} alt=""/>
                      </div>
                      {
                        popup &&(
                          <Popup
                            onClose={close}
                          >
                           <img className={s.imagePopup} src={data.image.src} alt="" />
                          </Popup>
                        )
                      }
                      <div className={s.dude}>
                        <span>{data.user.fullName}</span>
                      </div>
                      <div className={s.buttons}>
                        <div
                          onClick={() => accept(data.id)}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtnActivate,
                            )
                          }
                        >
                          <i className="glyphicon glyphicon-ok-circle text-success"/>
                        </div>
                        <div
                          onClick={() => reject(data.id)}
                          className={
                            classes(
                              'btn btn-default',
                              s.actionBtnActivate,
                            )
                          }
                        >
                          <i className="glyphicon glyphicon-ban-circle text-danger"/>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          )
        }
      </form>
    </Widget>
  </div>
);

export default withStyles(s)(Gallery);
