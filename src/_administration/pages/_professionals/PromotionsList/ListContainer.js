import React  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden';
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';

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

import {
  InternalServerError,
} from "../../../../exceptions/http";

class ListContainer extends PaginatedTable {
  constructor(props, context) {
    super(props, context);

    this.state = Object.assign({}, this.state, {
      loaded: false,
      professionalDetails: null,
    });

    this.deleteInterval = this.deleteInterval.bind(this);
  }

  componentDidMount() {
    this.fetchProfessionalDetails();
    super.componentDidMount();
  }

  componentWillUnmount() {
    if (this.fetchProfessionalDetailsFetcher instanceof Promise) {
      this.fetchProfessionalDetailsFetcher.cancel();
    }

    if (this.deleteIntervalFetcher instanceof Promise) {
      this.deleteIntervalFetcher.cancel();
    }

    super.componentWillUnmount();
  }

  fetchProfessionalDetails() {
    const {
      match: {
        params: {
          professionalId,
        },
      },
      dispatch,
      accessToken,
    } = this.props;

    this.fetchProfessionalDetailsFetcher =
      dispatch(
        fetchAuthorizedApiRequest(`/v1/professionals/${professionalId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      );

    this.fetchProfessionalDetailsFetcher
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new InternalServerError()
            );

        }
      })
      .then(professionalDetails => {
        this.setState({
          professionalDetails,
          loaded: true,
        });
      }, () => {
        this.setState({
          loaded: true,
        });
      });
  }

  getLoadDataFetcher(filter) {
    const {
      dispatch,
      accessToken,
      match: {
        params: {
          professionalId,
        },
      },
    } = this.props;

    const queryData = getQueryData(filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/professionals/${professionalId}/promotions${(queryData ? `?${queryData}` : '')}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        })
    );
  }

  deleteInterval(intervalId) {

    if (window.confirm(I18n.t('administration.confirmAction'))) {
      const {
        dispatch,
        accessToken,
      } = this.props;

      const {
        list,
      } = this.state;

      this.deleteIntervalFetcher = dispatch(
        fetchAuthorizedApiRequest(
          `/v1/professionals/promotions/${intervalId}`,
          {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          })
      );

      this.deleteIntervalFetcher
        .then(response => {
          switch (response.status) {
            case 204:

              return Promise.resolve();

            default:

              return Promise.reject(
                new InternalServerError()
              );
          }
        })
        .then(() => {
          const intervalIndex = list
            .findIndex(({id}) => id === intervalId);

          if (intervalIndex === -1) {
            return;
          }

          this.setState({
            list: update(list, {
              $splice: [[intervalIndex, 1]],
            }),
          });
        });
    }
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
      loaded,
      professionalDetails,
      nofRecordsPerPage,
      isFetching,
    } = this.state;

    if ( ! loaded) {
      return (
        <Loader />
      );
    }

    if ( ! professionalDetails) {
      return (
        <PageNotFound />
      );
    }

    return (
      <List
        isFetching={isFetching}
        professionalDetails={professionalDetails}
        promotionsList={this.getActiveRecords()}
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
        canManagePromotions={
          actionIsAllowed(permissions, {
            module: 'professionals',
            action: 'manage-all-promotions',
          })
        }
        deleteInterval={this.deleteInterval}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
    authedUser: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(ListContainer));
