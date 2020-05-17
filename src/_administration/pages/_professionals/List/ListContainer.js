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
        `/v1/professionals/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'professionals',
      action: 'view-all-stored',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      nofRecordsPerPage,
      isFetching,
      filterData: {
        positionOptions = [],
      },
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
            name: 'position',
            label: I18n.t('administration.table.position'),
            type: 'select',
            params: {
              selectOptions: positionOptions,
              multipleSelect: true,
            },
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
        professionalsList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        canManageAllPromotions={
          actionIsAllowed(permissions, {
            module: 'professionals',
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
