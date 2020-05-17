import React, { Component } from 'react';
import { connect } from "react-redux";
import { withRouter } from 'react-router';
import { fetchApiRequest, fetchAuthorizedApiRequest } from '../../../../fetch';
import { UnprocessableEntity, InternalServerError } from '../../../../exceptions/http';
import { appendToFormData } from "../../../../helpers/form";
import update from 'immutability-helper';
import Gallery from './Gallery';
import {SilencedError} from "../../../../exceptions/errors";

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      __carouselId: null,
      __images: [],
      send: false,
      errors: null,
    };

    this.onImageChange = this.onImageChange.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.cropImage = this.cropImage.bind(this);
    this.submitFormData = this.submitFormData.bind(this);
  }

  componentDidMount() {

    this.dataFetcher = fetchApiRequest('/v1/galleries/HOME_CAROUSEL');

    this.dataFetcher
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new SilencedError('Failed to fetch home gallery.')
            );
        }
      })
      .then(data => {
        this.setState({__carouselId: data.id}, () =>
          this.getImagesList()
        );
        return Promise.resolve();
      })
  }

  componentWillUnmount() {
    if (this.fetchGalleryImages instanceof Promise) {
      this.fetchGalleryImages.cancel();
    }

    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }

    if (this.fetchImages instanceof Promise) {
      this.fetchImages.cancel();
    }
  }

  getFormData() {
    const {
      __images,
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
      },
      'gallery'
    );
  }

  submitFormData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { __carouselId } = this.state;

    this.submitFormDataFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/${__carouselId}/pending`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: this.getFormData(),
      })
    );

    this.submitFormDataFetcher
      .then(response => {
        switch(response.status) {
          case 204:
            this.setState({
              errors: null,
              send: true,
            });
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
  }

  onImageChange(attachments) {

    this.setState({
      __images: [
        ...attachments,
      ],
    });
  }

  deleteImage(i) {
    const {
      __images,
    } = this.state;

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
    const {
      accessToken,
      dispatch,
    } = this.props;

    this.fetchImages = dispatch(
      fetchAuthorizedApiRequest(`/v1/galleries/my-pendings`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }));

      this.fetchImages
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
        if (g.length)
        this.setState({
          __images: g.map((i) => ({
            id: i.image.id,
            src: i.image.src,
            preview: i.image.src,
            default: true,
          })),
        });
      });
  }

  render() {
    const {
      errors,
      __images,
      send,
    } = this.state;

    return (
      <Gallery
        send={send}
        images={__images}
        errors={errors}
        onImageChange={this.onImageChange}
        deleteImage={this.deleteImage}
        cropImage={this.cropImage}
        submitFormData={this.submitFormData}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken
  };
}

export default withRouter(connect(mapStateToProps)(Container));
