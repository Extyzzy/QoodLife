import React from 'react';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ListItem.scss";
import Popup from "../../../../../components/_popup/Popup/Popup";
import PopupContent from "../PopupContent";

export const ItemPopup = withStyles(s)(({
        data,
        onPopupClose,
        popupActionButtons,
        onPopupComponentWillUnmount,
    }) => (
    <Popup onClose={onPopupClose}>
        <PopupContent
            data={data}
            onClose={onPopupClose}
            actionButtons={
                popupActionButtons
            }
            onPopupComponentWillUnmount={
                onPopupComponentWillUnmount
            }
        />
    </Popup>
));
