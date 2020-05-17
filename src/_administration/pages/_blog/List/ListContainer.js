import React  from 'react';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import {
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  getQueryData,
} from '../../../../helpers/filter';

import  {
  actionIsAllowed,
} from '../../../../helpers/permissions';

import PaginatedTable from '../../../components/_tables/PaginatedTable';
import List from './List';
import {SilencedError} from "../../../../exceptions/errors";

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = true;
    this.activatePost = this.activatePost.bind(this);
    this.dezactivatePost = this.dezactivatePost.bind(this);
    this.cancelPending = this.cancelPending.bind(this);
  }

  getLoadDataFetcher(filter) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const queryData = getQueryData(filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/posts/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  cancelPending(postId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedPostIndex = (list.findIndex(p => p.id === postId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/posts/${postId}/cancel-pending`, {
        ...(accessToken ? {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            list[changedPostIndex].status.pending = 'not-sent';
            this.setState({
              list,
            });
            this.forceUpdate();
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch activate the post.')
            );
        }
      })
  }

  activatePost(postId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedPostIndex = (list.findIndex(p => p.id === postId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/posts/${postId}/activate`, {
        ...(accessToken ? {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            list[changedPostIndex].public = true;

            this.setState({
              list,
            }, () => this.forceUpdate());
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch activate the post.')
            );
        }
      })
  }

  dezactivatePost(postId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedPostIndex = (list.findIndex(p => p.id === postId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/posts/${postId}/deactivate `, {
        ...(accessToken ? {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            list[changedPostIndex].public = false;
            // list[changedProductIndex].status.pending = 'sent not-confirmed';
            this.setState({
              list,
            }, () => this.forceUpdate());
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch dezactivate the post.')
            );
        }
      })
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'blog',
      action: 'view-all-stored',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      nofRecordsPerPage,
      isFetching,
    } = this.state;

    return (
      <List
        filters={[
          {
            name: 'title',
            label: I18n.t('administration.table.title'),
            type: 'input',
          },
          {
            name: 'owner',
            label: I18n.t('administration.table.owner'),
            type: 'input',
          },
          {
            name: 'moderated',
            label: I18n.t('administration.table.moderated'),
            type: 'check',
            params: {
              checkboxLabel: 'Is moderated',
            },
          },
          {
            name: 'createdAt',
            label: I18n.t('administration.table.createdAt'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time'),
            },
          },
        ]}
        activatePost={this.activatePost}
        dezactivatePost={this.dezactivatePost}
        cancelPending={this.cancelPending}
        filterData={this.filterData}
        isFetching={isFetching}
        postsList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        canModerateAllPosts={
          actionIsAllowed(permissions, {
            module: 'blog',
            action: 'moderate-all',
          })
        }
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
  };
}

export default connect(mapStateToProps)(ListContainer);
