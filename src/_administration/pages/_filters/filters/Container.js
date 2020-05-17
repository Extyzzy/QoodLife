import React from 'react';
import update from 'immutability-helper';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { fetchAuthorizedApiRequest } from '../../../../fetch';
import { appendToFormData } from '../../../../helpers/form';
import { actionIsAllowed } from '../../../../helpers/permissions';
import { I18n } from 'react-redux-i18n';
import PaginatedTable from '../../../components/_tables/PaginatedTable';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';
import View from './View';

class Container extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.hasFilter = true;
    this.switchModeratedStatus = this.switchModeratedStatus.bind(this);
  }

  getLoadDataFetcher(filter) {
    const { dispatch, accessToken } = this.props;

    return dispatch(
      fetchAuthorizedApiRequest(`/v1/events/calendar/filters`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    );
  }

  getFormData(filter) {
    return appendToFormData(
      new FormData(),
      {
        name: filter.name,
        public: +!filter.public
      },
      'filter'
    );
  }

  getFormDataOnUpdate(filter) {
    let formData = this.getFormData(filter);
    formData.append('_method', 'PUT');

    return formData;
  }

  switchModeratedStatus(filter) {
    const { accessToken, dispatch } = this.props;
    const { list } = this.state;
    const filterIndex = list.findIndex(b => b.id === filter.id);

    dispatch(
      fetchAuthorizedApiRequest(`/v1/events/calendar/filters/${filter.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
        body: this.getFormDataOnUpdate(filter)
      })
    ).then(response => {
      switch (response.status) {
        case 200:
          this.setState({
            list: update(list, {
              [filterIndex]: {
                public: {
                  $set: !list[filterIndex].public
                }
              }
            })
          });
          break;
        default:
          console.info('Error to switch moderated Status.');
      }
    });
  }

  render() {
    const { permissions } = this.props;

    const { nofRecordsPerPage, isFetching } = this.state;

    if (
      !actionIsAllowed(permissions, {
        module: 'products',
        action: 'view-all-stored'
      })
    ) {
      return <Forbidden />;
    }

    return (
      <View
        filters={[
          {
            name: 'title',
            label: I18n.t('administration.table.title'),
            type: 'input'
          },
          {
            name: 'createdAt',
            label: I18n.t('administration.table.createdAt'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time')
            }
          }
        ]}
        filterData={this.filterData}
        isFetching={isFetching}
        filtersList={this.getActiveRecords()}
        prevDisabledStatus={this.canGetPrevRecords()}
        nextDisabledStatus={this.canGetNextRecords()}
        onPrevClick={this.getPrevRecords}
        onNextClick={this.getNextRecords}
        changeNOFRecordsPerPage={this.changeNOFRecordsPerPage}
        nofRecordsPerPage={nofRecordsPerPage}
        nofRecordsPerPageDisabledStatus={this.canChangeNOFRecordsPerPage()}
        changeModerateStatus={this.switchModeratedStatus}
        canModerateAllPosts={actionIsAllowed(permissions, {
          module: 'products',
          action: 'moderate-all'
        })}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions
  };
}

export default withRouter(connect(mapStateToProps)(Container));
