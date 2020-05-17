import React  from 'react';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Popup from "../../../../components/_popup/Popup";
import { I18n } from 'react-redux-i18n';
import s from '../Ads.scss';
import moment from 'moment';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import {Elements, StripeProvider} from "react-stripe-elements";
import CheckoutForm from "../../../../components/StripePayment";
import config from '../../../../config';

const View = ({
  onEncrementIndividualPlan,
  onDecrementIndividualPlan,
  individualPlanPrice,
  selectedFeatures,
  onSuccesPayment,
  options,
  activate,
  optionsActivated,
  showPaymentModal,
  closePayment,
  multipleOptions
}) => (
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
    <form className={classes(s.columns, s.individualForm)}>
      <ul className={s.price}>
        <li className={s.header}>{I18n.t('profile.ads.individualPlan')}</li>
        {
          options.map((l, i) => {
            const isSelected = selectedFeatures.findIndex(f => f.id === l.id);
            const willBe = moment().unix() + l.period;

            let amount = optionsActivated && optionsActivated.find(data => data.id === l.id) ? I18n.t('profile.ads.until') +
                moment.unix(optionsActivated.find(b => b.id === l.id).pivotTableDetails.until).format("MM/DD/YYYY")
              : l.price + ' ' +  I18n.t('profile.ads.amount');

            if (multipleOptions.length && multipleOptions.find(id => id === l.id)) {
              return (
                <li key={i} className={s.afterRequest}>
                  {I18n.t('profile.ads.until') + moment.unix(willBe).format("MM/DD/YYYY")}
                </li>
              )
            }

            return (
                <li
                  key={i}
                  style={{cursor: 'pointer'}}
                  className={classes({
                    [s.selected]: optionsActivated.find(data => data.id === l.id),
                    [s.red]: isSelected !== -1
                  })}
                  onClick={() => {
                    if (isSelected === -1){
                      onEncrementIndividualPlan(l)
                    } else {
                      onDecrementIndividualPlan(l)
                    }
                  }}
                >
                  {amount}
                </li>
              )
          })
        }

        {
          optionsActivated && optionsActivated.length !== options.length && (
            <li className={s.grey}>
              {`Total: ${individualPlanPrice} ` + I18n.t('profile.ads.amount')}
            </li>
          )
        }

        {
          (!!selectedFeatures.length && (
            <li className={s.grey}>
              <div style={{paddingTop: 5}} className={s.optionGet} onClick={activate}>
                {I18n.t('profile.ads.get')}
              </div>
            </li>
          )) || (
            <li className={s.grey} />
          )
        }
      </ul>
    </form>

    {
      showPaymentModal && (
        <Popup onClose={closePayment}>
          <StripeProvider
            apiKey={config.stripeApiKey}>
            <div className={s.payment}>
              <Elements>
                <CheckoutForm
                  type='options'
                  activeModule={selectedFeatures}
                  onSuccessPayment={onSuccesPayment}
                />
              </Elements>
            </div>
          </StripeProvider>
        </Popup>
      )
    }
  </div>
);

export default withStyles(s)(View);
