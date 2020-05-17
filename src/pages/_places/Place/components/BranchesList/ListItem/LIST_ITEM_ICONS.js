import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Popup from "../../../../../../components/_popup/Popup/Popup";
import PopupContent from "./PopupContent";
import s from "../BranchesList.scss";

const ListItem = ({
  data,
  name,
  defaultImage,
  onPopupClose,
  openPopup,
  showPopup,
  moveDownImage,
  moveUpImage,
  activeImage,
  activeImageIndex,
  onImageSelect,
}) => (
  <div className={s.branch}>
    <div className={s.image}>
      <img
        src={defaultImage.src}
        onClick={openPopup}
        alt=""
      />
    </div>
    <div className={s.location}>
        {data.location.label}
    </div>

    {
      showPopup && (
        <Popup onClose={onPopupClose}>
          <PopupContent
            data={data}
            defaultImage={activeImage}
            name={name}
            moveDownImage={moveDownImage}
            moveUpImage={moveUpImage}
            activeImageIndex={activeImageIndex}
            onImageSelect={onImageSelect}
          />
        </Popup>
      )
    }
  </div>
);

export default withStyles(s)(ListItem);
