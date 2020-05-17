import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Grid, Alert } from 'react-bootstrap';
import WarningPopover from "../../../components/WarningPopover";
// import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.scss';

import config from '../../../config';
import Widget from '../../../components/Widget';
import Footer from '../../../components/_layout/Footer';
import ErrorsList from '../../../components/ErrorsList';
import {FaGooglePlus} from "react-icons/lib/fa/index";
import Confirmation from "../../../components/AcceptCookies/ConfirmPopup";

const Login = ({
   isFetching,
   onSubmit,
   errors,
   onCreateAccountClick,
   __email,
   __password,
   onEmailChange,
   onPasswordChange,
   requestLoginWithFacebook,
   requestLoginWithGoogle,
   resetPassword,
   policyAccept
}) => (
  <div className={s.root}>
    <Grid className={s.grid}>
      <Widget className={s.widget} xs={10} sm={6} lg={4}>
        <h4 className="mt-0">
          {I18n.t('auth.logIn.siteDescription')}
        </h4>
        <p className="fs-sm text-muted">
          {I18n.t('auth.logIn.instructions')}
        </p>
        <div className={s.socialLoginBlock}>


         {/*<FacebookLogin*/}
            {/*appId={config.facebookLoginAppId}*/}
            {/*autoLoad={false}*/}
            {/*scope="public_profile, email"*/}
            {/*fields="first_name, last_name, email, gender, birthday"*/}
            {/*callback={requestLoginWithFacebook}*/}
            {/*textButton=""*/}
            {/*cssClass="btn fbButton"*/}
         {/*><FacebookLogin/>*/}

          {
            policyAccept === 'true' &&(
              <GoogleLogin
                clientId={config.googleLoginClientId}
                scope="profile email"
                buttonText={<FaGooglePlus  size={22} />}
                className="btn googleButton"
                onSuccess={requestLoginWithGoogle}
              />
            )
          }

        </div>
        <form className="mt" onSubmit={onSubmit}>
          {
            errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={ errors } />
              </Alert>
            )
          }

          <div className="form-group">
            <input
              className="form-control no-border"
              name="email"
              type="email"
              value={__email}
              onChange={onEmailChange}
              required
              placeholder={I18n.t('auth.general.email')}
            />
          </div>

          <div className="form-group">
            <input
              className="form-control no-border"
              type="password"
              value={__password}
              onChange={onPasswordChange}
              required
              placeholder={I18n.t('auth.general.password')}
            />
          </div>

          <div className="clearfix">
            <div className={s.btnToolbar}>
              {
                (policyAccept === 'true' && (
                  <button
                    type="button"
                    onClick={onCreateAccountClick}
                    className={`btn btn-default btn-sm`}
                  >
                    {I18n.t('auth.general.createAccount')}
                  </button>
                )) || (
                  <WarningPopover fullName={'Please read and confirm our Privacy Policy.'}>
                    <span
                      className={`btn btn-default btn-sm`}
                    >
                      {I18n.t('auth.general.createAccount')}
                    </span>
                  </WarningPopover>
                )
              }

              {
                (policyAccept === 'true'  &&(
                  <button
                    type="submit"
                    className={`btn btn-success btn-sm`}
                    disabled={isFetching}
                  >
                    {
                      isFetching
                        ? I18n.t('auth.general.loading')
                        : I18n.t('auth.general.logIn')
                    }
                  </button>
                )) || (
                  <WarningPopover fullName={'Please read and confirm our Privacy Policy.'}>
                    <span
                      className={`btn btn-success btn-sm`}
                    >
                      {I18n.t('auth.general.logIn')}
                    </span>
                  </WarningPopover>
                )
              }
            </div>
          </div>
        </form>
      </Widget>
    </Grid>
    {
      policyAccept !== 'true' &&(
        <Confirmation />
      )
    }
    <Footer className="text-center" />
  </div>
);

export { Login as LoginWithoutDecorators };
export default withStyles(s)(Login);
