import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import {connect} from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.scss';

import {
  Navbar,
  MenuItem,
  Nav,
  NavDropdown,
  NavItem,
  Glyphicon,
} from 'react-bootstrap';

class Header extends React.Component {
  static propTypes = {
    sidebarToggle: PropTypes.func,
  };

  static defaultProps = {
    sidebarToggle: () => {},
  };

  render() {
    const {
      sidebarToggle,
      userDetails,
    } = this.props;

    const {
      firstName,
      lastName,
    } = userDetails || {};

    return (
      <Navbar fluid>
        <Nav pullLeft>
          <NavItem
            className={classes('visible-xs', s.burger)}
            eventKey={1}
            href="#"
            onClick={sidebarToggle}
          >
            <Glyphicon glyph="menu-hamburger" />
          </NavItem>
        </Nav>

        <Nav pullRight>
          <NavDropdown
            eventKey={1}
            title={
              <span>
                <Glyphicon glyph="user" className="mr-sm" />
                { firstName } <span className="fw-semi-bold">{ lastName }</span>
              </span>
            }
            noCaret
            id="basic-nav-dropdown"
          >
            <LinkContainer to="/logout" exact>
              <MenuItem eventKey={7.1}>Log Out</MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  return {
    userDetails: state.user,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Header));
