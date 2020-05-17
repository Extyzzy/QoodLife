import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router';
import {fetchApiRequest} from "../../../fetch";
import {SilencedError} from "../../../exceptions/errors";
import {I18n} from "react-redux-i18n";
import s from '../ConfirmAccount/ConfirmAccount.scss';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import Widget from '../../../components/Widget';
import Footer from '../../../components/_layout/Footer';
import { Grid } from 'react-bootstrap';

class ResetPasswordContainer extends Component {
  componentDidMount() {
    const both = window.location.href.substring(window.location.href.lastIndexOf('/') - 8);
    const userId = both.substring(0, both.lastIndexOf('/'));
    const recorder = both.substring(both.lastIndexOf('/') + 1);

    this.resetFetcher = fetchApiRequest(`/v1/account/confirm-reset-pass?encodedUserId=${userId}&encodedRecordId=${recorder}`);
      this.resetFetcher
        .then(response => {
          switch (response.status) {
            case 202:
              return response.json();
            default:
              return Promise.reject(
                new SilencedError('Failed to send new password.')
              );
          }
        })
        .then(() => {
          return Promise.resolve();
        })
  }

  render() {
    const {
      isAuthenticated,
      history,
    } = this.props;

    if (isAuthenticated) {
      return (
        <Redirect to={'/profile/edit'} />
      );
    }

    return (
      <div className={s.root}>
        <Grid className={s.grid}>
          <Widget className={s.widget} xs={10} sm={6} lg={4}>
            <div>
                <p className="fs-sm text-muted">
                  {I18n.t('auth.resetPassword.sendPassword')}
                  <button
                    onClick={() => {
                      history.push('/login');
                    }}
                    className="btn btn-default btn-sm btn-block"
                  >
                    {I18n.t('auth.general.logIn')}
                  </button>
                </p>
            </div>
          </Widget>
        </Grid>
        <Footer className="text-center"/>
      </div>
    );
  }
}

export default withRouter(withStyles(s)(ResetPasswordContainer));
