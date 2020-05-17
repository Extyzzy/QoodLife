import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import DefaultPlans from './Components/DefaultPlans';
import HomeBanner from './Components/HomeBanner';
import IndividualPlan from './Components/IndividualPlan';
import update from 'immutability-helper';
import View from './View';
import {fetchAuthorizedApiRequest} from "../../../fetch";
import {SilencedError} from "../../../exceptions/errors";
import {connect} from "react-redux";
import Loader from "../../../components/Loader/Loader";
import {appendToFormData} from "../../../helpers/form";
import {InternalServerError} from "../../../exceptions/http";
import PdfDownload from './Components/PdfDownload';

class Container extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeTabItemIndex: 0,
      individualPlanPrice: 0,
      individualPlanFeatures: [],
      multipleOptions: [],
      showPaymentModal: false,
      options: null,
      optionsActivated: null,
      activated: null,
      pdfGenerateState: null,
      data: null
    };

    this.setActiveTab = this.setActiveTab.bind(this);
    this.encrementIndividualPlan = this.encrementIndividualPlan.bind(this);
    this.decrementIndividualPlan = this.decrementIndividualPlan.bind(this);
    this.addPlanToActivated = this.addPlanToActivated.bind(this);
    this.onSuccesPayment = this.onSuccesPayment.bind(this);
    this.sendOptions = this.sendOptions.bind(this);
  };

  componentDidMount() {
    const {
      dispatch,
      accessToken
    } = this.props;

    this.dataCustomer();

    this.fetchAdsOptions = dispatch(
      fetchAuthorizedApiRequest(`/v1/tariffplans/options`, {
        ...(accessToken ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );
    this.fetchAdsOptions
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch ads options.')
            );
        }
      })
      .then(options => {
        this.setState({
          options: options.list,
        });
        return Promise.resolve();
      });

    this.fetchAdsOptionsActivated = dispatch(
      fetchAuthorizedApiRequest(`/v1/account/tariffplans/options `, {
        ...(accessToken ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );
    this.fetchAdsOptionsActivated
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch ads options.')
            );
        }
      })
      .then(options => {
        this.setState({
          optionsActivated: options.list,
        });
        return Promise.resolve();
      });

    this.activetedTarifs = dispatch(
      fetchAuthorizedApiRequest(`/v1/account/tariffplans `, {
        ...(accessToken ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );
    this.activetedTarifs
      .then(response => {
        switch(response.status) {
          case 200:

            return response.json();

          default:

            return Promise.reject(
              new SilencedError('Failed to fetch tariffplans.')
            );
        }
      })
      .then(activated => {
        this.setState({
          activated: activated.list,
        });
        return Promise.resolve();
      });
  }

  componentWillUnmount() {
    if (this.fetchAdsOptions instanceof Promise) {
      this.fetchAdsOptions.cancel();
    }

    if (this.fetchAdsOptionsActivated instanceof Promise) {
      this.fetchAdsOptionsActivated.cancel();
    }

    if (this.activetedTarifs instanceof Promise) {
      this.activetedTarifs.cancel();
    }
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
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new InternalServerError()
            );
        }
      })
      .then(data => {
        !!data.charges ? (
          this.setState({
            data
          })
        ) : (
            this.setState({
              pdfGenerateState: (
                <p />
              )
            })
          )
        return Promise.resolve();
      })
  }

  addPlanToActivated(details) {
    this.setState({activated: this.state.activated.concat(details[0])})
  }

  onSuccesPayment(activeModule) {
    this.setState({
      multipleOptions: this.state.individualPlanFeatures.map(data => data.id),
    });
  }

  adsPlansTabs() {
    const {
      individualPlanPrice,
      individualPlanFeatures,
      options,
      optionsActivated,
      activated,
      multipleOptions,
      showPaymentModal,
      pdfGenerateState,
      data
    } = this.state;

    if ( ! options ) {
      return (
        <Loader />
      )
    }

    let adsTabs = [
      {
        title: I18n.t('profile.ads.standartPlans'),
        content:
          <DefaultPlans
            options={options}
            activatedProps={activated}
            pdfGenerateState={pdfGenerateState}
            addPlanToActivated={this.addPlanToActivated}
          />,
      },
      {
        title: I18n.t('profile.ads.individualPlan'),
        content:
          <IndividualPlan
            multipleOptions={multipleOptions}
            options={options}
            showPaymentModal={showPaymentModal}
            optionsActivated={optionsActivated}
            individualPlanPrice={individualPlanPrice}
            selectedFeatures={individualPlanFeatures}
            pdfGenerateState={pdfGenerateState}
            onSuccesPayment={this.onSuccesPayment}
            onEncrementIndividualPlan={this.encrementIndividualPlan}
            onDecrementIndividualPlan={this.decrementIndividualPlan}
            closePayment={() => this.setState({showPaymentModal: false})}
            activate={this.sendOptions}
          />,
      },
    ];

    if (optionsActivated && optionsActivated.find(data => data.code === 'home-banner')) {
      adsTabs.push(
        {
          title: I18n.t('profile.ads.gallery'),
          content:
            <HomeBanner />,
        },
      )
    }
    if (!!data) {
      adsTabs.push(
        {
          title: 'Info',
          content:
            <PdfDownload 
              data={data}
              optionsActivated={optionsActivated}  
            />,
        },
      )
    }

    return adsTabs;
  }

  encrementIndividualPlan(feature) {
    const {
      individualPlanPrice,
      individualPlanFeatures,
      optionsActivated
    } = this.state;

    if (optionsActivated.find(data=> data.id === feature.id )) {
      return null
    }
    this.setState({
      individualPlanPrice: individualPlanPrice + feature.price,
      individualPlanFeatures: individualPlanFeatures.concat(feature),
    })
  }

  decrementIndividualPlan(feature) {
    const { individualPlanPrice, individualPlanFeatures } = this.state;
    const featureIndex = individualPlanFeatures.findIndex(p => p.id === feature.id);

    this.setState({
      individualPlanPrice: individualPlanPrice - feature.price,
      individualPlanFeatures: update(individualPlanFeatures, {
        $splice: [[featureIndex, 1]],
      }),
    })
  }

  setActiveTab(activeTabItemIndex) {
    this.setState({activeTabItemIndex})
  }

  getFormData() {
    const {
      individualPlanFeatures
    } = this.state;

    return appendToFormData(
      new FormData(),
      {
        options: individualPlanFeatures.map(data => data.id)
      }
    );
  }

  sendOptions() {
    const {
      dispatch,
      accessToken,
      isAdmin
    } = this.props;

    const {
      individualPlanFeatures
    } = this.state;

    if(isAdmin) {
      dispatch(
        fetchAuthorizedApiRequest(`/v1/tariffplans/options/activate-multiple-options`, {
          ...(accessToken ? {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            body: this.getFormData(),
          } : {})
        })
      )
        .then(response => {
          switch (response.status) {
            case 204:
              this.setState({
                multipleOptions: individualPlanFeatures.map(data => data.id),
                individualPlanFeatures: [],
                individualPlanPrice: 0,
              });
              return;

            default:

              return Promise.reject(
                new SilencedError('Failed to fetch activate options for tariffplans.')
              );
          }
        })
    } else {
      this.setState({showPaymentModal: true})
    }
  }

  

  render() {
    const {
      activeTabItemIndex,
      options
    } = this.state;
    
    if ( ! options ) {
      return (
        <Loader />
      )
    }

    return (
      <View
        activeTabItemIndex={activeTabItemIndex}
        tabsOptions={this.adsPlansTabs()}
        setActiveTab={this.setActiveTab}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    isAdmin: !!state.user.roles.find(r => r.code === 'admin'),
    accessToken: state.auth.accessToken,
  };
}

export default withRouter(connect(mapStateToProps)(Container));
