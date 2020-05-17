import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import React from 'react';
import moment from 'moment';

export function pdfGenerate(invoiceUser) {
  const saveLocale = moment(invoiceUser.createdAt.date);
  saveLocale.locale('en');
  
  const style = StyleSheet.create({
    body: {
      paddingTop: 35,
      paddingBottom: 65,
      paddingHorizontal: 35,
      // fontFamily: 'open-sans'
    },

    /* Date, Description, Amount Table */

    tableDate: {
      position: 'absolute',
      left: 0,
      fontSize: 12,
      padding: 8,
      width: 200,
      border: 1,
      borderBottom: 0,
      backgroundColor: '#ebebec',
      borderColor: '#dbdbde',

    },

    tableDateData: {
      fontSize: 12,
      position: 'absolute',
      left: 0,
      top: 30,
      width: 200,
      padding: 8,
      border: 1,
      borderTop: 0,
      borderColor: '#dbdbde'
    },

    tableDescription: {
      fontSize: 12,
      position: 'absolute',
      left: 200,
      width: 250,
      padding: 8,
      border: 1,
      borderBottom: 0,
      backgroundColor: '#ebebec',
      borderColor: '#dbdbde'
    },

    tableDescriptionData: {
      fontSize: 12,
      position: 'absolute',
      left: 200,
      top: 30,
      padding: 8,
      width: 250,
      border: 1,
      borderTop: 0,
      borderColor: '#dbdbde'
    },

    tableAmount: {
      fontSize: 12,
      position: 'absolute',
      left: 450,
      right: 0,
      padding: 8,
      border: 1,
      borderBottom: 0,
      textAlign: 'right',
      backgroundColor: '#ebebec',
      borderColor: '#dbdbde'
    },

    tableAmountData: {
      fontSize: 12,
      textAlign: 'right',
      position: 'absolute',
      left: 450,
      top: 30,
      right: 0,
      padding: 8,
      border: 1,
      borderTop: 0,
      borderColor: '#dbdbde'
    },

    total: {
      fontSize: 14,
      fontWeight: 700,
      position: 'absolute',
      top: 80,
      right: 100,
    },

    totalData: {
      fontSize: 12,
      position: 'absolute',
      top: 80,
      right: 8,
    },

    /* Notes, Payments, Currency */

    bottomContainer: {
      position: 'absolute',
      bottom: 250,
      left: 35
    },

    notes: {
      color: '#dbdbde',
      height: 40,
      fontSize: 14
    },

    payments: {
      color: '#dbdbde',
      fontSize: 14
    },

    paymentsDataDate: {
      fontSize: 14,
      height: 35,
      paddingTop: 7
      // backgroundColor: '#ebebec',
      // width: 'max-content'
    },

    paymentsDataCard: {
      position: 'absolute',
      top: 63,
      left: 120,
      fontSize: 14,
      // backgroundColor: '#ebebec'
    },

    currencyBottom: {
      color: '#dbdbde',
      fontSize: 14
    },

    currencyBottomData: {
      fontSize: 14,
      paddingTop: 7
    },

    /* qood Logo */

    logoContainer: {
      position: 'absolute',
      bottom: -50,
      right: 0
    },

    qood: {
      fontSize: 150,
      color: '#f5f9ef',
    },

    //

    money: {
      width: 190,
      fontSize: 30,
      color: '#404041',
    },

    currency: {
      color: '#dbdbde',
      fontSize: 14,
      position: 'absolute',
      top: 48,
      right: 25,
    },

    rightMoney: {
      position: 'absolute',
      top: 26,
      width: 248,
      right: 0,
      textAlign: 'right',
      paddingTop: 10,
      border: 1,
      // borderColor: '#dbdbde',
      borderColor: '#dbdbde',
    },

    rightSecound: {
      position: 'absolute',
      right: 180,
    },


    rightDatePaid: {
      position: 'absolute',
      right: 0,
      width: 183,
      paddingTop: 8,
      paddingBottom: 3,
      paddingLeft: 10,
      fontSize: 12,
      fontWeight: 700,
      border: 1,
      borderColor: '#dbdbde',
      backgroundColor: '#ebebec',
    },

    datePaid: {
      color: 'black',
    },

    paid: {
      backgroundColor: '#94ba52',
      color: 'white',
      width: 68,
      textAlign: 'center',
      paddingTop: 8,
      paddingBottom: 2,
      fontSize: 12,
      fontWeight: 700,

      border: 1,
      borderColor: '#dbdbde',
    },

    name: {
      marginBottom: 5,
    },

    top: {
      marginBottom: 30,
    },

    invoice:  {
      fontSize: 14,
      marginBottom: 5,
      color: 'black',
      fontWeight: 'bold',
    },

    rightParagraphD: {
      fontSize: 12,
      marginBottom: 5,
      color: 'black',
    },

    rightHeaderDescritions: {
      position: 'absolute',
      right: 100,
      top: 20,
    },

    rightHeader: {
      position: 'absolute',
      right: 200,
    },

    rightDetails: {
      color: 'black',
    },

    rightParagraph: {
      fontSize: 12,
      marginBottom: 5,
      textAlign: 'left',
      color: 'grey',
    },

    header: {
      fontSize: 12,
      marginBottom: 5,
      textAlign: 'left',
      color: 'black',
    }
  });

  return (
    <Document>
      <Page size="A4" style={style.body}>
        <View style={style.top}>
          <View>
            <Text style={style.header}>QOOD LIMITED</Text>
            <Text style={style.header}>14a Mary Rose Mall</Text>
            <Text style={style.header}>United Kingdom</Text>
            <Text style={style.header}>Email: billingsupport@qood.life</Text>
          </View>

          <View style={style.rightHeader}>
            <Text style={style.invoice}>Invoice</Text>
            <Text style={style.rightParagraph}>Invoice #</Text>
            <Text style={style.rightParagraph}>Billed On</Text>
            <Text style={style.rightParagraph}>terms</Text>
          </View>

          <View style={style.rightHeaderDescritions}>
            <Text style={style.rightParagraphD}>4811</Text>
            <Text style={style.rightParagraphD}>
              {saveLocale.format('MMM DD, YYYY')}
            </Text>
            <Text style={style.rightParagraphD}>On-Receipt</Text>
          </View>
        </View>

        <View style={style.top}>
          <View>
            <Text style={style.rightParagraph}>Bill to</Text>
            <Text style={style.name}>
              {invoiceUser.firstName} {invoiceUser.lastName}
            </Text>
            <Text style={style.header}>{invoiceUser.company}</Text>
            <Text style={style.header}>
              {invoiceUser.address.streetAddress}
            </Text>
            <Text style={style.header}>
              {invoiceUser.address.countryName},{' '}
              {invoiceUser.address.postalCode}
            </Text>
            <Text style={style.header} />
          </View>

          <View style={style.rightSecound}>
            <Text style={style.paid}>PAID</Text>
          </View>
          <View style={style.rightDatePaid}>
            <Text style={style.datePaid}>
              {saveLocale.format('MMM DD, YYYY')}
            </Text>
          </View>

          <View style={style.rightMoney}>
            <Text style={style.money}>
              {invoiceUser.transactions[0].amount}
            </Text>
          </View>

          <Text style={style.currency}>GBP</Text>
        </View>

        <View style={style.tableContainer}>
          <View style={style.tableDate}>
            <Text>Date</Text>
          </View>
          <View style={style.tableDateData}>
            <Text>
             {saveLocale.format('MMM DD, YYYY')} - July
              27, 2019
            </Text>
          </View>

          <View style={style.tableDescription}>
            <Text>Description</Text>
          </View>
          <View style={style.tableDescriptionData}>
            <Text>Gold Annual</Text>
          </View>

          <View style={style.tableAmount}>
            <Text>Amount</Text>
          </View>
          <View style={style.tableAmountData}>
            <Text>{invoiceUser.transactions[0].amount}</Text>
          </View>
        </View>

        <View>
          <View style={style.totalContainer}>
            <Text style={style.total}>Total</Text>
            <Text style={style.totalData}>
              {invoiceUser.transactions[0].amount}
            </Text>
          </View>
        </View>

        <View style={style.bottomContainer}>
          <Text style={style.notes}>NOTES</Text>
          <Text style={style.payments}>Payments</Text>
          <Text style={style.paymentsDataDate}>
            {saveLocale.format('MMM DD, YYYY')}
          </Text>
          <Text style={style.paymentsDataCard}>
            {invoiceUser.transactions[0].amount} Payment from{' '}
            {invoiceUser.transactions[0].creditCardDetails.cardType} ***{' '}
            {invoiceUser.transactions[0].creditCardDetails.last4}
          </Text>
          <Text style={style.currencyBottom}>GBP</Text>
          <Text style={style.currencyBottomData}>
            All amounts in British Pounds (GBP)
          </Text>
        </View>

        <View style={style.logoContainer}>
          <Text style={style.qood}>qood</Text>
        </View>
      </Page>
    </Document>
  );
}
