import classes from 'classnames';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Footer.scss';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';

class Footer extends Component {
  static propTypes = {
    className: PropTypes.string,
  };

  static defaultProps = {
    className: '',
  };

  setProfileLanguage(id, short) {

    localStorage.setItem('USER_LANGUAGE', short);

    window.location.reload();
  }

  render() {
    const {
      className,
      profileLanguages,
      isAuthenticated,
      userType,
      demo,
    } = this.props;

    const admin = isAuthenticated ? userType.find(role =>  role.code === 'admin') : false;

    return (
      <footer className={classes(s.root, className)}>
        <div className={s.container}>
            <Nav className={s.list}>
              <LinkContainer to="/" exact
                             className={s.link}
              >
                <NavItem eventKey={1}>
                  <span>{I18n.t('general.footer.homepage')}</span>
                </NavItem>
              </LinkContainer>

              {
                (!!admin || !demo) &&(
                  <LinkContainer to="/hobbies/footer" exact
                                 className={s.link}
                  >
                    <NavItem eventKey={2}>
                      <span>{I18n.t('general.footer.hobbies')}</span>
                    </NavItem>
                  </LinkContainer>
                )
              }

              <LinkContainer to="/about" exact
                             className={s.link}
              >
                <NavItem eventKey={3}>
                  <span>{I18n.t('general.footer.about')}</span>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/policies" exact
                             className={s.link}
              >
                <NavItem eventKey={4}>
                  <span> {I18n.t('general.footer.usingTermsLink')}</span>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/help" exact
                             className={s.link}
              >
                <NavItem eventKey={5}>
                  <span>{I18n.t('general.footer.help')}</span>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/signup" exact
                             className={s.link}
              >
                <NavItem eventKey={7}>
                  <span>{I18n.t('general.footer.reg')}</span>
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/login" exact >
                <NavItem eventKey={8}>
                  <span>{I18n.t('general.footer.log')}</span>
                </NavItem>
              </LinkContainer>
            </Nav>
            {
              !isAuthenticated &&(
                <ul className={s.list}>
                  {
                    !!profileLanguages.length && profileLanguages.map(({
                     id,
                     full: name,
                     short,
                   }) => (
                      <li
                        key={id}
                        className={s.langOption}
                        onClick={() => this.setProfileLanguage(id, short)}
                      >
                        <span>{name}</span>
                      </li>
                    ))
                  }
                </ul>
              )
            }
          <span>Contact us: info@qood.life &nbsp; © 2018 &nbsp; qood</span>
        </div>
      </footer>
    );
  }
}

function mapStateToProps(store) {
  return {
    profileLanguages: store.languages.list,
    accessToken: store.auth.accessToken,
    isAuthenticated: store.auth.isAuthenticated,
    userType: store.user.roles,
    user: store.user,
    demo: store.app.demo,
  };
}

export default (connect(mapStateToProps)(withStyles(s)(Footer)));
