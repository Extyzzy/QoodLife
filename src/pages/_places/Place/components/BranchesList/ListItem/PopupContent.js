import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import GalleryCarousel from '../../../../../../components/_carousel/GalleryCarousel';
import SideArrowsCarousel from '../../../../../../components/_carousel/sideArrowsCarusel';
import s from '../BranchesList.scss';

const PopupContent = ({
  defaultImage,
  moveDownImage,
  moveUpImage,
  activeImageIndex,
  onImageSelect,
  name,
  data: {
    gallery,
    location,
    schedule,
    description,
  }
}) => (
  <div className={s.popupContent}>
    <div className={s.title}>
      {name}
    </div>
    <div className={s.poster}>
      <div className={s.image}>
        <SideArrowsCarousel
          activeImage={defaultImage.src}
          alt={name}
          moveDown={moveDownImage}
          moveNext={moveUpImage}
          isCarousel={gallery.images.length}
        />
      </div>
    </div>

    {
      gallery.images.length > 1 && (
        <GalleryCarousel
          gallery={gallery}
          activeImageIndex={activeImageIndex}
          onImageSelect={onImageSelect}
        />
      )
    }

    <div className={s.detailsPopup}>
      <div><i className="icon-map-marker" /><span>{location.label}</span></div>
      <div><i className="icon-clock" /><span>{schedule}</span></div>
      <div>
        <div
          id='links'
          className={s.content}
          dangerouslySetInnerHTML={{__html: description}}
        />
      </div>
    </div>
  </div>
);

export default withStyles(s)(PopupContent);
