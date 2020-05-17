import classes from 'classnames';
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CheckoutForm.scss';
import {withRouter} from "react-router";
import {connect} from "react-redux";
// import {I18n} from "react-redux-i18n";
import InvoiceForm from "../StripePayment/InvoiceForm";
import {PDFDownloadLink} from "@react-pdf/renderer";
import { pdfGenerate } from './pdfGenerate';

class CheckoutForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showInvoiceForm: true,
      pdfGenerateState: null,
      token: null,
    };
  }

  render() {
    const {
      activeModule,
      type,
      onSuccessPayment,
    } = this.props;

    const {
      showInvoiceForm,
      pdfGenerateState,
    } = this.state;

    return (
      <div className={s.modalRoot}>

        {
          showInvoiceForm && (
            <InvoiceForm
              activeModule={activeModule}
              type={type}
              onSuccess={(token, activeModule) => {
                this.setState({
                  token,
                  showInvoiceForm: false,
                  pdfGenerateState: (
                    <PDFDownloadLink document={pdfGenerate(token, activeModule)} fileName="invoice_qood.pdf">
                      {({ blob, url, loading, error }) => (loading ? `Loading document...` : `Download invoice_qood.pdf`)}
                    </PDFDownloadLink>
                  )
                }, () => onSuccessPayment(activeModule))
              }}
              onCancelEdit={this.onCancelInvoice}
            />
          )
        }

        <div className={classes(s.invoiceForm, {
          [s.showDropin]: !showInvoiceForm
        })}>
          {pdfGenerateState}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    accessToken: state.auth.accessToken,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(CheckoutForm)));
