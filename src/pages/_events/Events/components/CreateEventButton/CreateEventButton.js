import React, { Component } from "react";
import {I18n} from 'react-redux-i18n';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from 'classnames';
import WarningPopover from '../../../../../components/WarningPopover';
import {actionIsAllowed} from '../../../../../helpers/permissions';

class CreateEventButton extends Component {
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
      module: 'events',
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
          onClick={() => history.push(`/events/create`, {role: role})}
        >
          {I18n.t('events.addEventButton')}
        </button>
      )
    }

    return (
      <WarningPopover>
        <button className={classes(
          'btn btn-white',
          {'mobile': isMobile}
        )}>
            {I18n.t('events.addEventButton')}
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

export default withRouter(connect(mapStateToProps)(CreateEventButton));
