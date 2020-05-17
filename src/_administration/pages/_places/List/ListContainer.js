import React  from 'react';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import {SilencedError} from "../../../../exceptions/errors";

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

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = true;
  }

  getLoadDataFetcher(filter) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const queryData = getQueryData(filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  switchVisibilityInPage(placeId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedIndex = (list.findIndex(p => p.id === placeId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/places/${placeId}/change-hide-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            list[changedIndex].canBeSee = !list[changedIndex].canBeSee;

            this.setState({
              list,
            }, () => this.forceUpdate());
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to switch status.')
            );
        }
      })
  }

  render() {

    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'places',
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
            name: 'phoneNumber',
            label: I18n.t('administration.table.phone'),
            type: 'input',
          },
          {
            name: 'promoted',
            label: I18n.t('administration.table.promoted'),
            type: 'check',
            params: {
              checkboxLabel: 'Has active promotion',
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
        isFetching={isFetching}
        placesList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        switchVisibilityInPage={(id) => this.switchVisibilityInPage(id)}

        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        canManageAllPromotions={
          actionIsAllowed(permissions, {
            module: 'places',
            action: 'manage-all-promotions',
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
