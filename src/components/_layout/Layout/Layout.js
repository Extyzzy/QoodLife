import classes from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Layout.scss';
import Header from '../Header';
import HeaderMobile from '../Header/HeaderMobile';
import Footer from '../Footer';
import Sidebar from '../Sidebar';
import AdsBar from '../AdsBar';
import SidebarMobile from '../Sidebar/Mobile/SidebarMobileContainer';
import { connect } from 'react-redux';
import {MOBILE_VERSION} from '../../../actions/app';
import Confirmation from "../../AcceptCookies";

class Layout extends Component {
  static propTypes = {
    hasSidebar: PropTypes.bool,
    profile: PropTypes.bool,
    contentHasBackground: PropTypes.bool,
  };

  static defaultProps = {
    hasSidebar: false,
    hasAds: false,
    profile: false,
    contentHasBackground: false,
  };

  render() {
    const {
      UIVersion,
      viewSwitchMode,
      profile,
      hasSidebar,
      hasAds,
      children,
      content,
      contentHasBackground,
      whichSidebar,
      placeOrProfHobbies,
    } = this.props;

    document.body.style.overflowY = "scroll";

    const policyAccept = localStorage.getItem('POLICY');

    return (
      <div className={s.root}>
        <div className={s.wrap} style={policyAccept !== 'true' ? {marginBottom: 60} : null}>
          {
            (UIVersion !== MOBILE_VERSION && (
              <Header />
            )) || (
              <HeaderMobile MenuItems={hasSidebar} />
            )
          }

          <main className={classes(s.container, 'container', {
            [s.withSidebar]: hasSidebar,
          })}>
            {
              hasSidebar && (
                (UIVersion === MOBILE_VERSION && (
                  <div className={s.sidebar}>
                    <SidebarMobile
                      profile={profile}
                      viewSwitchMode={viewSwitchMode}
                      whichSidebar={whichSidebar}
                    />
                  </div>
                )) || (
                  <div className={s.sidebar}>
                    <Sidebar
                      profile={profile}
                      placeOrProfHobbies={placeOrProfHobbies}
                    />
                  </div>
                )
              )
            }
            <div className={classes(s.content, {
              [s.contentBackground]: contentHasBackground,
            })}>
              {children || content}
            </div>
            {
              hasAds && UIVersion !== MOBILE_VERSION && (
                <AdsBar />
              )
            }
          </main>
          {
            policyAccept !== 'true' &&(
              <Confirmation />
            )
          }
          <Footer className="text-center" />
        </div>
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
  };
}

Layout.contextTypes = {
  router: PropTypes.any.isRequired,
};

export default (connect(mapStateToProps)(withStyles(s)(Layout)));
