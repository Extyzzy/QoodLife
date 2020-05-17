import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Cropper.scss';

class Cropper extends Component {
  static propTypes = {
    className: PropTypes.string,
    image: PropTypes.shape({
      preview: PropTypes.string.isRequired,
      crop: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
      }),
    }).isRequired,
    aspect: PropTypes.number.isRequired,
    onCrop: PropTypes.func.isRequired,
    onDiscard: PropTypes.func,
    onComplete: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      crop: {},
    };
  }

  setSize(image) {
    const {
      naturalWidth: width,
      naturalHeight: height,
    } = image;

    this.size = {
      width,
      height,
    };
  }

  getPixelCrop({x, y, width, height}) {
    const {
      width: naturalWidth,
      height: naturalHeight,
    } = this.size;

    return {
      x: Math.round(naturalWidth * (x / 100)),
      y: Math.round(naturalHeight * (y / 100)),
      width: Math.round(naturalWidth * (width / 100)),
      height: Math.round(naturalHeight * (height / 100)),
    };
  };

  getPropsCrop() {
    const {
      aspect,
      image: {
        crop: {
          width: cropWidth,
          x: cropX,
          y: cropY,
        },
      },
    } = this.props;

    const {
      width: naturalWidth,
      height: naturalHeight,
    } = this.size;

    const imageAspect = naturalWidth / naturalHeight;
    const width = cropWidth * 100 / naturalWidth;
    const x = cropX * 100 / naturalWidth;
    const y = cropY * 100 / naturalHeight;

    return makeAspectCrop({
      aspect,
      width,
      x,
      y,
    }, imageAspect);
  }

  getInitialCrop() {
    const { aspect, image } = this.props;

    if (image.crop) {
      return this.getPropsCrop();
    }

    const {
      width: naturalWidth,
      height: naturalHeight,
    } = this.size;

    const imageAspect = naturalWidth / naturalHeight;
    const maxWidth = aspect * 100 / imageAspect;
    const width = maxWidth > 100 ? 100 : maxWidth;

    return makeAspectCrop({
      aspect,
      width,
      x: 0,
      y: 0,
    }, imageAspect);
  }

  render() {
    const {
      className,
      image,
      onCrop,
      onDiscard,
      onComplete,
    } = this.props;

    const {
      crop,
    } = this.state;

    return (
      <div
        className={
          classes(s.root, {
            [className]: !!className,
          })
        }
      >
        <div className={s.reactCropContainer}>
          <div className={s.backdrop} />

          <ReactCrop
            src={image.preview}
            crop={crop}
            onImageLoaded={image => {
              this.setSize(image);
              const crop = this.getInitialCrop();
              this.pixelCrop = this.getPixelCrop(crop);


              this.setState({
                crop: {
                  aspect: crop.aspect,
                  width: crop.aspect !== 0? crop.width : 30,
                  height: crop.aspect !== 0? crop.height : 30,
                  x: crop.aspect !== 0? crop.x : 35,
                  y: crop.aspect !== 0? crop.y : 35,
                },
              });
            }}
            onChange={crop => {
              this.setState({ crop });
            }}
            onComplete={(crop, pixelCrop) => {
              this.pixelCrop = pixelCrop;
            }}
          />
        </div>

        <div className={s.buttons}>
          <button
            type="button"
            className="btn btn-red"
            disabled={
              !crop.width || !crop.height
            }
            onClick={() => {
              onCrop(this.pixelCrop, this.size);

              if (onComplete instanceof Function) {
                onComplete();
              }
            }}
          >
            Crop
          </button>

          <button
            type="button"
            className="btn btn-default"
            onClick={() => {
              if (onDiscard instanceof Function) {
                onDiscard();
              }
            }}
          >
            Discard
          </button>

        </div>
      </div>
    );
  }
}

export default withStyles(s)(Cropper);
