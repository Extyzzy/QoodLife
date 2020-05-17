import React, { Component } from "react";
import LIST_ITEM_ICONS from "./LIST_ITEM_ICONS";
import LIST_ITEM_LIST from "./LIST_ITEM_LIST";
import MobileVersion from "./LIST_ITEM_MOBILE";
import {MOBILE_VERSION} from "../../../../../../actions/app";
import { connect } from 'react-redux';

class ListItem extends Component {
  constructor(props, context) {
    super(props, context);

    const { data } = this.props;
    const defaultIndex = data.gallery.images.findIndex(i => i.default);

    this.state = {
      showPopup: false,
      showPopupMap: false,
      activeImageIndex: defaultIndex,
    };
  }

  getListItem() {
    const { viewMode, UIVersion } = this.props;

    switch (UIVersion) {

      case MOBILE_VERSION:

        return MobileVersion;

      default:

        switch(viewMode) {

          case 'icons':

            return LIST_ITEM_ICONS;

          default:

            return LIST_ITEM_LIST;

        }
    }
  }

  render() {
    const { data, name} = this.props;
    const { showPopup, activeImageIndex, showPopupMap } = this.state;

    const defaultImage = data.gallery.images.find(i => i.default);
    const activeImage = data.gallery.images[activeImageIndex];
    const images = data.gallery.images;



    const Item = this.getListItem();

    return (
      <Item
        data={data}
        name={name}
        showPopup={showPopup}
        defaultImage={defaultImage}
        activeImageIndex={activeImageIndex}
        activeImage={activeImage}
        showPopupMap={showPopupMap}
        openPopup={() => this.setState({showPopup: true})}
        onPopupClose={() => this.setState({showPopup: false})}
        onMapClick={() => this.setState({showPopupMap: true})}
        onMapClickClose={() => this.setState({showPopupMap: false})}
        onImageSelect={activeImageIndex => this.setState({activeImageIndex})}
        moveDownImage={() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === 0
                ? images.length - 1
                : activeImageIndex - 1,
          })
        }}

        moveUpImage={() => {
          this.setState({
            activeImageIndex:
              activeImageIndex === images.length - 1
              ? 0
              : activeImageIndex + 1
            ,
          })
        }}
      />
    )
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(ListItem);

