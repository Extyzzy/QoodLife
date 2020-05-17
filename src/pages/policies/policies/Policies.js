import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import Layout from '../../../components/_layout/Layout/Layout';
import s from './policies.scss';
import connect from "react-redux/es/connect/connect";
import { MOBILE_VERSION } from '../../../actions/app';
import withStyles from "isomorphic-style-loader/lib/withStyles";

class Policies extends Component {
  render() {
    const {
      UIVersion
    } = this.props;

    return (
      <Layout
        contentHasBackground
      >
        <div className={s.root}>
          <ul className="breadcrumb">
            <li>
              <span className="text-muted">
                {I18n.t('general.policies.policies')}
              </span>
            </li>
          </ul>
            <div className={UIVersion === MOBILE_VERSION ? s.mobilePoliciesLinks : s.policiesLinks}>
            <div className={UIVersion === MOBILE_VERSION ? s.mobileLinkItem : s.linkItem}>
              <Link to="/policies/using-terms">
                {I18n.t('general.policies.usingTerms')}
              </Link>
            </div>
            <div className={UIVersion === MOBILE_VERSION ? s.mobileLinkItem : s.linkItem}>
              <Link to="/policies/privacy-policy">
                {I18n.t('general.policies.privacy')}
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Policies)));

