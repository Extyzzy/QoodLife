import React, { Component } from 'react';
import Popup from "../_popup/Popup/Popup";
import SideArrowsCarousel from '../_carousel/sideArrowsCarusel';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProfileImages.scss';
import GalleryCarousel from '../_carousel/GalleryCarousel';

class ProfileImages extends Component {
  static propTypes = {
    gallery: PropTypes.shape({
    images: PropTypes.arrayOf(
      PropTypes.shape({
        src: PropTypes.string.isRequired,
        default: PropTypes.bool.isRequired,
    })).isRequired,
    })
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      displayForm: false,
      activeImageIndex: null,
    };
  };

  render() {
    const { gallery } = this.props;
    const { displayForm, activeImageIndex } = this.state;
    const changedImage = gallery.images[activeImageIndex];

    return (
      <div className={s.root}>
        {
          !!gallery.images.length && (
            <GalleryCarousel
              profileCarousel
              gallery={gallery}
              activeImageIndex={activeImageIndex}
              onImageSelect={activeImageIndex => {
                this.setState({
                  activeImageIndex,
                  displayForm: true,
                });
              }}
            />
          )
        }
        {
          displayForm && (
            <Popup
              notShowCloser
              onClose={() => {
                this.setState({displayForm: false})
              }}
            >
              <div className={s.poster}>
                <SideArrowsCarousel
                  activeImage={changedImage.src}
                  isCarousel={gallery.images.length}
                  alt={''}
                  moveDown={() => {
                    this.setState({
                      activeImageIndex: activeImageIndex === 0
                        ? gallery.images.length - 1
                        : activeImageIndex - 1,
                    })
                  }}
                  moveNext={() => {
                    this.setState({
                      activeImageIndex: activeImageIndex === gallery.images.length - 1
                        ? 0
                        : activeImageIndex + 1,
                    })
                  }}
                />
              </div>
            </Popup>
          )
        }
      </div>
    );
  }
}

export default withStyles(s)(ProfileImages);
