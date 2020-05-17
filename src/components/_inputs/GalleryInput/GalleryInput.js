import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {I18n} from 'react-redux-i18n';
import Dropzone from 'react-dropzone';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GalleryInput.scss';
import {connect} from "react-redux";
import { MOBILE_VERSION } from '../../../actions/app';
import GalleryImagePreview from './GalleryImagePreview';
import Cropper from './Cropper';
import { isMobile } from '../../../helpers/navigator';
import classes from "classnames";
import WarningPopover from "../../WarningPopover";

class GalleryInput extends Component {
  static propTypes = {
    images: PropTypes.array.isRequired,
    multiple: PropTypes.bool,
    onImageChange: PropTypes.func.isRequired,
    croperIsOpen: PropTypes.func,
    defaultImageIndex: PropTypes.number,
    onChangeDefaultImage: PropTypes.func,
    onDeleteImage: PropTypes.func,
    onCropImage: PropTypes.func.isRequired,
    cropAspect: PropTypes.number,
  };

  static defaultProps = {
    multiple: true,
    mobileV: false,
    allowNulls: false,
    editable: true,
    cropAspect: 3/2,
    addButtonClass: "btn btn-red",
    addPhotoButtonText: false,
    editWhenImageClick: false,
    onPreviewImageClick: () => {},
    croperIsOpen: () => {},
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      cropper: null,
    };

    this.onDropzoneDrop = this.onDropzoneDrop.bind(this);
    this.onCropImage = this.onCropImage.bind(this);
  }

  cropCenterImage(naturalWidth, naturalHeight) {
    const { cropAspect } = this.props;

    if (naturalWidth > naturalHeight * cropAspect) {
      const maxWidth = naturalHeight * cropAspect;
      const cropPixelSizeX = (naturalWidth - maxWidth) / 2; // x

      return {
        x: Math.round(cropPixelSizeX),
        y: 0,
        width: Math.round(maxWidth),
        height: Math.round(naturalHeight)
      };

    } else {
      const maxHeight = naturalWidth / cropAspect;
      const cropPixelSizeY = (naturalHeight - maxHeight) / 2; // y

      return {
        x: 0,
        y: Math.round(cropPixelSizeY),
        width: Math.round(naturalWidth),
        height: Math.round(maxHeight)
      };
    }
  }

  onDropzoneDrop(images) {
    const {
      onImageChange,
      cropAspect,
      UIVersion,
      croperIsOpen,
    } = this.props;

    let previews = [];
    let promises = [];

    for (let image of images) {
      let reader = new FileReader();

      reader.readAsDataURL(image);
      croperIsOpen(true);

      promises.push(
        new Promise(resolve => {
          reader.onloadend = () => {
            previews.push(reader.result);

            resolve();
          }
        })
      );
    }

    let attachments = [];
    let overflow = new Promise(resolve => {
      resolve();
    });

    Promise.all(promises)
      .then(() => {
        for (let i in images) {
          const source = images[i];
          const preview = previews[i];

          overflow = overflow.then(() => (
            new Promise(resolve => {
              if(!this.props.mobileV && !isMobile && UIVersion !== MOBILE_VERSION) {
                this.setState({
                  cropper: (
                    <Cropper
                      className={s.cropper}
                      image={{preview}}
                      aspect={cropAspect}
                      onCrop={(crop, size) => {
                        attachments.push({
                          source,
                          preview,
                          crop,
                          size,
                        });
                      }}
                      onComplete={() => {
                        croperIsOpen(true);
                        this.setState({
                          cropper: null,
                        }, () => {
                          resolve();
                        });
                      }}

                      onDiscard={() => {
                        croperIsOpen(false);
                        this.setState({
                          cropper: null,
                        }, () => {
                          resolve();
                        });
                      }}
                    />
                  ),
                });
              } else {
                let image;

                this.setState({
                  cropper: (
                    <img
                      onLoad={() => {
                        const {naturalWidth , naturalHeight} = image;
                        let size = {
                          width: naturalWidth,
                          height: naturalHeight
                        };
                        const crop = this.cropCenterImage(naturalWidth, naturalHeight);
                        attachments.push({
                          source,
                          preview,
                          crop,
                          size,
                        });

                        this.setState({
                          cropper: null,
                        }, () => {
                          resolve();
                        });
                      }}
                      ref={ref => {
                        if (ref) {
                          image = ref;
                        }
                      }}
                      src={preview}
                      alt=""
                    />
                  ),
                });
              }

            })
          ));
        }

        overflow.then(() => {
          onImageChange(attachments);
        });
      });
  }

  onCropImage(i) {
    const {
      images,
      cropAspect,
      onCropImage,
    } = this.props;

    this.setState({
      cropper: (
        <Cropper
          className={s.cropper}
          image={images[i]}
          aspect={cropAspect}
          onCrop={(crop, size) => {
            onCropImage(i, crop, size);
          }}
          onComplete={() => {
            this.setState({
              cropper: null,
            });
          }}

          onDiscard={() => {
            this.setState({
              cropper: null,
            });
          }}
        />
      ),
    });
  }

  render() {
    const {
      images,
      multiple,
      allowNulls,
      width,
      addButtonClass,
      defaultImageIndex,
      onChangeDefaultImage,
      onDeleteImage,
      cropAspect,
      addPhotoButtonText,
      onPreviewImageClick,
      editWhenImageClick,
      editable,
      avatar
    } = this.props;

    const {
      cropper,
    } = this.state;

    return (
      <div className={s.root}>
        {
          ( images.length < 12 &&(
            <Dropzone
              className={classes('needsclick', addButtonClass)}
              onDrop={this.onDropzoneDrop}
              multiple={multiple}
              disabled={!!cropper}
              disableClick={!!cropper}
              disablePreview={!!cropper}
            >
              {
                addPhotoButtonText || (
                  !allowNulls && (
                    (multiple &&  I18n.t('general.components.galleryInput.addMultiplePhotosButtonText')) || (
                      I18n.t('general.components.galleryInput.addSinglePhotoButtonText')
                    )
                  )
                )
              }
            </Dropzone>
          )) || (
            <WarningPopover fullName={I18n.t('general.components.galleryInput.maxImg')}>
              <span className={classes(
                'btn btn-red',
              )}>
                {I18n.t('general.components.galleryInput.addMultiplePhotosButtonText')}
              </span>
            </WarningPopover>
          )
        }

        {
          !avatar &&(
            <p>{I18n.t('general.components.galleryInput.maxSize')}</p>
          )
        }

        {
          cropper || (
            !!images && !!images.length && (
              <div className={s.previewList}>
                {
                  images.map((image, index) => (
                    <GalleryImagePreview
                      key={index}
                      index={index}
                      isDefault={defaultImageIndex ? index === defaultImageIndex : index === 0 }
                      onPreviewImageClick={onPreviewImageClick}
                      image={image}
                      width={width}
                      editable={editable}
                      multiple={images.length > 1}
                      cropAspect={cropAspect}
                      onChangeDefaultImage={onChangeDefaultImage}
                      editWhenImageClick={editWhenImageClick}
                      onDeleteImage={onDeleteImage}
                      allowNulls={allowNulls}
                      onCropImage={this.onCropImage}
                    />
                  ))
                }
              </div>
            )
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(withStyles(s)(GalleryInput));
