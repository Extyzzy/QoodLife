import React, { Component } from 'react';
import { connect } from "react-redux";
import { I18n } from 'react-redux-i18n';
import { Alert } from "react-bootstrap";
import { appendToFormData } from '../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../fetch';
import { InternalServerError } from '../../exceptions/http';
import PlacesAutocomplete from '../_inputs/PlacesAutocomplete';
import ErrorsList from '../ErrorsList/ErrorsList';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CheckoutForm.scss';
import Loader from "../Loader";
import {CardElement, injectStripe} from 'react-stripe-elements';
import WarningPopover from "../WarningPopover";

class InvoiceForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoaded: true,
      sendingInvoice: false,
      __firstName: '',
      __lastName:  '',
      __company: '',
      __zipCode:  '',
      __location: null,
      __token: null,
      errors: null,
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onFirstNameChange = this.onFirstNameChange.bind(this);
    this.onLastNameChange = this.onLastNameChange.bind(this);
    this.onCompanyNameChange = this.onCompanyNameChange.bind(this);
    this.onZipCodeChange = this.onZipCodeChange.bind(this);
    this.onLocationChange = this.onLocationChange.bind(this);
  };

  componentDidMount() {
    const {
      dispatch,
      accessToken,
    } = this.props;

    this.submitInvoiceFormFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/payments/customer', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      })
    );
    this.submitInvoiceFormFetcher
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
      .then(stripe => {
        if (stripe.customer && stripe.customer.metadata) {
          const {metadata} = stripe.customer;
          this.setState({
            __firstName: metadata.firstName,
            __lastName: metadata.lastName,
            __company: metadata.company,
            __zipCode: metadata.postalCode,
            __location: {
              label: metadata.streetAddress,
              country_init: metadata.countryCodeAlpha2,
            },
          });
        }
      })
      .then(() => {
        this.setState({
          isLoaded: false,
        });
        return Promise.resolve();
      })
  }

  async onSubmit(e) {
    e.preventDefault();
    const {
      dispatch,
      accessToken,
      stripe
    } = this.props;

    const {
      __firstName,
      __lastName,
      __company,
      __zipCode,
      __location,
    } = this.state;

    let {token} = await stripe.createToken({type: 'card', name: 'Name'});

    if (token) {
      this.setState({
        __token: token,
        sendingInvoice: true
      }, () => {
        dispatch(
          fetchAuthorizedApiRequest('/v1/payments/customer', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: appendToFormData(
              new FormData(),
              {
                customer: {
                  firstName: __firstName,
                  lastName: __lastName,
                  company: __company,
                  streetAddress: __location.label,
                  countryCodeAlpha2: __location.country_init,
                  postalCode: __zipCode,
                  source: token.id
                },
              }
            ),
          })
        )
          .then(response => {
            switch (response.status) {
              case 200:
                return response.json();
              default:
                return Promise.reject(
                  new InternalServerError()
                );
            }
          })
          .then(() => this.payments())
      })
    }
  }

  payments() {
    const {
      dispatch,
      accessToken,
      activeModule,
      type,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest('/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            orderDetails: {
              type,
              itemIds: activeModule.map(data => data.id)
            },
            description: 'description',
          },
          'payload',
        )
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
      .then(() =>
        this.getDataForPDF()
      )
      .then(() => {
        return Promise.resolve();
      })
  }

  getDataForPDF() {
    const {
      dispatch,
      accessToken,
      activeModule,
      onSuccess,
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest('/v1/payments/customer', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      .then(data=> {
        this.setState({sendingInvoice: false}, () => {
          onSuccess(data, activeModule)
        });
      })
      .then(() => {
        return Promise.resolve();
      })
  }

  onFirstNameChange(e) {
    this.setState({__firstName: e.target.value})
  }

  onLastNameChange(e) {
    this.setState({__lastName: e.target.value})
  }

  onCompanyNameChange(e) {
    this.setState({__company: e.target.value})
  }

  onLocationChange(__location) {
    this.setState({__location})
  }

  onZipCodeChange(e) {
    this.setState({__zipCode: e.target.value})
  }

  render() {
    const {
      __firstName,
      __lastName,
      __company,
      __location,
      __zipCode,
      errors,
      isLoaded,
      sendingInvoice,
    } = this.state;

    if (isLoaded) {
      return (
        <Loader contrast />
      );
    }

    return (
      <form className={s.modalRoot} onSubmit={this.onSubmit}>
        <div className="form-group">
          <label className="control-label">
            {I18n.t('profile.editProfile.profileDetails.firstName')} <span className={s.required}>*</span>
          </label>
          <input
            value={__firstName}
            onChange={this.onFirstNameChange}
            className="form-control"
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label">
            {I18n.t('profile.editProfile.profileDetails.lastName')} <span className={s.required}>*</span>
          </label>
          <input
            value={__lastName}
            onChange={this.onLastNameChange}
            className="form-control"
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label">
            {I18n.t('profile.editProfile.profileDetails.companyName')} <span className={s.required}>*</span>
          </label>
          <input
            value={__company}
            onChange={this.onCompanyNameChange}
            className="form-control"
            type="text"
            required
          />
        </div>

        <div className="form-group">
          <label className="control-label">
            {I18n.t('profile.editProfile.profileDetails.countryName')} <span className={s.required}>*</span>
          </label>
            <PlacesAutocomplete
              updateOnInputChange
              className="form-control"
              value={__location ? __location.label : ''}
              placeholder={I18n.t('general.components.multipleAdd.locationInput')}
              onChange={this.onLocationChange}
            />
        </div>

        <div className="form-group">
          <label className="control-label">
            {I18n.t('profile.editProfile.profileDetails.zipCode')} <span className={s.required}>*</span>
          </label>
          <input
            value={__zipCode}
            onChange={this.onZipCodeChange}
            className="form-control"
            type="text"
            required
          />
        </div>

        {
          errors && (
            <Alert className="alert-sm" bsStyle="danger">
              <ErrorsList messages={errors} />
            </Alert>
          )
        }

        <div className="form-group">
          <CardElement
            hidePostalCode
            style={{base: {fontSize: '18px'}}}
          />
        </div>

        <div className={s.formFooter}>
          {
            (
              (
                __firstName !== '' &&
                __lastName !== '' &&
                __company !== '' &&
                __zipCode !== '' &&
                __location
              ) && (
                <button
                  type="submit"
                  className='btn btn-red'
                >
                  {
                    (
                      !sendingInvoice &&(
                        I18n.t('profile.editProfile.profileDetails.save')
                      )) || (
                      I18n.t('profile.ads.loading')
                    )
                  }
                </button>
              )) || (
              <WarningPopover
                fullName={__firstName && __lastName && __company && __zipCode ?
                  I18n.t('general.components.multipleAdd.locationInput') :
                  I18n.t('general.components.multipleAdd.warning')
                  }
              >
              <span className='btn btn-red btn-sm'>
                {I18n.t('general.components.multipleAdd.addButton')}
              </span>
              </WarningPopover>
            )
          }
        </div>
      </form>
    );
  }
}

function mapStateToProps(store) {
  return {
    paymentToken: store.auth.paymentToken,
    accessToken: store.auth.accessToken,
  };
}

export default injectStripe(connect(mapStateToProps)(withStyles(s)(InvoiceForm)));
