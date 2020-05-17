import {connect} from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';
import s from './HeaderMobile.scss';
import { withRouter } from 'react-router';

class HeaderMobile extends React.Component {
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
      headerDropdownOpened: false,
    };

    this.headerDropdownToggle = this.headerDropdownToggle.bind(this);
  }

  componentDidMount() {
    const {
      isAuthenticated,
    } = this.props;

    if (isAuthenticated) {
      const element = document.getElementById('scroll');
      element.scrollLeft = 200;
    }
  }

  headerDropdownToggle(headerDropdownOpened) {
    this.setState({
      headerDropdownOpened,
    });
  }

  render() {
    const {
      isAuthenticated,
    } = this.props;


    return <Navbar className={s.root} fixedTop>
        <Nav className={s.categories} id='scroll'>
          <LinkContainer to="/" exact activeClassName={s.active}>
            <NavItem eventKey={1}>
              <img className={s.image} src={require('./mobile-logo.svg')} alt="qoodLife" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/events" exact activeClassName={s.active} className={!!window.location.href.match('events') ? s.active : null}>
            <NavItem eventKey={2}>
              <i className="icon-calendar" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/places-and-pros" exact activeClassName={s.active} className={!!window.location.href.match('professionals') || !!window.location.href.match('places') ? s.active : null}>
            <NavItem eventKey={3}>
              <i className="icon-pointer-on-map" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/groups" exact activeClassName={s.active} className={!!window.location.href.match('groups') ? s.active : null}>
            <NavItem eventKey={4}>
              <i className="icon-people" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/products" exact activeClassName={s.active} className={!!window.location.href.match('products') ? s.active : null}>
            <NavItem eventKey={5}>
              <i className="icon-bag" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/blog" exact activeClassName={s.active} className={!!window.location.href.match('blog') ? s.active : null}>
            <NavItem eventKey={6}>
              <i className="icon-message" />
            </NavItem>
          </LinkContainer>
          <LinkContainer to="/search" exact activeClassName={s.active}>
            <NavItem eventKey={1}>
              <i className="icon-search" />
            </NavItem>
          </LinkContainer>
          {
            (isAuthenticated &&
              <LinkContainer to="/profile/edit" exact activeClassName={s.active}>
              <NavItem eventKey={7}>
                <i className="icon-man" />
              </NavItem>
            </LinkContainer>
            ) || <LinkContainer to="/login" exact activeClassName={s.active}>
              <NavItem eventKey={7}>
                <i className="icon-man" />
              </NavItem>
            </LinkContainer>
          }
        </Nav>
      </Navbar>;
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    accessTokenExpiresOn: state.auth.accessTokenExpiresOn,
    userDetails: state.user.details,
    isAuthenticated: state.auth.isAuthenticated
  };
}

HeaderMobile.contextTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(s)(HeaderMobile)));
