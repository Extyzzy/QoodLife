import React, { Component } from "react";
import { connect } from "react-redux";
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../../constants/index';
import Loader from '../../../../../components/Loader/Loader';
import ComponentsList from "../../../../../components/ComponentsList/ComponentsList";
import GroupsListItem from "../../../../_groups/Groups/components/ListItem/ListItemContainer";
import {
  clearGroups,
  fetchGroupsWithStore,
  loadMoreGroupsUsingStore,
} from "../../../../../actions/groups";

import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./GroupsList.scss";
import {FILTER_OWNED} from "../../../../../helpers/filter";

class GroupsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);
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
      navigation,
      match: {params: {userId: userRoute}},
    } = this.props;

    const { navigation: nextNavigation } = nextProps;
    const userId = userRoute.split('-').pop();

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchGroupsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
            __GET: {
              user: userId,
              role: 'member',
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

  fetchGroupsList() {
    const {
      dispatch,
      accessToken,
      navigation,
      match: {params: {userId: userRoute}},
    } = this.props;

    const userId = userRoute.split('-').pop();

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            user: userId,
            role: 'member',
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

  /**
   * Function to be triggered on ListItem componentWillUnmount
   * to cancel fetcher Promise if is still fetching.
   *
   * @param _this
   */
  onListItemComponentWillUnmount(_this) {
    if (_this.removeFetcher instanceof Promise) {
      _this.removeFetcher.cancel();
    }
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      groupsList,
      match: {params: {userId: userRoute}},
    } = this.props;

    const userId = userRoute.split('-').pop();

    if ( ! loadingMore) {
      dispatch(
        loadMoreGroupsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: groupsList.length,
              user: userId,
              role: 'member',
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
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    const { isLoaded } = this.state;

    return (
      <div className={s.root}>
        {
          isLoaded && (
            (!!groupsList && !!groupsList.length && (
              <ComponentsList
                component={GroupsListItem}
                list={groupsList}
                onComponentWillUnmount={
                  this.onListItemComponentWillUnmount
                }
                actionButtons={
                  this.listItemActionButtons
                }
                viewMode="icons"
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
    accessToken: state.auth.accessToken,
    isFetching: state.groups.isFetching,
    loadingMore: state.groups.loadingMore,
    couldLoadMore: state.groups.couldLoadMore,
    groupsList: state.groups.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}
export default withRouter(connect(mapStateToProps)(withStyles(s)(GroupsList)));
