import React from 'react';
import { Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GalleryInput from '../../../../components/_inputs/GalleryInput';
import ErrorsList from '../../../../components/ErrorsList';
import s from '../Ads.scss';
import {I18n} from "react-redux-i18n";

const Gallery = ({
  images,
  onImageChange,
  deleteImage,
  cropImage,
  errors,
  submitFormData,
  send,
}) => (
  <div className={s.root}>
      <form className={s.imagesList}>
        <GalleryInput
          images={images}
          onImageChange={onImageChange}
          onDeleteImage={deleteImage}
          onCropImage={cropImage}
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

          {
            images.length > 0 &&(
              <div
                onClick={submitFormData}
                className="btn btn-success btn-sm"
              >
                {I18n.t('general.elements.submit')}
              </div>
            )
          }

          {
            send &&(
              <div
                className={s.send}
              >
                {I18n.t('profile.ads.send')}
              </div>
            )
          }

        </div>
      </form>
  </div>
);

export default withStyles(s)(Gallery);
