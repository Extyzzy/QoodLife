import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {FaClose} from "react-icons/lib/fa/index";
import {LinkContainer} from 'react-router-bootstrap';
import {I18n} from 'react-redux-i18n';
import classes from 'classnames';
import s from './SidebarMobile.scss';

const SideBar = ({
   showCloseButton,
   viewSwitchMode,
   showSideBar,
   sideBar,
   showFavorites,
   favorites,
   ads,
   showProfessional,
   professional,
   isProfessional,
   agent,
   showAgent,
   isAgent,
 }) => {
  return(
    <div className={s.root}>
      <div className={
        classes({
          [s.backgroundShadow]: showSideBar,
        })
      }
      onClick={sideBar}
      />
      <div className={
        classes(s.containnerCategory, {
          [s.showSideBar]: showSideBar,
        })
      }>
        <div className={s.buttonsCategory}>
          <div className={s.links}>
            <a className={s.buttonMyProfile}>
              {I18n.t('general.sidebar.myProfile')}
            </a>
            <LinkContainer
              exact
              to="/profile/timeline"
              activeClassName={s.active}
              className={s.link}
            >
              <span>{I18n.t('general.header.myTimeline')}</span>
            </LinkContainer>
            <LinkContainer
              exact
              to="/profile/messages"
              activeClassName={s.active}
              className={s.link}
            >
              <span>{I18n.t('general.header.messages')}</span>
            </LinkContainer>
            {isProfessional && (
              <div className={classes(s.professionalTab, {
                [s.openTab]: professional,
              })}>
              <span
                onClick={showProfessional}
                className={classes(s.professionalTab, {
                  [s.open]: professional,
                })}
              >
                {I18n.t('professionals.proLinks')}
              </span>
              </div>
            )}
            {
              professional &&(
                <div className={s.professional}>
                  <LinkContainer
                    exact
                    to="/profile/professional/events"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showProfessional}>
                    {I18n.t('general.header.events')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/professional/products"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showProfessional}>
                    {I18n.t('general.header.products')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/professional/posts"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showProfessional}>
                    {I18n.t('general.header.posts')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/professional/groups"
                    activeClassName={s.active}
                    className={s.link}
                  >
                    <span onClick={showProfessional}>
                    {I18n.t('general.header.groups')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/professional/places"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showProfessional}>
                    {I18n.t('general.header.places')}
                  </span>
                  </LinkContainer>
                </div>
              )
            }
            {isAgent && (
              <div className={classes(s.agentTab, {
                [s.openTab]: agent,
              })}>
              <span
                onClick={showAgent}
                className={classes(s.agentTab, {
                  [s.open]: agent,
                })}
              >
                {I18n.t('agent.agentLinks')}
              </span>
              </div>
            )}
            {
              agent &&(
                <div className={s.agent}>
                  <LinkContainer
                    exact
                    to="/profile/business/events"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showAgent}>
                    {I18n.t('general.header.events')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/business/professionals"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showAgent}>
                    {I18n.t('general.header.professionals')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/business/places"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showAgent}>
                    {I18n.t('general.header.places')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/business/products"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showAgent}>
                    {I18n.t('general.header.products')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/business/posts"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showAgent}>
                    {I18n.t('general.header.posts')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/business/groups"
                    activeClassName={s.active}
                    className={s.link}
                  >
                    <span onClick={showAgent}>
                    {I18n.t('general.header.groups')}
                  </span>
                  </LinkContainer>
                </div>
              )
            }
            <LinkContainer
              exact
              to="/profile/groups"
              activeClassName={s.active}
              className={s.link}
            >
              <span>{I18n.t('general.header.groups')}</span>
            </LinkContainer>
            <div className={classes(s.favoritesTab, {
              [s.openTab]: favorites,
            })}>
            <span
              onClick={showFavorites}
              className={classes(s.favoritesTab, {
                [s.open]: favorites,
              })}
            >
              {I18n.t('general.header.favorites')}
            </span>
            </div>
            {
              favorites &&(
                <div className={s.favorites}>
                <LinkContainer
                    exact
                    to="/profile/favorites/events"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showFavorites}>
                    {I18n.t('general.header.events')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/favorites/professionals"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showFavorites}>
                    {I18n.t('general.header.professionals')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/favorites/places"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showFavorites}>
                    {I18n.t('general.header.places')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/favorites/products"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showFavorites}>
                    {I18n.t('general.header.products')}
                  </span>
                  </LinkContainer>
                  <LinkContainer
                    exact
                    to="/profile/favorites/posts"
                    activeClassName={s.active}
                    className={s.link}
                  >
                  <span onClick={showFavorites}>
                    {I18n.t('general.header.posts')}
                  </span>
                  </LinkContainer>
                </div>
              )
            }
            {
              ads && (
                <LinkContainer
                  exact
                  to="/profile/ads"
                  activeClassName={s.active}
                  className={s.link}
                >
                  <span>{I18n.t('general.header.ads')}</span>
                </LinkContainer>
              )
            }
            <LinkContainer
              exact
              to="/profile/edit"
              activeClassName={s.active}
              className={s.link}
            >
              <span>{I18n.t('general.header.editProfile')}</span>
            </LinkContainer>
            <LinkContainer
              exact
              to="/profile/settings"
              activeClassName={s.active}
              className={s.link}
            >
              <span>{I18n.t('general.header.accountSettings')}</span>
            </LinkContainer>
            <LinkContainer
             to="/logout"
              exact
              onClick={() => {document.body.style.overflow = ''}}
            >
              <span>Log Out</span>
            </LinkContainer>

          </div>
        </div>

        <div className={s.containerCloseButton}>
          <div className={s.closeButton} onClick={sideBar}>
            <FaClose className={s.icon} size={20}/>
          </div>
        </div>
      </div>

      {
        showCloseButton && (
          <div className={s.swith}>
            <div className={s.containerButton} onClick={sideBar}>
              <div className={s.button}>
                {I18n.t('general.sidebar.myProfile')}
              </div>
            </div>
            {viewSwitchMode}
          </div>
        )
      }
    </div>
  )
};

export { SideBar as SideBarWithoutStyles };
export default withStyles(s)(SideBar);
