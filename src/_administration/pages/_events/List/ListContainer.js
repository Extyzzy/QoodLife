import React  from 'react';
import { connect } from 'react-redux';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden/Forbidden';

import {
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  getCurrentPosition,
} from '../../../../helpers/geo';

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

    this.state = {
      ...this.state,
      latitude: null,
      longitude: null,
    };

    this.hasFilter = true;
    this.switchModeratedStatus = this.switchModeratedStatus.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();

    this.currentPositionGetter = getCurrentPosition();

    this.currentPositionGetter
      .then(({latitude, longitude}) => {
        this.setState({
          latitude,
          longitude,
        });
      });
  }

  componentWillUnmount() {
    super.componentWillUnmount();

    if (this.currentPositionGetter instanceof Promise) {
      this.currentPositionGetter.cancel();
    }
  }

  getLoadDataFetcher(filter = {}) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const {
      latitude,
      longitude,
    } = this.state;

    const queryData = getQueryData(filter.range ? {
      ...filter,
      lat: latitude,
      lng: longitude,
    } : filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/events/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  switchModeratedStatus(eventId, moderate) {
    const { accessToken, dispatch } = this.props;
    const { list } = this.state;
    const changedPostIndex = (list.findIndex(p => p.id === eventId));

    dispatch(
      fetchAuthorizedApiRequest(moderate ? `/v1/events/${eventId}/deactivate` : `/v1/events/${eventId}/activate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    )
      .then(response => {
        switch (response.status) {
          case 200:
            list[changedPostIndex].public = !list[changedPostIndex].public;
            this.setState({
              list,
            });
            break;
          default:
            console.info('Error to switch moderated Status.')
        }
      })
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'events',
      action: 'view-all-stored',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      nofRecordsPerPage,
      isFetching,
      latitude,
      longitude,
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
            name: 'promoted',
            label: I18n.t('administration.table.promoted'),
            type: 'check',
            params: {
              checkboxLabel: 'Has active promotion',
            },
          },
          ...(latitude && longitude ? [
            {
              name: 'range',
              label: I18n.t('administration.table.range'),
              type: 'input',
              params: {
                inputType: 'number',
                inputPlaceholder: 'in KM',
              },
            },
          ] : []),
          {
            name: 'createdAt',
            label: I18n.t('administration.table.'),
            type: 'date',
            params: {
              dateFormat: I18n.t('formats.date'),
              timeFormat: I18n.t('formats.time'),
            },
          },
        ]}
        filterData={this.filterData}
        isFetching={isFetching}
        eventsList={this.getActiveRecords()}
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
            module: 'events',
            action: 'manage-all-promotions',
          })
        }
        changeModerateStatus={this.switchModeratedStatus}
        canModerateAllEvents={
          ! actionIsAllowed(permissions, {
            module: 'events',
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
