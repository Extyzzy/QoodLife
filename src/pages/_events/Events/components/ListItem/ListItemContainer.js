import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MOBILE_VERSION } from '../../../../../actions/app';
import LIST_ITEM_ICONS from './LIST_ITEM_ICONS';
import LIST_ITEM_LIST from './LIST_ITEM_LIST';
import MobileVersion from './ListitemMobile';
import moment from 'moment';
import {
  catchAccidentalFormClose,
} from '../../../../../helpers/form';

import {
  getEventActualDate,
} from '../../../../../helpers/events';

import {
  MapPopup,
  ItemPopup,
} from './Popups';

class ListItemContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      gallery: PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      createdAt: PropTypes.number.isRequired,
      updatedAt: PropTypes.number.isRequired,
      tags: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          tag: PropTypes.string.isRequired,
        })
      ),
      location: PropTypes.shape({
        label: PropTypes.string,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }).isRequired,
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
          image: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }),
        })
      ).isRequired,
      owner: PropTypes.shape({
        id: PropTypes.string.isRequired,
        fullName: PropTypes.string.isRequired,
        shortName: PropTypes.string,
        avatar: PropTypes.shape({
          id: PropTypes.string.isRequired,
          src: PropTypes.string.isRequired,
        }),
      }),
      since: PropTypes.number.isRequired,
      until: PropTypes.number.isRequired,
      description: PropTypes.string.isRequired,
      going: PropTypes.bool.isRequired,
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
    const { data } = this.props;

    this.state = {
      showPopup: false,
      showPopupMap: false,
      randActiveIndex: data.gallery.images.length > 1 && !!data.days.length ? this.getRandImage(data.gallery.images.length) : false           
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

  getRandImage = (max) => {
    return Math.floor(Math.random() * max); 
  }

  render() {
    const {
      data,
      data: {
        gallery,
      },
      onPopupComponentWillUnmount,
      showOwnerDetails,
      actionButtons,
      popupActionButtons,
      eventsList,
      viewMode,
      className,
      onPopupOpen,
      onPopupClose,
      lastSeen_1,
      lastSeen_2,
      notification,
      setViewedNotification,
      filterIntervalSince,
      isAuthenticated
    } = this.props;
    
    const {
      showPopup,
      showPopupMap,
      randActiveIndex
    } = this.state;

    const lastSeen = lastSeen_2 > moment().unix() - 86400 ? lastSeen_1 : lastSeen_2;

    const defaultImage = !!randActiveIndex ? gallery.images[randActiveIndex] : gallery.images.find(i => i.default);
    const ListItem = this.getListItem();
    const onPopupMapClose = () => {
      if (onPopupClose instanceof Function) {
        onPopupClose();
      }
      else {
        this.setState({
          showPopupMap: false,
        });
      }
    };

    return (
      <ListItem
        viewMode={viewMode}
        data={{
          ...data,
          date: getEventActualDate(data, filterIntervalSince),
        }}
        notification={notification || null}
        lastSeen={lastSeen}
        defaultImage={defaultImage}
        onNotificationView={() => {
          if(isAuthenticated && setViewedNotification instanceof Function) {
            setViewedNotification(notification)
        }}}
        onImageClick={() => {
          if(isAuthenticated && setViewedNotification instanceof Function){
            setViewedNotification(notification)
          }

          if(onPopupOpen instanceof Function) {
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
        onMapClick={e => {
          e.preventDefault();

          if (onPopupOpen instanceof Function) {
            onPopupOpen(
              <MapPopup
                data={data}
                eventsList={eventsList}
                onPopupMapClose={onPopupMapClose}
              />
            );
          }
          else {
            this.setState({
              showPopupMap: true,
            });
          }
        }}
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
        onPopupComponentWillUnmount={
          onPopupComponentWillUnmount
        }
        showPopup={showPopup}
        showPopupMap={showPopupMap}
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
        onPopupMapClose={onPopupMapClose}
        eventsList={eventsList}
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
    eventsList: state.events.list,
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(ListItemContainer);
