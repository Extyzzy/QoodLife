import React, { Component } from "react";
import { connect } from "react-redux";
import classes from 'classnames';
import WarningPopover from '../../../../../components/WarningPopover';
import {I18n} from 'react-redux-i18n';
import {withRouter} from "react-router";
import {actionIsAllowed} from "../../../../../helpers/permissions";

class CreateGroupButton extends Component {
  render() {
    const {
      user,
      permissions,
      role,
      history,
      isMobile,
      match,
      UIVersion
    } = this.props;

    const style = ((match.path === '/profile/edit') && (UIVersion === 'MOBILE_VERSION')) ? {width: '300px', marginBottom: '15px'} : null;

    if ( ! actionIsAllowed(permissions, {
        module: 'groups',
        action: 'create',
      })) {
      return null;
    }

    if(user.confirmed) {
      return (
        <button
          className={classes(
            'btn btn-white',
            {'mobile': isMobile}
          )}
          style={style}
          onClick={() => history.push(`/groups/create`, role)}
        >
          {I18n.t('groups.addGroupButton')}
        </button>
      );
    }

      return (
        <WarningPopover>
          <button className={classes(
            'btn btn-white',
            {'mobile': isMobile}
          )}>
            {I18n.t('groups.addGroupButton')}
          </button>
        </WarningPopover>
      );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
    user: store.user,
    permissions: store.user.permissions,
  };
}

export default withRouter(connect(mapStateToProps)(CreateGroupButton));
