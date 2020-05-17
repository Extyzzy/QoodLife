import React  from 'react';
import update from 'immutability-helper';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';

import { InternalServerError } from '../../../../exceptions/http';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { getQueryData } from '../../../../helpers/filter';
import { actionIsAllowed } from '../../../../helpers/permissions';

import PaginatedTable from '../../../components/_tables/PaginatedTable';
import List from './List';
import {withRouter} from "react-router";

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = true;

    this.confirmPending = this.confirmPending.bind(this);
    this.resPending = this.resPending.bind(this);

    this.confirmPendingAgent = this.confirmPendingAgent.bind(this);
    this.resPendingAgent = this.resPendingAgent.bind(this);
    this.activateSpecialOffer = this.activateSpecialOffer.bind(this);
  }

  getLoadDataFetcher(filter) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const queryData = getQueryData(filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/users/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  confirmPending(userId){
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/accept-professional-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:
            const changedUserIndex = list.findIndex(p => p.id === userId);
            this.setState({
              list: update(list, {
                [changedUserIndex]: {
                  $apply: (user) => update(user, {
                    profPending: {
                      $set: 'ok',
                    },
                    roles: {
                      $push: [{
                        name: I18n.t('administration.table.roleNameProf'),
                        code: 'professional',
                      }],
                    },
                  }),
                },
              }),
            });
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  resPending(userId){
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/reject-professional-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:
            const changedUserIndex = list.findIndex(p => p.id === userId);
            this.setState({
              list: update(list, {
                [changedUserIndex]: {
                  $apply: (user) => update(user, {
                    profPending: {
                      $set: 'cancel',
                    },
                  }),
                },
              }),
            });
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  confirmPendingAgent(userId){
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/accept-place-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:
            const changedUserIndex = list.findIndex(p => p.id === userId);
            this.setState({
              list: update(list, {
                [changedUserIndex]: {
                  $apply: (user) => update(user, {
                    placePending: {
                      $set: 'ok',
                    },
                    roles: {
                      $push: [{
                        name: I18n.t('administration.table.roleNameAgent'),
                        code: 'place',
                      }],
                    }
                  }),
                },
              }),
            });
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }


  resPendingAgent(userId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/users/${userId}/reject-place-pending`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 204:
            const changedUserIndex = list.findIndex(p => p.id === userId);
            this.setState({
              list: update(list, {
                [changedUserIndex]: {
                  $apply: (user) => update(user, {
                    placePending: {
                      $set: 'cancel',
                    },
                  }),
                },
              }),
            });
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  activateSpecialOffer() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/tariffplans/promotion-all-user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        method: 'POST',
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(() => {
        this.setState({
          activateOffer: true
        }, () => this.activateCorrectDemoData());
      })
      .then(() => {
        return Promise.resolve()
      });
  }

  activateCorrectDemoData() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(`/v1/global-requests/correct-demo-data`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        method: 'POST',
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            return Promise.resolve();
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'users',
      action: 'view-all-stored',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      nofRecordsPerPage,
      isFetching,
      activateOffer,
    } = this.state;

    return (
      <List
        filters={[
          {
            name: 'name',
            label: I18n.t('administration.table.name'),
            type: 'input',
          },
          {
            name: 'email',
            label: I18n.t('administration.table.email'),
            type: 'input',
          },
          {
            name: 'profPending',
            label: I18n.t('administration.table.promote'),
            type: 'select',
            params: {
              selectOptions:
                [
                  {
                    value: 'null',
                    label: I18n.t('administration.table.notPending'),
                  },
                  {
                    value: 'pending',
                    label: I18n.t('administration.table.pending'),
                  },
                  {
                    value: 'ok',
                    label: I18n.t('administration.table.confirmed'),
                  }
                ],
              multipleSelect: false,
            },
          },
          {
            name: 'status',
            label: I18n.t('administration.table.status'),
            type: 'select',
            params: {
              selectOptions: [
                {
                  value: 'active',
                  label: I18n.t('administration.table.active'),
                },
                {
                  value: 'suspended',
                  label: I18n.t('administration.table.suspended'),
                },
              ],
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
        filterData={this.filterData}
        confirmPending={this.confirmPending}
        resPending={this.resPending}
        confirmPendingAgent={this.confirmPendingAgent}
        resPendingAgent={this.resPendingAgent}
        activateSpecialOffer={this.activateSpecialOffer}
        activateOffer={activateOffer}
        isFetching={isFetching}
        usersList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={
          this.changeNOFRecordsPerPage
        }
        canManageAllSuspensions={
          actionIsAllowed(permissions, {
            module: 'users',
            action: 'manage-all-suspensions',
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

export default withRouter(connect(mapStateToProps)(ListContainer));
