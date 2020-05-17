import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';
import {I18n} from 'react-redux-i18n';
import {
  CreateContainerWithoutDecorators,
} from '../CreateSuspension';

import {
  fetchAuthorizedApiRequest,
} from '../../../../fetch';

import {
  UnprocessableEntity,
  InternalServerError,
} from "../../../../exceptions/http";

class EditContainer extends CreateContainerWithoutDecorators {
  fetchInitialData() {
    const {
      dispatch,
      accessToken,
      match: {
        params: {
          intervalId,
        },
      },
    } = this.props;

    this.fetchInitialDataFetcher = Promise.all(
      this.getInitialDataFetchers()
    );

    this.fetchInitialDataFetcher
      .then(([userDetails, {list: suspensionReasons}]) => (
        dispatch(
          fetchAuthorizedApiRequest(`/v1/users/suspensions/${intervalId}`, {
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
        })
        .then(suspension => [
          userDetails,
          suspensionReasons,
          suspension,
        ])
      ))
      .then(([userDetails, suspensionReasons, suspension]) => {
        const {
          since,
          until,
          reason,
          details: __details,
        } = suspension;

        this.setState({
          userDetails,
          suspensionReasons,
          suspension,
          __since: moment(since, 'X'),
          __until: until ? moment(until, 'X') : null,
          __reason: {
            value: reason.id,
            label: reason.name,
          },
          __details,
          loaded: true,
        });
      }, () => {
        this.setState({
          loaded: true,
        });
      });
  }

  getFormData() {
    let formData = super.getFormData();

    formData.append('_method', 'PUT');

    return formData;
  }

  suspendTheUser() {
    const {
      dispatch,
      accessToken,
      history,
      match: {
        params: {
          userId,
          intervalId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/users/suspensions/${intervalId}`, {
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
            case 200:

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
    return I18n.t('administration.form.edit');
  }

  getWidgetTitle() {
    return I18n.t('administration.form.editSuspendInterval');
  }

  getSubmitButtonLabel() {
    return I18n.t('administration.form.saveChanges');
  }

  getSubmitButtonLoadingLabel() {
    return I18n.t('administration.form.savingChanges');
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    permissions: state.user.permissions,
    authedUser: state.user,
  };
}

export default withRouter(connect(mapStateToProps)(EditContainer));
