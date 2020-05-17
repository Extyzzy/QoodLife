import React, { Component } from 'react';
import { connect } from "react-redux";
import { appendToFormData } from '../../helpers/form';
import { fetchAuthorizedApiRequest } from '../../fetch';
import { InternalServerError } from '../../exceptions/http';
import createClient from 'braintree-web-drop-in';
import classes from 'classnames';
import InvoiceForm from './InvoiceForm';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './DropIn.scss';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { pdfGenerate } from './pdfGenerate';
import {SilencedError} from "../../exceptions/errors";
import Loader from "../Loader";
import { I18n } from 'react-redux-i18n';

class BrainTreeDropIn extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      successPay: false,
      loadingFormCard: false,
      showInvoiceForm: true,
      pdfGenerateState: null,
    };
  };

  getFormCard() {
    const {
      accessToken,
      dispatch
    } = this.props;

    this.setState({loadingFormCard: true}, () => {
      dispatch(
        fetchAuthorizedApiRequest('/v1/payments', {
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
                new SilencedError('Failed to fetch payment token.')
              );
          }
        })
        .then(paymentToken => {
          createClient.create({
            authorization: `${paymentToken.clientToken}`,
            container: '#dropin-container'
          }, (createErr, instance) => {
            document.querySelector('#submit-button')
              .addEventListener('click', () => {
                instance.requestPaymentMethod((err, payload) => {
                  if(payload instanceof Object) {
                    this.paymentRequest(payload)
                  } else {
                    console.info(err)
                  }
                });
              });
          });
          return Promise.resolve();
        })
        .then(() => this.setState({loadingFormCard: false}));
    })
  }

  paymentRequest(payload) {
    const {
      dispatch,
      accessToken,
      orderType,
      activeModule,
      onSuccesPayment,
    } = this.props;

    const orderDetails = {
      type: orderType,
      itemIds: activeModule.map(i => i.id)
    };

    this.submitPaymentFetcher = dispatch(
      fetchAuthorizedApiRequest('/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: appendToFormData(
          new FormData(),
          {
            nonce: payload.nonce,
            details: payload.details,
            type: payload.type,
            description: payload.description,
            binData: payload.binData,
            orderDetails,
          },
          'payload',
        ),
      })
    );

    this.submitPaymentFetcher
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
        this.setState({
          successPay: true,
        }, () =>
          onSuccesPayment(activeModule),
          this.dataCustomer()
        )
      })
      .then(() => {
        return Promise.resolve();
      })
  }

  dataCustomer() {
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
            pdfGenerateState: (
              <PDFDownloadLink document={pdfGenerate(customer.data)} fileName="invoice_qood.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : `Download invoice!`)}
              </PDFDownloadLink>
            )
          })
        }
        return Promise.resolve();
      })
  }

  render() {
    const {
      showInvoiceForm,
      successPay,
      pdfGenerateState,
      loadingFormCard
    } = this.state;

    if (loadingFormCard) {
      return (
        <Loader contrast />
      );
    }

    return (
      <div className={s.modalRoot}>
        {
          showInvoiceForm && (
            <InvoiceForm
              onSuccess={() =>
                this.setState({showInvoiceForm: false}, () => {
                  this.getFormCard();
                })
              }
              onCancelEdit={this.onCancelInvoice}
            />
          )
        }

        <div className={classes(s.invoiceForm, {[s.showDropin]: !showInvoiceForm})}>
          <p> {I18n.t('profile.ads.forPay')}{`${this.props.activeModule.reduce((a,b) => a + b.price, 0)} EURO`}</p>
          <div id="dropin-container" />
          {
              !successPay && (
                <button
                  id="submit-button"
                  className="btn btn-success btn-sm"
              >
                  Achita
                </button>
            )
          }
          {pdfGenerateState}
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    paymentToken: store.auth.paymentToken,
    accessToken: store.auth.accessToken,
  };
}

export default connect(mapStateToProps)(withStyles(s)(BrainTreeDropIn));
