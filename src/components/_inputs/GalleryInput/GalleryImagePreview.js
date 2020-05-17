import React, { Component } from "react";
import PropTypes from 'prop-types';
import {I18n} from 'react-redux-i18n';
import classes from 'classnames';
import FaCrop from 'react-icons/lib/fa/crop';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GalleryImagePreview.scss';
import {connect} from "react-redux";
import { MOBILE_VERSION } from '../../../actions/app';

class GalleryImagePreview extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    isDefault: PropTypes.bool,
    image: PropTypes.shape({
      preview: PropTypes.string.isRequired,
      crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
      size: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
    }).isRequired,
    multiple: PropTypes.bool.isRequired,
    allowNulls: PropTypes.bool.isRequired,
    width: PropTypes.number,
    cropAspect: PropTypes.number.isRequired,
    onChangeDefaultImage: PropTypes.func,
    onDeleteImage: PropTypes.func,
    onCropImage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    width: 275,
  };

  getSize() {
    const {
      width,
      cropAspect,
    } = this.props;

    const height = width / cropAspect;

    return {
      width,
      height,
    };
  }

  getImageStyles() {
    const { image: {crop, size} } = this.props;

    if ( ! crop || ! size) {
      return {};
    }

    const {
      x: cropX,
      y: cropY,
      width: cropWidth,
    } = crop;

    const {
      width: naturalWidth,
      height: naturalHeight,
    } = size;

    const {
      width: reservedWidth,
    } = this.props;

    const zoom = reservedWidth / cropWidth;
    const width = naturalWidth * zoom;
    const height = naturalHeight * zoom;
    const marginTop = -cropY * zoom;
    const marginLeft = -cropX * zoom;

    return {
      width,
      height,
      marginTop,
      marginLeft,
    };
  }

  render() {
    const {
      image,
      multiple,
      allowNulls,
      index,
      isDefault,
      onChangeDefaultImage,
      onPreviewImageClick,
      editWhenImageClick,
      onDeleteImage,
      onCropImage,
      editable,
      UIVersion,
    } = this.props;

    return (
      <div
        key={index}
        className={s.root}
        style={this.getSize()}
      >
        <img
          className={s.image}
          src={image.preview}
          alt=""
          style={this.getImageStyles()}
          onClick={onPreviewImageClick}
        />

        <div className={s.options}>
          {
            multiple && (
              <button
                type="button"
                className={
                  classes(
                    'btn btn-red',
                    s.setDefault, {
                      [s.default]: isDefault,
                    }
                  )
                }
                onClick={() => {
                  onChangeDefaultImage(index);
                }}
              >
                {
                  isDefault
                    ? I18n.t('general.components.galleryInput.defaultImage')
                    : I18n.t('general.components.galleryInput.setImageAsDefault')
                }
              </button>
            )
          }

          {
            editable && UIVersion !== MOBILE_VERSION && (
              <button
                type="button"
                className={
                  classes(
                    'btn',
                    s.crop
                  )
                }
                onClick={() => {
                  onCropImage(index);
                }}
              >
                <FaCrop size={20}/>
              </button>
            )
          }

        </div>

        {
          (multiple || allowNulls) && !editWhenImageClick && (
            <button
              type="button"
              className={
                classes(
                  s.remove,
                  'remove round-button'
                )
              }
              onClick={() => {
                onDeleteImage(index);
              }}
            >
            </button>
          )
        }
      </div>
    );
  };
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(withStyles(s)(GalleryImagePreview));
