import React  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { actionIsAllowed } from '../../../../helpers/permissions';
import PaginatedTable from '../../../components/_tables/PaginatedTable';
import List from './List';

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = false;
  }

  getLoadDataFetcher() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/hobbies/categories`,
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
      module: 'hobbies',
      action: 'manage-everything',
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
            label: I18n.t('administration.table.title'),
            type: 'input',
          }
        ]}
        filterData={this.filterData}
        isFetching={isFetching}
        hobbiesList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={
          this.canChangeNOFRecordsPerPage()
        }
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        canModerateAllHobbiesList={
          actionIsAllowed(permissions, {
            module: 'hobbies',
            action: 'manage-everything',
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
