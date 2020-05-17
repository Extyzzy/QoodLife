import React  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
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
        `/v1/users/pending-status-professional-power`,
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
      action: 'manage-all-promotions',
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
        canModerateAllProfessionals={
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

export default withRouter(connect(mapStateToProps)(ListContainer));
