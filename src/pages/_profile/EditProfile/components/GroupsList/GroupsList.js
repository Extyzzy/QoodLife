import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import moment from 'moment';
import classes from 'classnames';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./GroupsList.scss";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import GroupsListItem from "../../../../../pages/_groups/Groups/components/ListItem";
import { settingsForListitem } from "../../../../../components/_carousel/SliderSettingsMobile";
import CreateGroupButton from '../../../../_groups/Groups/components/CreateGroupButton';
import { confirm } from '../../../../../components/_popup/Confirm/confirm';
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';
import {FILTER_OWNED} from "../../../../../helpers/filter";
import { MOBILE_VERSION, DESKTOP_VERSION } from '../../../../../actions/app';
import {
  clearGroups,
  deleteGroup,
  fetchGroupsWithStore,
  receiveDeleteGroup,
  loadMoreGroupsUsingStore,
} from "../../../../../actions/groups";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';

class GroupsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);

    this.listItemActionButtons = this.listItemActionButtons.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(
      clearGroups()
    );
  }

  componentDidMount() {
    this.fetchGroupsList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      role,
    } = this.props;

    const {
      navigation: nextNavigation,
      notificationsList: nextNotificationsList
    } = nextProps;

    if ( ! isEqual(role, nextProps.role)) {
      dispatch(
        fetchGroupsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
              __GET: {
                role: nextProps.role,
                ids: nextNotificationsList ? nextNotificationsList.map(data => data.objectReferenceId) : null
              },
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchGroupsListFetcher instanceof Promise) {
      this.fetchGroupsListFetcher.cancel();
    }
  }

  notificationsIds() {
    const {notificationsList} = this.props;

    if (notificationsList) {
      return notificationsList.map(data => data.objectReferenceId)
    } else {
      return null
    }
  }

  fetchGroupsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      role,
    } = this.props;

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            role: role,
            ids: this.notificationsIds(),
          },
        }
      )
    );

    this.fetchGroupsListFetcher
      .finally(() => {
        if ( ! this.fetchGroupsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }


  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }


  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      history,
      role,
    } = this.props;

    const {
      isRemoving,
    } = _this.state;

    const {
      id: groupId,
    } = _this.props.data;

    return [
      <button
        key="EditEvent"
        className='edit round-button'
        onClick={() => {
            history.push(`/groups/edit/${groupId}`, {data: _this.props.data, role: role});
        }}
      />,
      <button
        key="RemoveEvent"
        className='remove round-button'

        onClick={() => {
          confirm(I18n.t('groups.confirmDeleteGroup')).then(() => {
            if (!isRemoving) {
              _this.setState({
                isRemoving: true,
              }, () => {
                /**
                 * TODO: Will be needed to confirm
                 * this action before removing.
                 */

                _this.removeFetcher = dispatch(
                  deleteGroup(
                    accessToken,
                    groupId
                  )
                );

                _this.removeFetcher
                  .then(() => {
                    _this.setState({
                      isRemoving: false,
                    }, () => {
                      dispatch(
                        receiveDeleteGroup(groupId)
                      );
                    });
                  });
              });
            }
          });
        }}
      />,
    ];
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      groupsList,
      role,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreGroupsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              role: role,
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: groupsList.length,
              ids: this.notificationsIds(),
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isMobile,
      isFetching,
      loadingMore,
      couldLoadMore,
      totalNrOfItems,
      notificationsList,
      setViewedNotification,
      groupsList,
      role,
      history,
      match,
      uiVersion
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const { isLoaded } = this.state;
    const routeLink = (role === 'place') ? 'business' : (role === 'member') ? 'member' : 'professional';

    return (
      <div className={classes({
        [s.root]: uiVersion === DESKTOP_VERSION,
        [s.rootMobile]: uiVersion === MOBILE_VERSION
      })}>
        <div className={s.head}>
          <h4>{I18n.t('groups.groupsEditProfile')}</h4>
          {
            isMobile && (
              (match.path !== `/profile/${routeLink}/groups`) && (
                <button
                  className={s.seeAll}
                  onClick={() => history.push(`/profile/${routeLink}/groups`)}
                >
                  {I18n.t('administration.menuDropDown.showAll')}
                </button>
              )
            )
          }
          <CreateGroupButton role={role} isMobile={isMobile} />
        </div>

        {
          isLoaded && (
            (!!groupsList && !!groupsList.length && (
              (isMobile && (
                <Slider
                  className={s.slider}
                  beforeChange={(prevIndex, nextIndex) => {
                    if(totalNrOfItems > groupsList.length && nextIndex+1 === groupsList.length) {
                      this.loadMore();
                    }
                  }}
                  {...settingsForListitem}
                >
                  {
                    groupsList.map(item => {
                      return (
                        <div key={`${item.key}_${item.id}`}>
                          <GroupsListItem
                            data={item}
                            className={s.listItem}
                          />
                        </div>
                      );
                    })
                  }
                </Slider>
              )) || (
                <ComponentsList
                  list={groupsList}
                  component={GroupsListItem}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  showOwnerDetails={false}
                  actionButtons={this.listItemActionButtons}
                  setViewedNotification={setViewedNotification}
                  notificationsList={notificationsList}
                />
              ))) || (
                <div className={s.notFoundMessage}>
                  {I18n.t('groups.groupsNotFound')}
                </div>
              )
          )
        }

        {
          couldLoadMore && !isMobile && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {
                  loadingMore
                    ? I18n.t('general.elements.loading')
                    : I18n.t('general.elements.loadMore')
                }
              </button>
            </div>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    uiVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    user: state.user,
    isFetching: state.groups.isFetching,
    loadingMore: state.groups.loadingMore,
    couldLoadMore: state.groups.couldLoadMore,
    totalNrOfItems: state.groups.totalNrOfItems,
    groupsList: state.groups.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(GroupsList)));
