import React, { Component } from 'react';
import moment from 'moment';
import s from '../Ads.scss';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { pdfGenerate } from '../../../../components/StripePayment/pdfGenerate';

class Container extends Component {
  render() {
    const { optionsActivated, data } = this.props;
    
    return (
      <div>
        <p>Activated Options</p>
        <hr />
        <div className={s.pdfInfoContainer}>
          {optionsActivated.map((options, key) => (
            <div key={key} className={s.optionsActivated}>
              <p className={s.optionName}>{options.name}</p>
              <p className={s.optionDates}>
                Bought:{' '}
                {moment
                  .unix(options.pivotTableDetails.since)
                  .format('DD/MM/YYYY')}
                <br />
                Expires on:{' '}
                {moment
                  .unix(options.pivotTableDetails.until)
                  .format('DD/MM/YYYY')}
              </p>
              <p>
                <PDFDownloadLink
                  document={pdfGenerate(data)}
                  fileName="invoice_qood.pdf"
                >
                  {() => `Download invoice!`}
                </PDFDownloadLink>
              </p>
            </div>
          ))}
        </div>
        <hr />
      </div>
    );
  }
}

export default Container;
