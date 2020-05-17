import React, { Component } from 'react';
import classes from 'classnames';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './WarningPopover.scss';
import {I18n} from 'react-redux-i18n';

class WarningPopover extends Component {
  render() {
    const isPopup = this.props.isPopup || false;
    const popoverClickRootClose = (
      <Popover
        id="popover-trigger-click-root-close"
        className={classes({[s.popoverInPopup]: isPopup})}
        >
        {
          (this.props.fullName &&(
            this.props.fullName
          )) || (
            I18n.t('general.components.accountConfirmPopover')
          )
        }
      </Popover>
    );

    return (
      <OverlayTrigger
        trigger="click"
        className={s.root}
        rootClose placement="bottom"
        overlay={popoverClickRootClose}
        {...(isPopup ? {container: this} : {})}
      >
        {this.props.children}
      </OverlayTrigger>
    );
  }
}

export default withStyles(s)(WarningPopover);
