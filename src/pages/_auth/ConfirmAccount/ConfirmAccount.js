import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import PropTypes from 'prop-types';
import {Grid, Alert} from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ConfirmAccount.scss';
import Widget from '../../../components/Widget/Widget';
import Footer from '../../../components/_layout/Footer';

class ConfirmAccount extends Component {
  static propTypes = {
    isLoading: PropTypes.bool,
    error: PropTypes.string,
    onLoginClick: PropTypes.func,
  };

  static defaultProps = {
    isLoading: true,
  };

  render() {
    const {
      isLoading,
      error,
      onLoginClick,
    } = this.props;

    return (
      <div className={s.root}>
        <Grid className={s.grid}>
          <Widget className={s.widget} xs={10} sm={6} lg={4}>
            {
              (isLoading &&
                I18n.t('auth.confirmAccount.confirmingAccount')
              ) || (
                (error && (
                  <Alert className="alert-sm" bsStyle="danger">
                    {error}
                  </Alert>
                )) || (
                  <div>
                    <p className="fs-sm text-muted">
                      {I18n.t('auth.confirmAccount.successMessage')}
                    </p>
                    <div>
                      <button
                        onClick={onLoginClick}
                        className="btn btn-default btn-sm btn-block"
                      >
                        {I18n.t('auth.general.logIn')}
                      </button>
                    </div>
                  </div>
                )
              )
            }
          </Widget>
        </Grid>
        <Footer className="text-center" />
      </div>
    );
  }
}

export { ConfirmAccount as ConfirmAccountWithoutDecorators };
export default withStyles(s)(ConfirmAccount);
