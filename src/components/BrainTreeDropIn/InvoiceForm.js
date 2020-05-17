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
import s from './DropIn.scss';
import Loader from "../Loader";

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
      errors: null
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
      .then(customer => {
        if (customer.data) {
          this.setState({
            __firstName: customer.data.firstName,
            __lastName: customer.data.lastName,
            __company: customer.data.company,
            __zipCode: customer.data.address.postalCode,
            __location: {
              label: customer.data.address.streetAddress,
              country_init: customer.data.address.countryCodeAlpha2,
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

  onSubmit(e) {
    e.preventDefault();

    const {
      dispatch,
      accessToken,
      onSuccess,
    } = this.props;


    const {
      __firstName,
      __lastName,
      __company,
      __zipCode,
      __location,
    } = this.state;

    this.setState({sendingInvoice: true}, () => {
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
              },
            }
          ),
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
        .then(() => {
          this.setState({sendingInvoice: false}, () => onSuccess());


          return Promise.resolve();
        })
    });
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
          />
        </div>

        {
          errors && (
            <Alert className="alert-sm" bsStyle="danger">
              <ErrorsList messages={errors} />
            </Alert>
          )
        }
        <div className={s.formFooter}>
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

export default connect(mapStateToProps)(withStyles(s)(InvoiceForm));
