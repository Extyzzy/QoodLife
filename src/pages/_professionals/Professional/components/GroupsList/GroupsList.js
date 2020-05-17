import React, { Component } from "react";
import Slider from "react-slick";
import { connect } from "react-redux";
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { withRouter } from 'react-router';
import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../../constants';
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import GroupsListItem from "../../../../_groups/Groups/components/ListItem";
import {
  settingsForListitem,
} from "../../../../../components/_carousel/SliderSettingsMobile";
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
      ownerID,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchGroupsWithStore(
          accessToken,
          {
            navigation: nextNavigation,
            group: FILTER_OWNED,
            __GET: {
              user: ownerID,
              role: 'professional',
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
      ownerID,
    } = this.props;

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(
        accessToken,
        {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            user: ownerID,
            role: 'professional',
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
      ownerID,
    } = this.props;

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
              user: ownerID,
              role: 'professional',
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
              (isMobile && (
                <Slider
                  className={s.slider}
                  beforeChange={(prevIndex, nextIndex) => {
                    if(totalNrOfItems > groupsList.length && nextIndex === groupsList.length) {
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
                  actionButtons={
                    this.listItemActionButtons
                  }
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
    accessToken: state.auth.accessToken,
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
