import React from "react";
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import slugify from "slugify/index";
import { Link } from 'react-router-dom';
import { ItemPopup } from './Popups';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const LIST_ITEM_ICONS = ({
  data,
  data: {
    id: productId,
    title,
    shortTitle,
    description,
    brand,
    updatedAt,
    owner,
  },
  viewMode,
  defaultImage,
  onImageClick,
  actionButtonsList,
  showPopup,
  onPopupClose,
  showOwnerDetails,
  onPopupComponentWillUnmount,
  popupActionButtons,
  showEditPopup,
  onEditPopupClose,
  onEditPopupSuccess,
  className,
  beforeFormDialogRender,
  beforeFormDialogClose,
  onFormDataChange
}) => (
  <div
    className={classes(s.root, s[viewMode], {
      [s.hasActionButtons]: !!actionButtonsList && !!actionButtonsList.length,
    }, {
      [className]: !!className,
    })}
  >
    <div className={s.image}>
      <LazyLoadImage
        width="100%"
        height="100%"
        effect={'blur'}
        src={defaultImage.src}
        alt={title}
        onClick={onImageClick}
        style={parseInt(defaultImage.height, 10) < parseInt(defaultImage.width, 10) ? {width: '100%'} : null}
      />
    </div>

    <div className={s.details}>
      <Link className={s.name} to={`/products/${slugify(title)}-${productId}`}>
        {shortTitle? shortTitle :title}
      </Link>
    </div>

    {
      !!actionButtonsList && !!actionButtonsList.length && (
        <div className={s.actionButtons}>
          { actionButtonsList }
        </div>
      )
    }

    {
      showPopup && (
        <ItemPopup
          data={data}
          onPopupClose={onPopupClose}
          popupActionButtons={popupActionButtons}
          onPopupComponentWillUnmount={onPopupComponentWillUnmount}
        />
      )
    }

  </div>
);

export {LIST_ITEM_ICONS as LIST_ITEM_ICONS_WITHOUT_STYLES};
export default withStyles(s)(LIST_ITEM_ICONS);
