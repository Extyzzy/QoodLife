import React, { Component } from "react";
import { connect } from 'react-redux';
import classes from 'classnames';
import WarningPopover from '../../../../../components/WarningPopover';
import {I18n} from 'react-redux-i18n';
import {withRouter} from "react-router";
import {actionIsAllowed} from "../../../../../helpers/permissions";

class CreateProductButton extends Component {
  render() {
    const {
      permissions,
      user,
      role,
      history,
      isMobile,
      match,
      UIVersion
    } = this.props;

    const style = ((match.path === '/profile/edit') && (UIVersion === 'MOBILE_VERSION')) ? {width: '300px', marginBottom: '15px'} : null;

    if ( ! actionIsAllowed(permissions, {
        module: 'products',
        action: 'create',
      })) {
      return null;
    }

    if(user.confirmed) {
      return (
        <button className={classes(
          'btn btn-white',
          {'mobile': isMobile}
        )}
          style={style}
          onClick={() => {
          history.push(`/products/create`, role)
        }}
        >
           {I18n.t('products.addProductButton')}
        </button>
      )
    }

    return (
      <WarningPopover>
        <button className={classes(
          'btn btn-white',
          { 'mobile': isMobile }
        )}>
          {I18n.t('products.addProductButton')}
        </button>
      </WarningPopover>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
    user: state.user,
    permissions: state.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(CreateProductButton));
