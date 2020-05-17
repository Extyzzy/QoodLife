import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import MobileVersion from './ListItemMobile';
import { MOBILE_VERSION } from '../../../../../actions/app';
import {ItemPopup} from './Popups';
import LIST_ITEM_LIST from "./LIST_ITEM_LIST";
import LIST_ITEM_ICONS from "./LIST_ITEM_ICONS";

import {
  catchAccidentalFormClose,
} from '../../../../../helpers/form';

class ListItemContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      logo: PropTypes.shape({
        id: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired,
      }),
      branches: PropTypes.arrayOf(
        PropTypes.shape({
          default: PropTypes.bool.isRequired,
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
          gallery: PropTypes.shape({
            images: PropTypes.arrayOf(
              PropTypes.shape({
                id: PropTypes.string.isRequired,
                src: PropTypes.string.isRequired,
                default: PropTypes.bool.isRequired,
              })).isRequired,
          }).isRequired,
          schedule: PropTypes.string,
        })
      ).isRequired,
      description: PropTypes.string,
      email: PropTypes.string,
      favorite: PropTypes.bool.isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape.isRequired,
        })
      ).isRequired,
      socialmediaLinks: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          code: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
        })
      ),
      phoneNumber: PropTypes.string,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
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

    const ListItem = this.getListItem();
    const defaultBranch= data.branches.find(i => i.default) || data.branches[0];
    const defaultImage = defaultBranch.gallery.images.find(i => i.default);

    return (
      <ListItem
        data={data}
        showPopup={showPopup}
        viewMode={viewMode}
        onPopupComponentWillUnmount={
          onPopupComponentWillUnmount
        }
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
        defaultImage={defaultImage}
        defaultBranch={defaultBranch}
        actionButtonsList={actionButtons(this)}
        popupActionButtons={popupActionButtons}
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
