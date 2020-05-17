import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, NavItem } from 'react-bootstrap';
import { MOBILE_VERSION } from '../../../actions/app';
import { I18n } from 'react-redux-i18n';
import {
  SIDEBAR_GROUP_ALL,
  SIDEBAR_GROUP_RELATED,
  SIDEBAR_GROUP_FOR_CHILDRENS,
  myProfileBlockChange,
} from '../../../actions/navigation';
import GroupMobile from "./Mobile/GroupMobile";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import classes from "classnames";
import s from './Sidebar.scss';
import Group from './Group';
import FiltreCalendar from './FilterCalendar';
import FilterHobbiesEvents from './FilterHobbiesEvents';

class Sidebar extends React.Component {

  getViewMode() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return GroupMobile;

      default:
        return Group;
    }
  }

  render () {
    const {
      hobbies,
      userHobbies,
      childrenHobbies,
      isAuthenticated,
      userHaveChildrens,
      MyProfile,
      location,
      roles,
      removeAllGroup,
      dispatch,
      demo,
      ads,
      placeOrProfHobbies,
      calendarPlace,
      eventsHobbies,
    } = this.props;

    const Group = this.getViewMode();
    const admin = isAuthenticated ? roles.find(role =>  role.code === 'admin') : false;
    const isPlaceorProf = (eventsHobbies.length > 0 || (calendarPlace && calendarPlace.status && calendarPlace.filters.length > 0));
    return (
       <div className={classes(s.root, {[s.rootPlaceorProf]: isPlaceorProf})}>
        {
          // Verified if in url browser have word 'profile', this need for show profile button in page
          location.pathname.indexOf('profile') >= 0 && (
            <div>
                  <div style={{marginRight: 5}} className={s.links}>
                    <a className={classes(s.buttonMyProfile, {[s.active]: MyProfile})}
                      onClick={() => {
                        dispatch(myProfileBlockChange(!MyProfile));
                      }}>
                      {I18n.t('general.sidebar.myProfile')}</a>
                      {
                        MyProfile &&(
                          <Nav className={s.list}>
                            {
                              (!!admin || !demo) && (
                                <LinkContainer
                                  to="/profile/timeline"
                                  activeClassName={s.activeLink}
                                  className={s.link}
                                >
                                  <NavItem eventKey={1}>
                                    <span>{I18n.t('general.header.myTimeline')}</span>
                                  </NavItem>
                                </LinkContainer>
                              )
                            }

                            <LinkContainer
                              exact
                              to="/profile/messages"
                              activeClassName={s.activeLink}
                              className={s.link}
                            >
                              <NavItem eventKey={2}>
                                <span>{I18n.t('general.header.messages')}</span>
                              </NavItem>
                            </LinkContainer>
                            {
                              (!!admin || !demo) && (
                                <LinkContainer
                                  exact
                                  to="/profile/groups"
                                  activeClassName={s.activeLink}
                                  className={s.link}
                                >
                                  <NavItem eventKey={3}>
                                    <span>{I18n.t('general.header.groups')}</span>
                                  </NavItem>
                                </LinkContainer>
                              )
                            }
                            <LinkContainer
                              exact
                              to="/profile/favorites"
                              activeClassName={s.activeLink}
                              className={s.link}
                            >
                              <NavItem eventKey={4}>
                                <span>{I18n.t('general.header.favorites')}</span>
                              </NavItem>
                            </LinkContainer>
                            {
                              ads &&(
                                <LinkContainer
                                  exact
                                  to="/profile/ads"
                                  activeClassName={s.activeLink}
                                  className={s.link}
                                >
                                  <NavItem eventKey={5}>
                                    <span>{I18n.t('general.header.ads')}</span>
                                  </NavItem>
                                </LinkContainer>
                              )
                            }

                            <LinkContainer
                              exact
                              to="/profile/edit"
                              activeClassName={s.activeLink}
                              className={s.link}
                            >
                              <NavItem eventKey={5}>
                                <span>{I18n.t('general.header.editProfile')}</span>
                              </NavItem>
                            </LinkContainer>
                            <LinkContainer
                              exact
                              to="/profile/settings"
                              activeClassName={s.activeLink}
                              className={location.pathname.indexOf('settings') >= 0 ? s.activeLink : s.link}
                            >
                              <NavItem eventKey={6}>
                                <span>{I18n.t('general.header.accountSettings')}</span>
                              </NavItem>
                            </LinkContainer>

                            {
                              !!admin &&(
                                <LinkContainer
                                  to="/administration"
                                  exact
                                >
                                  <NavItem eventKey={6}>
                                    <span>{I18n.t('general.header.administration')}</span>
                                  </NavItem>
                                </LinkContainer>
                              )
                            }
                            <LinkContainer
                              exact
                              to="/logout"
                            >
                              <NavItem eventKey={8}>
                                <span>{I18n.t('general.header.logOut')}</span>
                              </NavItem>
                            </LinkContainer>
                          </Nav>
                        )
                      }
                  </div>
            </div>
          )
        }

        {
          (!!admin || !demo) && !placeOrProfHobbies && userHaveChildrens && (
            <Group
              name={SIDEBAR_GROUP_FOR_CHILDRENS}
              title={I18n.t('general.sidebar.children')}
              list={childrenHobbies}
            />
          )
        }

        {
           (!!admin || !demo) && !placeOrProfHobbies && isAuthenticated && (
            <Group
              name={SIDEBAR_GROUP_RELATED}
              title={I18n.t('general.sidebar.myHobbies')}
              list={userHobbies}
            />
          )
        }

        {
           !removeAllGroup && !placeOrProfHobbies && location.pathname.indexOf('profile') < 0 &&(
             <Group
               name={SIDEBAR_GROUP_ALL}
               title={I18n.t('general.sidebar.allHobbies')}
               list={hobbies}
             />
           )
         }

         {
           placeOrProfHobbies &&(
             <Group
               name={SIDEBAR_GROUP_RELATED}
               title={I18n.t('profile.editProfile.profileDetails.shortDomeins')}
               list={placeOrProfHobbies}
             />
           )
         }

          {
            calendarPlace && calendarPlace.status && calendarPlace.filters.length > 0 && (
              <FiltreCalendar
                name={SIDEBAR_GROUP_RELATED}
                title={I18n.t('general.sidebar.calendarFilters')}
                calendarPlace={calendarPlace}
              />
            )
          }
          {
            eventsHobbies.length > 0 && (
              <FilterHobbiesEvents
                placeOrProfHobbies={placeOrProfHobbies}
              />
            )
          }
      </div>
    );
  };
}

function mapStateToProps(store) {
  return {
    userHaveChildrens: store.user.children && !!store.user.children.length,
    eventsHobbies: store.events.listHobbiesEvents,
    roles: store.user.roles ? store.user.roles : null,
    userHobbies: store.user.hobbies || [],
    childrenHobbies: store.user.childrenHobbies || [],
    calendarPlace: store.calendar.calendarPlace,
    hobbies: store.hobbies.list,
    MyProfile: store.navigation.MyProfile,
    ChildrensSidebar: store.navigation.Childrens,
    isAuthenticated: store.auth.isAuthenticated,
    UIVersion: store.app.UIVersion,
    demo: store.app.demo,
    ads: store.app.ads,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(Sidebar)));
