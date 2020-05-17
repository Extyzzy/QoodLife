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
    this.activateProduct = this.activateProduct.bind(this);
    this.dezactivateProduct = this.dezactivateProduct.bind(this);
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
        `/v1/products/stored${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  cancelPending(productId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedProductIndex = (list.findIndex(p => p.id === productId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/products/${productId}/cancel-pending`, {
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
          case 204:
            list[changedProductIndex].status.pending = 'not-sent';
            this.setState({
              list,
            });
            this.forceUpdate();
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch activate the product.')
            );
        }
      })
  }

  activateProduct(productId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedProductIndex = (list.findIndex(p => p.id === productId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/products/${productId}/activate`, {
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
          case 204:
            list[changedProductIndex].public = true;
            //  list[changedProductIndex].status.pending = 'sent confirmed';
            this.setState({
              list,
            }, () => this.forceUpdate());
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch activate the product.')
            );
        }
      })
  }

  dezactivateProduct(productId) {
    const {
      dispatch,
      accessToken,
    } = this.props;

    const { list } = this.state;
    const changedProductIndex = (list.findIndex(p => p.id === productId));

    dispatch(
      fetchAuthorizedApiRequest(`/v1/products/${productId}/deactivate `, {
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
          case 204:
            list[changedProductIndex].public = false;
            // list[changedProductIndex].status.pending = 'sent not-confirmed';
            this.setState({
              list,
            }, () => this.forceUpdate());
            break;

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch dezactivate the product.')
            );
        }
      })
  }

  render() {
    const {
      permissions,
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
      module: 'products',
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
        activateProduct={this.activateProduct}
        dezactivateProduct={this.dezactivateProduct}
        cancelPending={this.cancelPending}
        filterData={this.filterData}
        isFetching={isFetching}
        productsList={this.getActiveRecords()}
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
            module: 'products',
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
