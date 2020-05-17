import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import moment from 'moment';

import {
  CreateContainerWithoutDecorators,
} from '../CreatePromotion';

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

    this.I18n = require('react-redux-i18n').I18n;

    this.fetchInitialDataFetcher = Promise.all(
      this.getInitialDataFetchers()
    );

    this.fetchInitialDataFetcher
      .then(([productDetails]) => (
        dispatch(
          fetchAuthorizedApiRequest(`/v1/products/promotions/${intervalId}`, {
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
        .then(promotion => [
          productDetails,
          promotion,
        ])
      ))
      .then(([productDetails, promotion]) => {
        const {
          since,
          until,
        } = promotion;

        this.setState({
          productDetails,
          promotion,
          __since: moment(since, 'X'),
          __until: until ? moment(until, 'X') : null,
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

  promoteProduct() {
    const {
      dispatch,
      accessToken,
      history,
      match: {
        params: {
          productId,
          intervalId,
        },
      },
    } = this.props;

    this.setState({
      isFetching: true,
    }, () => {
      this.submitFormDataFetcher = dispatch(
        fetchAuthorizedApiRequest(`/v1/products/promotions/${intervalId}`, {
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
          history.push(`/administration/products/${productId}/promotions`);
        }, () => {
          this.setState({
            isFetching: false,
          });
        });
    });
  }

  getActiveBreadcrumbItem() {
    return this.I18n.t('administration.form.edit');
  }

  getWidgetTitle() {
    return this.I18n.t('administration.form.editPromotionInterval');
  }

  getSubmitButtonLabel() {
    return this.I18n.t('administration.form.saveChanges');
  }

  getSubmitButtonLoadingLabel() {
    return this.I18n.t('administration.form.savingChanges');
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
