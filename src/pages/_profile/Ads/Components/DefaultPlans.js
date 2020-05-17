import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { I18n } from 'react-redux-i18n';
import s from '../Ads.scss';
import React, { Component } from 'react';
import {fetchAuthorizedApiRequest} from "../../../../fetch";
import {SilencedError} from "../../../../exceptions/errors";
import {connect} from "react-redux";
import Loader from "../../../../components/Loader/Loader";
import CheckoutForm from '../../../../components/StripePayment';
import {Elements, StripeProvider} from 'react-stripe-elements';
import Popup from "../../../../components/_popup/Popup";
import config from '../../../../config';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class View extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      data: null,
      showPaymentModal: false,
      activeModule: null,
    };
  };

  componentDidMount() {
    const {
      dispatch,
      accessToken
    } = this.props;

    this.fetchAds = dispatch(
      fetchAuthorizedApiRequest(`/v1/tariffplans`, {
        ...(accessToken ? {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        } : {})
      })
    );

    this.fetchAds
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
      .then(data => {
        this.setState({
          data: data.list,
        });
        return Promise.resolve();
      });
  }

  componentWillUnmount() {
    if (this.fetchAds instanceof Promise) {
      this.fetchAds.cancel();
    }
  }

  render() {
    const {
      data,
      activeModule,
      showPaymentModal
    } = this.state;

    const {
      dispatch,
      accessToken,
      options,
      isAdmin,
      activatedProps
    } = this.props;

    if ( ! options &&  ! data && ! activatedProps) {
      return (
        <Loader />
      )
    }

    return (
      <div className={s.plansList}>
        <div className={classes(s.columns, s.plansDescription)}>
          <ul className={s.price} style={{padding: 0}}>
            <li className={s.header} />
            {
              options && options.map((options, i) =>
                <li key={i} className={options.code === 'home-banner' ? s.position : null}>
                  {options.name}
                  {
                    options.code === 'home-banner' &&(
                      <OverlayTrigger placement="right" overlay={
                        <Tooltip id="tooltip">
                          <strong>{I18n.t('profile.ads.question')}</strong>
                        </Tooltip>
                      }>
                        <i className='glyphicon glyphicon-question-sign' />
                      </OverlayTrigger>

                    )
                  }
                  </li>
              )
            }
          </ul>
        </div>
        {
          data && data.map((data, i) => {
            const willBe = moment().unix() + data.period;
            return (
              <div key={i} className={s.columns}>
                <ul className={s.price}>
                  <li className={classes(s.header, `${data.name}-package`)}>{data.name}</li>
                  {
                    options.map((option, j) => {
                      return (
                        <li key={j}
                            className={activatedProps ? activatedProps.find(n => n.id === data.id) ? s.activated : null : null}>
                          <i className={data.options.find(o => o.id === option.id)
                            ? 'icon-check'
                            : classes(s.minus,"icon-plus")}
                          />
                        </li>
                      )
                    })
                  }

                  <li className={s.grey}>
                    {
                      (activatedProps && activatedProps.find(n => n.id === data.id) && (

                        activatedProps[0].id === data.id ?
                          moment.unix(willBe).format("MM/DD/YYYY") : null
                        )
                      ) || (
                        data.price + I18n.t('profile.ads.amount')
                      )
                    }
                    </li>
                  <li className={s.grey}>
                    {
                      (
                        activatedProps && activatedProps.find(n => n.id === data.id) &&(
                        <button className={classes(s.optionGet, s.cursor)}>
                          {I18n.t('profile.ads.activated')}
                        </button>
                      )) || (activatedProps && !activatedProps.length && (
                        <button className={s.optionGet}
                          onClick={() => {
                            if(isAdmin) {
                              dispatch(
                                fetchAuthorizedApiRequest(`/v1/tariffplans/${data.id}`, {
                                  ...(accessToken ? {
                                    method: 'POST',
                                    headers: {
                                      'Authorization': `Bearer ${accessToken}`,
                                    },
                                  } : {})
                                })
                              )
                              .then(response => {
                                switch (response.status) {
                                  case 204:
                                    this.props.activatedProps.push(data);
                                    this.forceUpdate();
                                      return;

                                  default:

                                    return Promise.reject(
                                      new SilencedError('Failed to fetch activate tariffplans.')
                                    );
                                }
                              })
                            } else {
                              this.setState({
                                showPaymentModal: true,
                                activeModule: data,
                              });
                            }
                        }}
                          >
                          {I18n.t('profile.ads.get')}
                        </button>
                      ))
                    }
                  </li>
                </ul>
              </div>
            )
          })
        }

        {
          showPaymentModal && (
            <Popup onClose ={() => {
              this.setState({showPaymentModal: false})
            }}>
              <StripeProvider apiKey={config.stripeApiKey}>
                <div className={s.payment}>
                  <Elements>
                    <CheckoutForm
                      type='tariffPlan'
                      activeModule={[activeModule]}
                      onSuccessPayment={this.props.addPlanToActivated}
                    />
                  </Elements>
                </div>
              </StripeProvider>
            </Popup>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAdmin: !!state.user.roles.find(r => r.code === 'admin'),
    accessToken: state.auth.accessToken,
  };
}

export default connect(mapStateToProps)(withStyles(s)(View));
