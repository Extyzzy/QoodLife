import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Grid, Alert } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ResetPasswordContainer.scss';
import Widget from '../../../components/Widget';
import Footer from '../../../components/_layout/Footer';
import ErrorsList from '../../../components/ErrorsList';

const ResetPassword = ({
   isFetching,
   onSubmit,
   errors,
   __email,
   onEmailChange,
   onCancelSignup,
   sendSuccess,
}) => (
  <div className={s.root}>
    <Grid className={s.grid}>
      <Widget className={s.widget} xs={10} sm={6} lg={4}>
        <h4 className="mt-0">
          {I18n.t('auth.logIn.siteDescription')}
        </h4>
        {
          !sendSuccess &&(
            <p className="fs-sm text-muted">
              {I18n.t('auth.resetPassword.description')}
            </p>
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
            (!sendSuccess &&(
              <div>
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

                <div className="clearfix">
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
                  className={`btn btn-success btn-sm`}
                  disabled={isFetching}
                >
              {
                isFetching
                  ? I18n.t('auth.resetPassword.sending')
                  : I18n.t('auth.resetPassword.send')
              }
              </button>
               </div>
              </div>
            </div>
            )) || (
              <p className="fs-sm text-muted">
                {I18n.t('auth.resetPassword.sendSucces')}
              </p>
            )
          }

        </form>
      </Widget>
    </Grid>
    <Footer className="text-center" />
  </div>
);

export { ResetPassword as ResetPasswordWithoutDecorators };
export default withStyles(s)(ResetPassword);
