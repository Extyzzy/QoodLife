import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { fetchApiRequest, fetchAuthorizedApiRequest } from '../../../../fetch';
import { UnprocessableEntity, InternalServerError } from '../../../../exceptions/http';
import { appendToFormData } from "../../../../helpers/form";
import update from 'immutability-helper';
import Gallery from './Gallery';

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      imagesAreLoaded: false,
      __carouselId: null,
      __images: [],
      __defaultImageIndex: 0,
      errors: null,
      pendingImages: null,
      show: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.onImageChange = this.onImageChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.cropImage = this.cropImage.bind(this);
  }

  componentDidMount() {
    this.getImagesList();
    this.getPendingImagesList();
  }

  componentWillUnmount() {
    if (this.fetchGalleryImages instanceof Promise) {
      this.fetchGalleryImages.cancel();
    }

    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }

    if (this.fetchPendingGalleryImages instanceof Promise) {
      this.fetchPendingGalleryImages.cancel();
    }

  }

  getFormData() {
    const {
      __images,
      __defaultImageIndex,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        images: __images.map(({
          id,
          source,
          crop
        }) => ({
          source: source || id,
          crop
        })),
        default: __defaultImageIndex,
      },
      'gallery'
    );
  }

  getFormDataOnUpdate() {
    let formData = this.getFormData();
    formData.append('_method', 'PUT');

    return formData;
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
      history,
    } = this.props;

    const gallId = this.state.__carouselId;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/${gallId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormDataOnUpdate(),
      })
    );

    this.submitFormDataFetcher
    .then(response => {
      switch(response.status) {
        case 200:
          this.setState({errors: null});
          return Promise.resolve();
        case 422:
          return response.json().then(({errors}) => {
            this.setState({errors});
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
    .then(() => {
      history.push('/administration');
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { imagesAreLoaded } = this.state;

    if (!imagesAreLoaded) {
      return false;
    }

    this.submitFormData();
  }

  onImageChange(attachments) {
    const {
      __images,
    } = this.state;

    this.setState({
      __images: [
        ...__images,
        ...attachments,
      ],
    });
  }

  deleteImage(i) {
    const {
      __defaultImageIndex,
      __images,
    } = this.state;

    if (__defaultImageIndex >= i) {
      this.setState({
        __defaultImageIndex: __defaultImageIndex === i
          ? null : __defaultImageIndex - 1,
      });
    }

    this.setState({
      __images: update(__images, {
        $splice: [[i, 1]],
      }),
    });
  }

  cropImage(i, crop, size) {
    const { __images } = this.state;

    this.setState({
      __images: update(__images, {
        [i]: {
          $apply: (image) => update(image, {
            crop: {
              $set: crop,
            },
            size: {
              $set: size,
            },
          }),
        },
      }),
    });
  }

  getImagesList() {
    this.fetchGalleryImages = fetchApiRequest(`/v1/galleries/HOME_CAROUSEL`);
    this.fetchGalleryImages
    .then(response => {
      switch(response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new InternalServerError()
          );
      }
    })
    .then(g => {
      this.setState({
        __carouselId: g.id,
        __defaultImageIndex: g.images.findIndex(i => i.default),
        __images: g.images.map((i) => ({
          id: i.id,
          src: i.src,
          preview: i.src,
          default: i.default,
        })),
        imagesAreLoaded: true,
      });
    });
  }

  getPendingImagesList() {
    const {
      dispatch,
      accessToken
    } = this.props;

    this.fetchPendingGalleryImages = dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/are-pending`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );
    this.fetchPendingGalleryImages
      .then(response => {
        switch(response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(data => {
        this.setState({
          pendingImages: data.list,
        });
      });
  }

  accept(id) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      pendingImages,
      __images
    } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/${id}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            let findImage = pendingImages.find(data => data.id === id);
            let image = {
              id: findImage.image.id,
              preview: findImage.image.src,
              src: findImage.image.src,
            };

            this.setState({
              __images: [...__images, image],
              pendingImages: update(pendingImages, {
                $splice: [[id, 1]],
              }),
            });
            break;
          default:
            console.info('Error.')
        }
      })
  }

  reject(id) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { pendingImages } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/${id}/reject`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:

            this.setState({
              pendingImages: update(pendingImages, {
                $splice: [[id, 1]],
              }),
            });
            break;
          default:
            console.info('Error.')
        }
      })
  }

  render() {
    const {
      imagesAreLoaded,
      errors,
      __images,
      __defaultImageIndex,
      pendingImages,
      show,
    } = this.state;

    return (
      <Gallery
        show={() => this.setState({show: true})}
        close={() => this.setState({show: false})}
        popup={show}
        __images={__images}
        pendingImages={pendingImages}
        imagesAreLoaded={imagesAreLoaded}
        defaultImageIndex={__defaultImageIndex}
        errors={errors}
        onSubmit={this.onSubmit}
        accept={this.accept}
        reject={this.reject}
        onImageChange={this.onImageChange}
        deleteImage={this.deleteImage}
        cropImage={this.cropImage}
        setDefaultImage={(__defaultImageIndex) => {
          this.setState({__defaultImageIndex});
        }}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    isAuthenticated: store.auth.isAuthenticated,
    accessToken: store.auth.accessToken,
  };
}

export default withRouter(connect(mapStateToProps)(Container));
