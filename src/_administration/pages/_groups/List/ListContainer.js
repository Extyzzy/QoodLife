import React  from 'react';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { getQueryData } from '../../../../helpers/filter';
import { actionIsAllowed } from '../../../../helpers/permissions';
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
        `/v1/groups/stored${(queryData ? `?${queryData}` : '')}`,
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
      module: 'groups',
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
            name: 'since',
            label: I18n.t('administration.table.since'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time'),
            },
          },
          {
            name: 'until',
            label: I18n.t('administration.table.until'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time'),
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
        groupsList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
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
