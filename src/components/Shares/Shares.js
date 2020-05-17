import React, { Component } from 'react';
import { I18n } from 'react-redux-i18n';
import { ShareButtons } from 'react-share';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import config from '../../config';
import s from './Shares.scss';

class Shares extends Component {

constructor(props, context) {
  super(props, context);

  this.state = {
    clipBoardWasClicked: false
  };
};

clipBoard() {
  const el = document.createElement('textarea');

  this.setState({
    clipBoardWasClicked: true
  }, () => {
    el.value = `${config.uiUrl}${this.props.shareUrl}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  })
}

render() {
  const {
    FacebookShareButton: Fb,
    TwitterShareButton: Twitter,
  } = ShareButtons;

  const {
    isPopup,
    shareUrl,
    title,
  } = this.props;

  const {
    clipBoardWasClicked
  } = this.state;

  return (
    <div className={s.shares}>
      <div className={classes(s.shareLabel, {[s.inPopup]:isPopup})}>
        <span>{I18n.t('general.elements.share')}</span>
      </div>
        <Fb
          url={`${config.uiUrl}${shareUrl}`}
          quote={title}
          className={classes(s.shareButton, s.facebook)}
        >
          <i className="icon-facebook" />
        </Fb>

        <Twitter
          url={`${config.uiUrl}${shareUrl}`}
          title={title}
          className={classes(s.shareButton, s.twitter)}
        >
          <i className="icon-twitter" />
        </Twitter>

        <div
          className={classes(s.shareButton, s.copyLink, {[s.activated]: clipBoardWasClicked})}
          onClick={() => this.clipBoard()}
        >
          <i className="icon-link" />
        </div>
    </div>
  )
}
}

export default withStyles(s)(Shares);
