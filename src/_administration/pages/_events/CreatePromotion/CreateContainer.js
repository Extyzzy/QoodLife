import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

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
      eventDetails: null,
      isFetching: false,
      __since: null,
      __until: null,
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
      match: {
        params: {
          eventId,
        },
      },
    } = this.props;

    return [
      fetchApiRequest(`/v1/events/${eventId}`)
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
      .then(([eventDetails]) => {
        this.setState({
          eventDetails,
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
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        since: __since instanceof moment ? __since.utcOffset(0).unix() : null,
        until: __until instanceof moment ? __until.utcOffset(0).unix() : null,
      },
      'promotion'
    );
  }

  promoteEvent() {
    const {
      dispatch,
      accessToken,
      history,
      match: {
        params: {
          eventId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/events/${eventId}/promotions`, {
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
          history.push(`/administration/events/${eventId}/promotions`);
        }, () => {
          this.setState({
            isFetching: false,
          });
        });
    });
  }

  getActiveBreadcrumbItem() {
    return this.I18n.t('administration.form.create');
  }

  getWidgetTitle() {
    return (
      this.I18n.t('administration.form.promote') + this.I18n.t('administration.menuDropDown.fevent')
    );
  }

  getSubmitButtonLabel() {
    return this.I18n.t('administration.form.promote');
  }

  getSubmitButtonLoadingLabel() {
    return this.I18n.t('administration.form.promoting');
  }

  render() {
    const {
      permissions,
    } = this.props;

    this.I18n = require('react-redux-i18n').I18n;

    if ( ! actionIsAllowed(permissions, {
        module: 'events',
        action: 'manage-all-promotions',
    })) {
      return (
        <Forbidden />
      );
    }

    const {
      loaded,
      eventDetails,
      isFetching,
      __since,
      __until,
      errors,
    } = this.state;

    if ( ! loaded) {
      return (
        <Loader />
      );
    }

    if ( !eventDetails) {
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
        eventDetails={eventDetails}
        onSinceChange={since => {
          this.setState({
            __since: since instanceof moment
              ? since
              : null,
            __until: __until instanceof moment
              ? (since instanceof moment ? (
                __until.isAfter(since)
                  ? __until : null
                ) : __until)
              : null
          });
        }}
        onUntilChange={until => {
          this.setState({
            __until: until instanceof moment
              ? until
              : null,
          });
        }}
        untilIsValidDate={current => {
          if (__since instanceof moment) {
            return current.isAfter(__since) ||
              current.isSame(__since);
          }

          return true;
        }}
        __since={__since}
        __until={__until}
        isFetching={isFetching}
        errors={errors}
        onSubmit={e => {
          e.preventDefault();

          const { isFetching } = this.state;

          if (isFetching) {
            return false;
          }
          this.promoteEvent();
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
