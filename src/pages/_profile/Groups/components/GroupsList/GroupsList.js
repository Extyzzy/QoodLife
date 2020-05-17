import React, {Component} from "react";
import {connect} from "react-redux";
import {isEqual} from "lodash";
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./GroupsList.scss";
import { withRouter } from 'react-router';
import Loader from "../../../../../components/Loader/Loader";
import ComponentsList from "../../../../../components/ComponentsList/ComponentsList";
import GroupsListItem from "../../../../_groups/Groups/components/ListItem/ListItemContainer";
import {FILTER_USER_RELATED} from "../../../../../helpers/filter";
import { confirm } from '../../../../../components/_popup/Confirm/confirm';

import {
  clearGroups,
  deleteGroup,
  fetchGroupsWithStore,
  receiveDeleteGroup,
  loadMoreGroupsUsingStore,
} from "../../../../../actions/groups";

import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../../constants';
import { fetchAuthorizedApiRequest } from "../../../../../fetch";
import { clearGroupsNotifications } from "../../../../../actions/notifications";
import { appendToFormData } from "../../../../../helpers/form";
import { I18n } from "react-redux-i18n";

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
    const {dispatch} = this.props;

    dispatch(
      clearGroups()
    );
  }

  componentDidMount() {
    const {dispatch, accessToken} = this.props;

    this.fetchGroupsList();

    this.seenAllFroupsFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/groups/seen-all`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    this.seenGroupsNotificationsFetcher = dispatch(
      fetchAuthorizedApiRequest(`/v1/notifications/last-seen`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            module: ['groups'].map(m => m)
          },
          'lastSeen',
        ),
      })
    );
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const {navigation: nextNavigation} = nextProps;

    if (!isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchGroupsWithStore(
          accessToken,
          {
            group: FILTER_USER_RELATED,
            navigation: nextNavigation,
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchGroupsListFetcher instanceof Promise) {
      this.fetchGroupsListFetcher.cancel();
    }

    if (this.seenAllFroupsFetcher instanceof Promise) {
      this.seenAllFroupsFetcher.cancel();
    }

    if (this.seenGroupsNotificationsFetcher instanceof Promise) {
      this.seenGroupsNotificationsFetcher.cancel();
    }

    this.props.dispatch(
      clearGroupsNotifications()
    )
  }

  fetchGroupsList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(
        accessToken,
        {
          group: FILTER_USER_RELATED,
          navigation,
        }
      )
    );

    this.fetchGroupsListFetcher
      .finally(() => {
        if (!this.fetchGroupsListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      });
  }

  /**
   * Function to be triggered on ListItem componentWillUnmount
   * to cancel fetcher Promise if is still fetching.
   *
   * @param _this Reference to GroupsListItem
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }

  /**
   * Define ListItem action buttons array.
   *
   * @param _this Reference to GroupsListItem
   * @returns {[XML]}
   */
  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken,
      history,
      user,
    } = this.props;

    const { id: groupId, members } = _this.props.data;
    const { isRemoving } = _this.state;
    const isOwner = !!members.find(i => i.id === user.id && i.owner) || false;

    if(isOwner) {
      return [
        <button
          key="EditGroup"
          className="round-button edit"
          onClick={() => {
            history.push(`/groups/edit/${groupId}`, {data: _this.props.data});
          }}
        />,
        <button
          key="RemoveGroup"
          className='round-button remove'
          onClick={() => {
            if (!isRemoving) {
              confirm("Are you sure you want to delete this group?").then(() => {
                _this.setState({
                  isRemoving: true,
                }, () => {
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
              });
            }
          }}
        />,
      ];
    } else {
      return []
    }

  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      groupsList,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreGroupsUsingStore(
          accessToken,
          {
            group: FILTER_USER_RELATED,
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: groupsList.length,
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      groupsList,
      itemPopupActionButtons,
      groupsNotifications,
    } = this.props;

    if (isFetching) {
      return (
        <Loader sm contrast />
      );
    }

    const {isLoaded} = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!groupsList && !!groupsList.length && (
              <ComponentsList
                list={groupsList}
                component={GroupsListItem}
                onComponentWillUnmount={
                  this.onListItemComponentWillUnmount
                }
                showOwnerDetails={false}
                actionButtons={
                  this.listItemActionButtons
                }
                popupActionButtons={itemPopupActionButtons}
                notificationsList={groupsNotifications}
              />
            )) || I18n.t('groups.groupsNotFound')
          )
        }

        {
          couldLoadMore && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {loadingMore ? 'Loading...' : 'Load more'}
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
    user: state.user,
    accessToken: state.auth.accessToken,
    isFetching: state.groups.isFetching,
    loadingMore: state.groups.loadingMore,
    couldLoadMore: state.groups.couldLoadMore,
    groupsList: state.groups.list,
    groupsNotifications: state.notifications.forGroups,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(GroupsList)));
