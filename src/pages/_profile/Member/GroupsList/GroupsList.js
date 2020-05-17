import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './GroupsList.scss';
import { withRouter } from 'react-router';
import moment from 'moment';
import { FILTER_OWNED } from '../../../../helpers/filter';
import {
  fetchGroupsWithStore,
  loadMoreGroupsUsingStore
} from '../../../../actions/groups';
import Loader from '../../../../components/Loader/Loader';
import ComponentsList from '../../../../components/ComponentsList/ComponentsList';
import GroupsListItem from '../../../_groups/Groups/components/ListItem/ListItemContainer';
import { I18n } from 'react-redux-i18n';

import { DEFAULT_NOF_RECORDS_PER_PAGE } from '../../../../constants';

class GroupsListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.fetchGroupsList();
  }

  componentWillUnmount() {
    if (this.fetchGroupsListFetcher instanceof Promise) {
      this.fetchGroupsListFetcher.cancel();
    }
  }

  fetchGroupsList() {
    const { dispatch, accessToken, navigation } = this.props;

    this.fetchGroupsListFetcher = dispatch(
      fetchGroupsWithStore(accessToken, {
        navigation,
        group: FILTER_OWNED,
        __GET: {
          role: 'member'
        }
      })
    );

    this.fetchGroupsListFetcher.finally(() => {
      if (!this.fetchGroupsListFetcher.isCancelled()) {
        this.setState({
          isLoaded: true
        });
      }
    });
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      groupsList
    } = this.props;

    if (!loadingMore) {
      dispatch(
        loadMoreGroupsUsingStore(accessToken, {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            role: 'member',
            before: this.createdAt.unix(),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            skip: groupsList.length
          }
        })
      );
    }
  }

  render() {
    const { isFetching, groupsList, loadingMore, couldLoadMore } = this.props;

    if (isFetching) {
      return <Loader sm contrast />;
    }
    return (
      <div>
        {(!!groupsList.length && (
          <ComponentsList
            component={GroupsListItem}
            list={groupsList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('groups.groupsNotFound')}
        {couldLoadMore && (
          <div className="text-center">
            <button
              className="btn btn-default"
              disabled={loadingMore}
              onClick={this.loadMore}
            >
              {loadingMore
                ? I18n.t('general.elements.loading')
                : I18n.t('general.elements.loadMore')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    loadingMore: state.groups.loadingMore,
    couldLoadMore: state.groups.couldLoadMore,
    groupsList: state.groups.list,
    isFetching: state.groups.isFetching
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(s)(GroupsListContainer))
);
