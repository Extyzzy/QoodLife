import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {toString} from 'lodash';
import {I18n} from 'react-redux-i18n';
import Forbidden from '../../../../pages/_errors/Forbidden';
import PageNotFound from '../../../../pages/_errors/PageNotFound';
import Loader from '../../../../components/Loader';
import Create from './Create';

import  {
  actionIsAllowed,
} from '../../../../helpers/permissions';

import {
  fetchApiRequest,
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  UnprocessableEntity,
  InternalServerError,
} from "../../../../exceptions/http";

import {
  appendToFormData,
} from '../../../../helpers/form';

class CreateContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loaded: false,
      userDetails: null,
      suspensionReasons: null,
      isFetching: false,
      __since: null,
      __until: null,
      __reason: null,
      __details: null,
      errors: null,
    };
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  componentWillUnmount() {
    if (this.fetchInitialDataFetcher instanceof Promise) {
      this.fetchInitialDataFetcher.cancel();
    }

    if (this.submitFormDataFetcher instanceof Promise) {
      this.submitFormDataFetcher.cancel();
    }
  }

  getInitialDataFetchers() {
    const {
      accessToken,
      dispatch,
      match: {
        params: {
          userId,
        },
      },
    } = this.props;

    return [
      fetchApiRequest(`/v1/users/${userId}`)
        .then(response => {
          switch(response.status) {
            case 200:

              return response.json();

            default:

              return Promise.reject(
                new InternalServerError()
              );

          }
        }),
      dispatch(
        fetchAuthorizedApiRequest(`/v1/users/suspensions/reasons`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
      )
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new InternalServerError()
            );

        }
      }),
    ];
  }

  fetchInitialData() {
    this.fetchInitialDataFetcher = Promise.all(
      this.getInitialDataFetchers()
    );

    this.fetchInitialDataFetcher
      .then(([userDetails, {list: suspensionReasons}]) => {
        this.setState({
          userDetails,
          suspensionReasons,
          loaded: true,
        });
      }, () => {
        this.setState({
          loaded: true,
        });
      });
  }

  getFormData() {
    const {
      __since,
      __until,
      __reason,
      __details: details,
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        since: __since instanceof moment ? __since.utcOffset(0).unix() : null,
        until: __until instanceof moment ? __until.utcOffset(0).unix() : null,
        reason: __reason ? __reason.value : null,
        details,
      },
      'suspension'
    );
  }

  suspendTheUser() {
    const {
      dispatch,
      accessToken,
      history,
      match: {
        params: {
          userId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/users/${userId}/suspensions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: this.getFormData(),
        })
      );

      this.submitFormDataFetcher
        .then(response => {
          switch(response.status) {
            case 201:

              this.setState({errors: null});

              return Promise.resolve();

            case 422:

              return response.json().then(({errors}) => {
                this.setState({errors});

                return Promise.reject(
                  new UnprocessableEntity()
                );
              });

            default:

              return Promise.reject(
                new InternalServerError()
              );

          }
        })
        .then(() => {
          history.push(`/administration/users/${userId}/suspensions`);
        }, () => {
          this.setState({
            isFetching: false,
          });
        });
    });
  }

  getActiveBreadcrumbItem() {
    return I18n.t('administration.form.create');
  }

  getWidgetTitle() {
    return I18n.t('administration.form.suspendTheUser');
  }

  getSubmitButtonLabel() {
    return I18n.t('administration.suspend');
  }

  getSubmitButtonLoadingLabel() {
    return I18n.t('administration.form.suspending');
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
    }) || authedUserId === userId) {
      return (
        <Forbidden />
      );
    }

    const {
      loaded,
      userDetails,
      suspensionReasons,
      isFetching,
      __since,
      __until,
      __reason,
      __details,
      errors,
    } = this.state;

    if ( ! loaded) {
      return (
        <Loader />
      );
    }

    if ( ! userDetails || ! suspensionReasons) {
      return (
        <PageNotFound />
      );
    }

    return (
      <Create
        activeBreadcrumbItem={
          this.getActiveBreadcrumbItem()
        }
        widgetTitle={
          this.getWidgetTitle()
        }
        submitButtonLabel={
          this.getSubmitButtonLabel()
        }
        submitButtonLoadingLabel={
          this.getSubmitButtonLoadingLabel()
        }
        userDetails={userDetails}
        reasonOptions={
          suspensionReasons.map(({id, name}) => ({
            value: id,
            label: name,
          }))
        }
        onSinceChange={since => {
          this.setState({
            __since: since instanceof moment
              ? since : null,
            __until: __until instanceof moment ?
              (since instanceof moment ? (
                __until.isAfter(since)
                  ? __until : null
              ) : __until) : null
          });
        }}
        onUntilChange={until => {
          this.setState({
            __until: until instanceof moment
              ? until : null,
          });
        }}
        untilIsValidDate={current => {
          if (__since instanceof moment) {
            return current.isAfter(__since) ||
              current.isSame(__since);
          }

          return true;
        }}
        onReasonChange={__reason => {
          this.setState({ __reason });
        }}
        onDetailsChange={({target: {value: __details}}) => {
          this.setState({ __details });
        }}
        __since={__since}
        __until={__until}
        __reason={__reason}
        __details={toString(__details)}
        isFetching={isFetching}
        errors={errors}
        onSubmit={e => {
          e.preventDefault();

          const { isFetching } = this.state;

          if (isFetching) {
            return false;
          }

          this.suspendTheUser();
        }}
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

export {CreateContainer as CreateContainerWithoutDecorators};
export default withRouter(connect(mapStateToProps)(CreateContainer));
