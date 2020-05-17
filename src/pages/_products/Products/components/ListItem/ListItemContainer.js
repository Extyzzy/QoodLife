import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MOBILE_VERSION } from '../../../../../actions/app';
import { ItemPopup } from './Popups';
import { catchAccidentalFormClose } from '../../../../../helpers/form';
import LIST_ITEM_ICONS from './LIST_ITEM_ICONS';
import LIST_ITEM_LIST from './LIST_ITEM_LIST';
import MobileVersion from './ListItemMobile';
import moment from "moment/moment";

class ListItemContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      gallery: PropTypes.shape({
        id: PropTypes.string.isRequired,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      restrictions: PropTypes.shape({
        sinceAge: PropTypes.number,
        untilAge: PropTypes.number,
        gender: PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          slug: PropTypes.string.isRequired,
        }),
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }).isRequired,
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
      description: PropTypes.string.isRequired,
      favorite: PropTypes.bool.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    onPopupComponentWillUnmount: PropTypes.func,
    showOwnerDetails: PropTypes.bool,
    actionButtons: PropTypes.func,
    popupActionButtons: PropTypes.func,
    viewMode: PropTypes.string,
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
      showEditPopup: false
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
      viewMode,
      data,
      onPopupComponentWillUnmount,
      showOwnerDetails,
      actionButtons,
      popupActionButtons,
      className,
      onPopupOpen,
      onPopupClose,
      lastSeen_1,
      lastSeen_2,
      notification,
      setViewedNotification,
      isAuthenticated
    } = this.props;

    const lastSeen = lastSeen_2 > moment().unix() - 86400 ? lastSeen_1 : lastSeen_2;
    const { gallery } = data;
    const defaultImage = gallery.images.find(i => i.default);
    const { showPopup,showEditPopup } = this.state;
    const ListItem = this.getListItem();

    return (
      <ListItem
        lastSeen={lastSeen}
        viewMode={viewMode}
        data={data}
        notification={notification || null}
        defaultImage={defaultImage}
        onViewNotifications={() => {
          if(isAuthenticated && setViewedNotification instanceof Function) {
            setViewedNotification(notification)
          }
        }}
        onImageClick={() => {
          if(isAuthenticated && setViewedNotification instanceof Function) {
            setViewedNotification(notification)
          }

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
        postedLike={() => {
          switch (data.postedLike.code) {
            case 'place':
              return 'places';
            case 'professional':
              return 'professionals';
            default:
              return 'member';
          }
        }}
        showPopup={showPopup}
        showOwnerDetails={showOwnerDetails}
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
        showEditPopup={showEditPopup}
        onEditPopupClose={() => {
          if (onPopupClose instanceof Function) {
            onPopupClose();
          }
          else {
            this.setState({
              showEditPopup: false,
            });
          }
        }}
        onEditPopupSuccess={() => {
          if (onPopupClose instanceof Function) {
            onPopupClose();
          }
          else {
            this.setState({
              showEditPopup: false,
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
    isAuthenticated: state.auth.isAuthenticated,
    UIVersion: state.app.UIVersion,
    user: state.user,
  };
}

export default connect(mapStateToProps)(ListItemContainer);
