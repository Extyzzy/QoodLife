import React, { Component } from 'react';
import update from 'immutability-helper';
import { connect } from "react-redux";
import { appendToFormData } from '../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../fetch';
import { UnprocessableEntity, InternalServerError } from '../../exceptions/http';
import { switchUserAvatar } from '../../actions/user';
import { switchPlaceAvatar } from '../../actions/places';
import { switchProfessionalAvatar } from '../../actions/professionals';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popup from "../_popup/Popup/Popup";
import GalleryInput from '../_inputs/GalleryInput';
import s from "./ProfileImage.scss";

class Container extends Component {
  static defaultProps = {
    popupLabel: "Select an image",
    iconClassName: "icon-people",
    cropAspect: 1/1,
    image: null,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      displayForm: false,
      displayCrZone: false,
      __avatar: this.props.image,
    };
  };

  componentWillReceiveProps(nextProps) {
    this.setState({__avatar: nextProps.image})
  }

  onAvatarUpdate() {
    const {
      dispatch,
      userRole,
      accessToken,
      onImageChange,
    } = this.props;

    const {
      __avatar
    } = this.state;

    this.updateAvatarFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/account/avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            role: userRole,
            user: __avatar ? {
              avatar: {
                source: __avatar.source? __avatar.source : __avatar.id,
                crop: __avatar.crop
              }
            } : null,
            _method: 'PUT'
          }
        ),
      })
    );

    this.updateAvatarFetcher
    .then(response => {
        switch(response.status) {
          case 200:
            return response.json();

          case 422:
            return response.json().then(({errors}) => {
              this.setState({avatar_errors: errors});

              return Promise.reject(
                new UnprocessableEntity()
              );
            });
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
    })
    .then((data) => {
      this.setState({
        displayForm: false,
        displayCrZone: false,
        __avatar: null,
      }, () => {
        if(__avatar){
          onImageChange([__avatar]);
          switch (userRole) {
            case 'member':
              dispatch(switchUserAvatar(data.avatar));
              break;
            case 'professional':
              dispatch(switchProfessionalAvatar(data.avatar));
              break;
            case 'place':
              dispatch(switchPlaceAvatar(data.logo));
              break;
            default:
              return Promise.reject(
                new InternalServerError()
              );
          }
        }
      })
    })
    .then(() => {
      return Promise.resolve()
    })
  }

  render() {
    const {
      iconClassName,
      boxClassName,
      popupBoxClassName,
      popupLabel,
      cropAspect,
      imageWidth,
      isMobile,
      image,
    } = this.props;

    const {
      displayForm,
      displayCrZone,
      __avatar
    } = this.state;

    return (
      <div className={classes(s.root, boxClassName)}>
        <div className={s.image}>
          {
            ((image || isMobile) && (
              <GalleryInput
                allowNulls
                avatar
                cropAspect={cropAspect}
                width={imageWidth}
                editable={false}
                editWhenImageClick
                addButtonClass={s.addPhotoZone}
                images={image ? [image] : []}
                onImageChange={() => this.onAvatarUpdate()}
                onPreviewImageClick={() => this.setState({
                  displayForm: true,
                  __avatar: image
                })}
                onDeleteImage={() => {}}
                addPhotoButtonText={
                  !image && isMobile && (
                    <i className={iconClassName} />
                  )
                }
                onCropImage={() => {}}
                multiple={false}
              />
            )) || (
              <i
                className={iconClassName}
                onClick={() => this.setState({displayForm: true})}
              />
            )
          }
        </div>
        {
          displayForm && (
            <Popup
              notShowCloser
              onClose={() => this.setState({
              displayForm: false,
              displayCrZone: false
            })}>
              <div className={s.content}>
                <h3>{popupLabel}</h3>
                <div className={s.imageContainer}>
                  <GalleryInput
                    cropAspect={cropAspect}
                    width={imageWidth}
                    allowNulls={true}
                    editable={false}
                    addButtonClass={classes(s.addPhotoZone, popupBoxClassName, {[s.cropActive]: displayCrZone})}
                    addPhotoButtonText={
                      !__avatar && (
                        <i style={{marginLeft: '70px'}} className={iconClassName} />
                      )
                    }
                    images={__avatar ? [__avatar] : []}
                    onImageChange={([__avatar]) => {
                      this.setState({
                        displayCrZone: false,
                        __avatar,
                      });
                    }}

                    onDeleteImage={() => {
                      this.setState({
                        displayCrZone: false,
                        __avatar: null,
                      });
                    }}

                    onCropImage={(i, crop, size) => {
                      this.setState({
                        __avatar: update(__avatar, {
                          $apply: (image) => update(image, {
                            crop: {
                              $set: crop,
                            },
                            size: {
                              $set: size,
                            },
                          }),
                        }),
                      });
                    }}

                    croperIsOpen={(status) => {
                      this.setState({displayCrZone: status})
                    }}
                  />
                </div>
                {
                  !displayCrZone && (
                    <button
                      type="button"
                      disabled={!__avatar}
                      className="btn btn-success btn-sm"
                      onClick={() => {
                        this.onAvatarUpdate()
                      }}
                    >submit</button>
                  )
                }
              </div>
            </Popup>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Container));
