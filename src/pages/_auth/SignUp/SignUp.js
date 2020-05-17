import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Grid, Alert } from 'react-bootstrap';
import { FaGooglePlus } from "react-icons/lib/fa/index";
// import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SignUp.scss';
import config from '../../../config';
import ErrorsList from '../../../components/ErrorsList';
import Widget from '../../../components/Widget';
import Footer from '../../../components/_layout/Footer';
import classes from "classnames";

const SignUp = ({
  isFetching,
  onSubmit,
  logUsingSocial,
  requestLoginWithFacebook,
  requestLoginWithGoogle,
  __provider,
  __firstName,
  __lastName,
  __email,
  __password,
  __passwordConfirmation,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmationChange,
  onCancelSignup,
  errors,
}) => (
  <div className={s.root}>
    <Grid className={s.grid}>
      <Widget className={s.widget} xs={10} sm={6} lg={4}>
        <h4 className="mt-0">
          {I18n.t('auth.signUp.title')}
        </h4>
        <p className="fs-sm text-muted">
          {I18n.t('auth.signUp.description')}
        </p>
        {
          (!logUsingSocial && (
            <div className={s.socialLoginBlock}>
              {/*<FacebookLogin*/}
                {/*appId={config.facebookLoginAppId}*/}
                {/*autoLoad={false}*/}
                {/*scope="public_profile, email"*/}
                {/*fields="email, gender"*/}
                {/*callback={requestLoginWithFacebook}*/}
                {/*textButton=""*/}
                {/*cssClass="btn fbButton"*/}
              {/*/>*/}

              <GoogleLogin
                clientId={config.googleLoginClientId}
                scope="profile email"
                buttonText={<FaGooglePlus  size={22} />}
                className="btn googleButton"
                onSuccess={requestLoginWithGoogle}
              />
            </div>
          )) || (
            <div>
              {
                ((__provider === 'google') && (
                  <div className={s.signTypeInfo}>
                    <div className="btn googleButton">
                      <FaGooglePlus  size={22} />
                    </div>
                    <p>{I18n.t('auth.signUp.usingGoogleMessage')}</p>
                  </div>
                )) || (
                  <div className={s.signTypeInfo}>
                    <div className="btn fbButton"></div>
                    <p>{I18n.t('auth.signUp.usingFacebookMessage')}</p>
                  </div>
                )
              }
            </div>
          )
        }
        <form className="mt" onSubmit={onSubmit}>
          {
            errors && (
              <Alert className="alert-sm" bsStyle="danger">
                <ErrorsList messages={ errors } />
              </Alert>
            )
          }
          {
            (!logUsingSocial && (
              <div>
                <div className="form-group">
                  <input
                    className="form-control no-border"
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

                <div className="form-group">
                  <input
                    className="form-control no-border"
                    type="password"
                    value={__passwordConfirmation}
                    onChange={onPasswordConfirmationChange}
                    required
                    placeholder={I18n.t('auth.general.confirmPassword')}
                  />
                </div>
              </div>
            )) || (
              !__email && (
                <div className="form-group">
                  <input
                    className="form-control no-border"
                    type="email"
                    value={__email}
                    onChange={onEmailChange}
                    required
                    placeholder={I18n.t('auth.general.email')}
                  />
                </div>
              )
            )
          }
          <div className={classes(
            "clearfix",
            s.buttons,
          )}>
            <div className={s.btnToolbar}>
              <button
                type="button"
                onClick={onCancelSignup}
                className={`btn btn-default btn-sm`}
              >
                {I18n.t('auth.signUp.cancel')}
              </button>

              <button
                type="submit"
                className="btn btn-success btn-sm"
                disabled={isFetching}
              >
                {
                  isFetching
                    ? I18n.t('auth.signUp.creatingAccount')
                    : I18n.t('auth.general.createAccount')
                }
              </button>
            </div>
          </div>
        </form>
      </Widget>
    </Grid>
    <Footer className="text-center" />
  </div>
);

export default withStyles(s)(SignUp);
