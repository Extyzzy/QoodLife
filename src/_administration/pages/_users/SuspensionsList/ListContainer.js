import React  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import update from 'immutability-helper';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden';
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';

import {
  fetchApiRequest,
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
      userDetails: null,
    });

    this.deleteInterval = this.deleteInterval.bind(this);
  }

  componentDidMount() {
    this.fetchUserDetails();
    super.componentDidMount();
  }

  componentWillUnmount() {
    if (this.fetchUserDetailsFetcher instanceof Promise) {
      this.fetchUserDetailsFetcher.cancel();
    }

    if (this.deleteIntervalFetcher instanceof Promise) {
      this.deleteIntervalFetcher.cancel();
    }

    super.componentWillUnmount();
  }

  fetchUserDetails() {
    const {
      match: {
        params: {
          userId,
        },
      },
    } = this.props;

    this.fetchUserDetailsFetcher = fetchApiRequest(`/v1/users/${userId}`);

    this.fetchUserDetailsFetcher
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
      .then(userDetails => {
        this.setState({
          userDetails,
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
          userId,
        },
      },
    } = this.props;

    const queryData = getQueryData(filter);

    return dispatch(
      fetchAuthorizedApiRequest(
        `/v1/users/${userId}/suspensions${(queryData ? `?${queryData}` : '')}`,
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
          `/v1/users/suspensions/${intervalId}`,
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
      authedUser: {
        id: authedUserId,
      },
      match: {
        params: {
          userId,
        },
      },
    } = this.props;

    if ( ! actionIsAllowed(permissions, {
        module: 'users',
        action: 'manage-all-suspensions',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      loaded,
      userDetails,
      nofRecordsPerPage,
      isFetching,
    } = this.state;

    if ( ! loaded) {
      return (
        <Loader />
      );
    }

    if ( ! userDetails) {
      return (
        <PageNotFound />
      );
    }

    return (
      <List
        isFetching={isFetching}
        userDetails={userDetails}
        suspensionsList={this.getActiveRecords()}
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
        canManageSuspensions={
          authedUserId !== userId
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
