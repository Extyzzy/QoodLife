import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MobileVersion from './ListItemMobile';
import { MOBILE_VERSION } from '../../../../../actions/app';
import {ItemPopup} from './Popups';
import LIST_ITEM_ICONS from "./LIST_ITEM_ICONS";
import LIST_ITEM_LIST from "./LIST_ITEM_LIST";
import {
  catchAccidentalFormClose,
} from '../../../../../helpers/form';

class ListItemContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      follow: PropTypes.bool.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      description: PropTypes.string,
      dateOfBirth: PropTypes.number,
      email: PropTypes.string,
      avatar: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }),
      gallery: PropTypes.shape({
        images: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired,
          title: PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
          })
        })
      ).isRequired,
      socialMediaLinks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
      studies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          institution: PropTypes.string.isRequired,
        })
      ),
      workingPlaces: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          institution: PropTypes.string.isRequired,
          position: PropTypes.string.sRequired,
          schedule: PropTypes.string,
          location: PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string,
            longitude: PropTypes.number.isRequired,
            latitude: PropTypes.number.isRequired,
            timezone: PropTypes.shape({
              id: PropTypes.string.isRequired,
              identifier: PropTypes.string.isRequired,
              name: PropTypes.string.isRequired,
            }),
          }).isRequired,
        })
      ),
      phoneNumber: PropTypes.string,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    onPopupComponentWillUnmount: PropTypes.func,
    actionButtons: PropTypes.func,
    popupActionButtons: PropTypes.func,
    className: PropTypes.string,
    onPopupOpen: PropTypes.func,
    onPopupClose: PropTypes.func,
  };

  static defaultProps = {
    showOwnerDetails: true,
    actionButtons: () => [],
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      showPopup: false,
    };
  }

  componentWillUnmount() {
    const { onComponentWillUnmount } = this.props;

    if (onComponentWillUnmount instanceof Function) {
      onComponentWillUnmount(this);
    }
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
    const {
      data,
      onPopupComponentWillUnmount,
      actionButtons,
      popupActionButtons,
      className,
      onPopupOpen,
      onPopupClose,
      viewMode,
    } = this.props;

    const {
      showPopup,
    } = this.state;

    const { gallery } = data;
    const defaultImage = gallery.images.find(i => i.default);
    const ListItem = this.getListItem();

    return (
       <ListItem
         data={data}
         defaultImage={defaultImage}
         viewMode={viewMode}
         onImageClick={() => {
          if (onPopupOpen instanceof Function) {
            onPopupOpen(
               <ItemPopup
                 data={data}
                 onPopupClose={onPopupClose}
                 popupActionButtons={popupActionButtons}
                 onPopupComponentWillUnmount={onPopupComponentWillUnmount}
               />
             );
           }
           else {
             this.setState({
               showPopup: true,
             });
           }
         }}
         onPopupComponentWillUnmount={
           onPopupComponentWillUnmount
         }
         showPopup={showPopup}
         actionButtonsList={actionButtons(this)}
         popupActionButtons={popupActionButtons}
         onPopupClose={() => {
           if (onPopupClose instanceof Function) {
             onPopupClose();
           }
           else {
             this.setState({
               showPopup: false,
             });
           }
         }}
         className={className}
         beforeFormDialogRender={() => {
           this.__formDataHasChanged = false;
         }}
         beforeFormDialogClose={
           catchAccidentalFormClose(this)
         }
         onFormDataChange={formDataHasChanged => {
           this.__formDataHasChanged = formDataHasChanged;
         }}
       />

    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(ListItemContainer);
