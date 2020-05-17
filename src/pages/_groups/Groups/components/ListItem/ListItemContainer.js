import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import moment from "moment";
import MobileVersion from './ListItemMobile';
import ListItem from './ListItem';
import { MOBILE_VERSION } from '../../../../../actions/app';
import MapPopup from './Map';
import Popup from "../../../../../components/_popup/Popup/Popup";
import {
  joinGroup,
  receiveJoinGroup,
} from "../../../../../actions/groups";

import {
  catchAccidentalFormClose,
} from '../../../../../helpers/form';
import config from "../../../../../config";

class ListItemContainer extends Component {
  static propTypes = {
    data: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
      gallery: PropTypes.shape({
        images: PropTypes.arrayOf(
          PropTypes.shape({
            src: PropTypes.string.isRequired,
            default: PropTypes.bool.isRequired,
          })).isRequired,
      }).isRequired,
      event: PropTypes.shape({
        location: PropTypes.shape({
          label: PropTypes.string,
          longitude: PropTypes.number.isRequired,
          latitude: PropTypes.number.isRequired,
        }).isRequired,
        since: PropTypes.number.isRequired,
        until: PropTypes.number.isRequired,
      }),
      hobbies: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          name: PropTypes.string.isRequired,
        })).isRequired,
      members: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string.isRequired,
          fullName: PropTypes.string.isRequired,
          avatar: PropTypes.shape({
            id: PropTypes.string.isRequired,
            src: PropTypes.string.isRequired,
          }),
          owner: PropTypes.bool,
        }).isRequired,
      ),
      location: PropTypes.shape({
        label: PropTypes.string,
        longitude: PropTypes.number.isRequired,
        latitude: PropTypes.number.isRequired,
      }),
      since: PropTypes.number,
      until: PropTypes.number,
      details: PropTypes.string.isRequired,
    }).isRequired,
    onComponentWillUnmount: PropTypes.func,
    onPopupComponentWillUnmount: PropTypes.func,
    showOwnerDetails: PropTypes.bool,
    actionButtons: PropTypes.func,
    popupActionButtons: PropTypes.func,
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
      showPopupMap: false,
      showEditPopup: false,
      showChatPopup: false,
    };
  }

  componentWillUnmount() {
    const { onComponentWillUnmount } = this.props;

    if (onComponentWillUnmount instanceof Function) {
      onComponentWillUnmount(this);
    }
  }
  getListItem() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersion;

      default:
        return ListItem;
    }
  }

  render() {
    const {
      history,
      isAuthenticated,
      user,
      data,
      onPopupComponentWillUnmount,
      showOwnerDetails,
      actionButtons,
      popupActionButtons,
      accessToken,
      dispatch,
      onPopupOpen,
      onPopupClose,
      groupsList,
      groupHasDate,
      lastSeen_1,
      lastSeen_2,
      notification,
      setViewedNotification,
    } = this.props;

    const {
      showPopupMap,
      showChatPopup,
      showPopup,
      showEditPopup,
      isJoining
    } = this.state;

    const lastSeen = lastSeen_2 > moment().unix() - 86400 ? lastSeen_1 : lastSeen_2;
    const ListItem = this.getListItem();
    const { gallery, members, id: groupId } = data;
    const defaultImage = gallery.images.find(i => i.default);
    const location = data.location || (data.event && data.event.location);
    const since = moment(data.since || (data.event && data.event.since), 'X');
    const until = moment(data.until || (data.event && data.event.until), 'X');
    const isFull = members.length >= data.size;
    const isMember = isAuthenticated && !!members.find((m) => m.id === user.id);

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

    const divMap = {
      height: 600,
      width: 955,
      top: '40px',
      position: 'absolute',
    };

    return (
      <ListItem
        lastSeen={lastSeen}
        isAuthenticated={isAuthenticated}
        accountIsConfirmed={user.confirmed}
        notification={notification || null}
        data={data}
        groupHasDate={groupHasDate}
        isFull={isFull}
        isMember={isMember}
        location={location}
        since={since}
        until={until}
        defaultImage={defaultImage}
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
        onImageClick={() => {
          this.setState({
            showPopup: true,
          }, () => setViewedNotification(notification));
        }}
        onViewNotification={() => setViewedNotification(notification)}
        onPopupComponentWillUnmount={
          onPopupComponentWillUnmount
        }
        onChatPopupOpen={() => this.setState({
          showChatPopup: true,
          showPopup: false
        })}
        onChatPopupClose={() => this.setState({showChatPopup: false})}
        showChatPopup={showChatPopup}
        showPopup={showPopup}
        showOwnerDetails={showOwnerDetails}
        actionButtons={actionButtons(this)}
        showPopupMap={showPopupMap}
        groupsList={groupsList}
        onPopupMapClose={onPopupMapClose}
        onMapClick={e => {
          e.preventDefault();

          if (onPopupOpen instanceof Function) {
            onPopupOpen(
              <Popup onClose={onPopupMapClose}>
                <div style={divMap}>
                  <MapPopup
                    markerId={data.id}
                    center={{lat: data.location.latitude, lng: data.location.longitude}}
                    data={groupsList}
                    containerElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
                    mapElement={<div style={{height: '100%', cursor: 'pointer'}}/>}
                    loadingElement={<div />}
                    googleMapURL={config.googleMapsApiV3Url}
                  />
                </div>
              </Popup>
            );
          }
          else {
            this.setState({
              showPopupMap: true,
            });
          }
        }}

        onJoinToGroup={() => {
          if (isAuthenticated) {
            if ( ! isJoining) {
              this.setState({
                isJoining: true,
              }, () => {
                this.toggleJoiningStatusFetcher =
                  dispatch(
                    joinGroup(
                      accessToken,
                      groupId
                    )
                  );

                this.toggleJoiningStatusFetcher
                  .then(() => {
                    this.setState({
                      isJoining: false,
                    }, () => {
                      dispatch(
                        receiveJoinGroup(groupId, user)
                      );
                    });
                  });
              });
            }
          }
          else {
            history.push('/login', {from: `groups/${groupId}`});
          }
        }}
        isJoining={isJoining}
        popupActionButtons={popupActionButtons}
        onPopupClose={() => {
          this.setState({
            showPopup: false,
          });
        }}
        showEditPopup={showEditPopup}
        onEditPopupClose={() => {
          this.setState({
            showEditPopup: false,
          });
        }}
        onEditPopupSuccess={() => {
          this.setState({
            showEditPopup: false,
          });
        }}
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
    groupsList: state.groups.list,
    isAuthenticated: state.auth.isAuthenticated,
    accessToken: state.auth.accessToken,
    user: state.user,
    UIVersion: state.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(ListItemContainer));
