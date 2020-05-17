import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { Navbar,OverlayTrigger,Tooltip, Nav, NavItem, NavbarBrand, NavDropdown, MenuItem} from 'react-bootstrap';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { I18n } from 'react-redux-i18n';
import SearchBox from '../../searchBox';
import s from './Header.scss';

class Header extends Component {
  static propTypes = {
    sidebarToggle: PropTypes.func,
    history: PropTypes.object.isRequired
  };

  static defaultProps = {
    sidebarToggle: () => {
    },
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      isOpen: false,
    };

    this.headerDropdownToggle = this.headerDropdownToggle.bind(this);
  }

  headerDropdownToggle(headerDropdownOpened) {
    this.setState({
      headerDropdownOpened,
    });
  }

  tooltip = (text)=> (
    <Tooltip id="tooltip">
      <span>{I18n.t(text)}</span>
    </Tooltip>
  );

  render() {
    const {
      lastName,
      avatar,
      roles,
    } = this.props.userDetails || {};

    const {
      isAuthenticated,
      notificationsAreLoaded,
      unViewedMessagesCount,
      groupsNotifications,
      history,
      demo,
      ads
    } = this.props;

    const admin = isAuthenticated ? roles.find(role => role.code === 'admin') : false;

    return (
      <Navbar className={s.root} fixedTop>
        <NavbarBrand eventKey={1}>
          <Link to="/" className={s.brand}>
            <img src={require('./logo.svg')} alt="qoodLife"/>
          </Link>
        </NavbarBrand>
        {
          ( (!!admin || !demo) &&(
            <Nav className={s.categories} pullLeft>
              <LinkContainer to="/events" exact activeClassName={s.active}
                             className={window.location.href.indexOf('events') !== -1 ? s.active : null}>
                <NavItem eventKey={2}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.events')}>
                    <i className="icon-calendar"/>
                  </OverlayTrigger>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/places-and-pros" exact activeClassName={s.active}
                             className={window.location.href.indexOf('professionals') !== -1 ||
                                        window.location.href.indexOf('places') !== -1 ? s.active : null}>
                <NavItem eventKey={3}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.placesAndPros')}>
                    <i className="icon-pointer-on-map"/>
                  </OverlayTrigger>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/groups" exact activeClassName={s.active}
                             className={window.location.href.indexOf('groups') !== -1 ? s.active : null}>
                <NavItem eventKey={4}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.groups')}>
                    <i className="icon-people"/>
                  </OverlayTrigger>
                  <span className={s.beta}>beta</span>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/products" exact activeClassName={s.active}
                             className={window.location.href.indexOf('products') !== -1 ? s.active : null}>
                <NavItem eventKey={5}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.products')}>
                    <i className="icon-bag"/>
                  </OverlayTrigger>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/blog" exact activeClassName={s.active}
                             className={window.location.href.indexOf('blog') !== -1 ? s.active : null}>
                <NavItem eventKey={6}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.blog')}>
                    <i className="icon-message"/>
                  </OverlayTrigger>
                </NavItem>
              </LinkContainer>
            </Nav>
          )) || (
            <Nav className={s.categories} pullLeft>
              <LinkContainer to="/blog" exact activeClassName={s.active}>
                <NavItem eventKey={6}>
                  <OverlayTrigger placement="bottom" overlay={this.tooltip('general.header.blog')}>
                    <i className="icon-message"/>
                  </OverlayTrigger>
                  <span>{I18n.t('general.header.blog')}</span>
                </NavItem>
              </LinkContainer>
            </Nav>
          )
        }

        <div className={s.searchAndProfile}>
          {
            (!!admin || !demo) &&(
              <SearchBox />
            )
          }

          {
            !isAuthenticated && (
              <Nav pullRight className={s.nav} onClick={() => history.push("/login", {from: history.location.pathname})}>
                <NavDropdown
                  className={s.headerDropdown}
                  title={
                    <span>
                    <i className="icon-man"/>
                    <span>
                        Log In
                    </span>
                  </span>
                  } noCaret id="header-menu">
                </NavDropdown>
              </Nav>
            )}

          {isAuthenticated && (
            <Nav pullRight className={s.nav}>
              <NavDropdown
                className={classNames(s.headerDropdown, {
                  [s.open]: this.state.isOpen
                })}
                onClick={demo ? null : () => history.push("/profile/timeline")}
                onToggle={this.headerDropdownToggle}
                onMouseEnter = { () => this.setState({ isOpen: true }) }
                onMouseLeave = { () => this.setState({ isOpen: false }) }
                open={ this.state.isOpen }
                eventKey={7}
                noCaret
                id="header-menu"
                title={
                  <span>
                  {
                    (avatar && (
                      <img src={avatar.src} alt=''/>
                    )) || (
                      (
                        (roles.filter(role => role.code === 'place').code && (
                          <i className="icon-map-marker"/>
                        )) || (
                          <i className="icon-man"/>
                        )
                      )
                    )
                  }
                    <span>{lastName}</span>
                </span>
                }>
                {
                  ( !this.props.MenuItems && (!!admin || !demo )) && (
                    <LinkContainer
                      to="/profile/timeline"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.1}>
                        {I18n.t('general.header.myTimeline')}
                      </MenuItem>
                    </LinkContainer>
                  )
                }
                {
                  !this.props.MenuItems && (
                    <LinkContainer
                      to="/profile/messages"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.2}>
                        {I18n.t('general.header.messages') }
                        <strong>
                          {
                            unViewedMessagesCount > 0 &&
                            ` (${unViewedMessagesCount} new)`
                          }
                        </strong>
                      </MenuItem>
                    </LinkContainer>
                  )
                }
                {
                  ( !this.props.MenuItems && (!!admin || !demo ))  && (
                    <LinkContainer
                      to="/profile/groups"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.3}>
                        {I18n.t('general.header.groups')}
                        <strong>
                          {
                            !notificationsAreLoaded &&
                            !!groupsNotifications.length &&
                            ` (${groupsNotifications.length} new)`
                          }
                        </strong>
                      </MenuItem>
                    </LinkContainer>
                  )
                }
                {
                  !this.props.MenuItems && (
                    <LinkContainer
                      to="/profile/favorites"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.4}>
                        {I18n.t('general.header.favorites')}
                      </MenuItem>
                    </LinkContainer>
                  )
                }

                {
                  ( !this.props.MenuItems && ads) && (
                    <LinkContainer
                      to="/profile/ads"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.5}>
                        {I18n.t('general.header.ads')}
                      </MenuItem>
                    </LinkContainer>
                  )
                }

                {
                  !this.props.MenuItems && (
                    <LinkContainer
                      to="/profile/edit"
                      exact
                      activeClassName={s.activeMenuItem}
                    >
                      <MenuItem eventKey={7.5}>
                        {I18n.t('general.header.editProfile')}
                      </MenuItem>
                    </LinkContainer>
                  )
                }

                <LinkContainer
                  to="/profile/settings"
                  exact
                  activeClassName={s.activeMenuItem}
                >
                  <MenuItem eventKey={7.6}>
                    {I18n.t('general.header.accountSettings')}
                  </MenuItem>
                </LinkContainer>

                {
                  !!admin &&(
                    <LinkContainer
                      to="/administration"
                      exact
                    >
                      <MenuItem eventKey={7.7}>
                        <span>{I18n.t('general.header.administration')}</span>
                      </MenuItem>
                    </LinkContainer>
                  )
                }

                <LinkContainer to="/logout" exact>
                  <MenuItem eventKey={7.9}>{I18n.t('general.header.logOut')}</MenuItem>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          )}
        </div>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    accessTokenExpiresOn: state.auth.accessTokenExpiresOn,
    groupsNotifications: state.notifications.forGroups,
    reqestsNotifications: state.notifications.forInvitations,
    unViewedMessagesCount: state.notifications.unviewedMessages,
    notificationsAreLoaded: state.notifications.isFetching,
    userDetails: state.user,
    isAuthenticated: state.auth.isAuthenticated,
    demo: state.app.demo,
    ads: state.app.ads,
  };
}

Header.contextTypes = {
  router: PropTypes.any.isRequired,
};

export default  withRouter(connect(mapStateToProps)(withStyles(s)(Header)));
