import React, { Component } from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./EditProfile.scss";
import Layout from '../../../components/_layout/Layout';
import Tabs from "../../../components/Tabs/Tabs";
import User from "./components/ProfileDetails/User";
import Professional from "./components/ProfileDetails/ProfessionalForm";
import Place from "./components/ProfileDetails/AgentForm";
import {connect} from "react-redux";
import { MOBILE_VERSION } from '../../../actions/app';
import {I18n} from 'react-redux-i18n';
import { setViewedNotification as setViewedNotificationAction } from '../../../actions/notifications';
import { fetchSocialMediaTypes } from "../../../actions/socialMediaTypes";
import { fetchNotifications, receiveFetchRestNotifications } from '../../../actions/notifications';
import PostsList from "./components/PostsList";
import EventsList from "./components/EventsList";
import ProductsList from "./components/ProductsList";
import GroupsList from "./components/GroupsList";
import BranchesList from "./components/BranchesList";
import PlacesList from "./components/PlacesList";
import Calendar from "./components/Calendar";
import ProfessionalsList from "./components/ProfessionalsList";
import {withRouter} from "react-router";
import {confirm} from "../../../components/_popup/Confirm";
import { fetchGenders } from "../../../actions/genders";
import { fetchBlogLanguages } from "../../../actions/blogLanguages";
import { SilencedError } from "../../../exceptions/errors";
import { fetchAuthorizedApiRequest} from "../../../fetch";
import { appendToFormData } from '../../../helpers/form';
import Loader from "../../../components/Loader/Loader";

class EditProfile extends Component {
  constructor(props, context) {
    super(props, context);

    const {
      location,
    } = this.props;

    let defaultIndex;
    if (location.state) {

      switch(location.state.activeTab) {

        case 'events':
          defaultIndex = 0;
          break;

        case 'products':
          defaultIndex = 2;
          break;

        case 'groups':
          defaultIndex = 1;
          break;

        case 'posts':
          defaultIndex = 3;
          break;

        default:
          defaultIndex = 0;
      }
    }

    this.state = {
      activeTabItemIndex: 0,
      activeTabItemIndexProf: defaultIndex,
      activeTabItemIndexAgent: defaultIndex,
      activeTabItemIndexAdmin: defaultIndex,
      notifications: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      socialMediaTypes,
      gendersList,
      blogLanguagesList,
      user,
      location,
    } = this.props;

    this.loadRestNotifications();

    if (!user.confirmed) {
      confirm(I18n.t('general.components.accountConfirmPopover'));
    }

    const items = this.rolesTab();

    if (!location.state) {
      let activeTabItemIndex = items.findIndex(data => data.code === user.default);

      this.setState({activeTabItemIndex});
    }

    if ( ! gendersList || ! gendersList.length) {
      dispatch(
        fetchGenders()
      );
    }

    if ( ! socialMediaTypes || ! socialMediaTypes.length) {
      dispatch(
        fetchSocialMediaTypes()
      );
    }

    if ( ! blogLanguagesList || ! blogLanguagesList.length) {
      dispatch(
        fetchBlogLanguages()
      );
    }
  }

  loadRestNotifications() {
    const { dispatch, accessToken } = this.props;

    Promise.all([
      fetchNotifications(dispatch, accessToken, 'events'),
      fetchNotifications(dispatch, accessToken, 'products'),
      fetchNotifications(dispatch, accessToken, 'blog')
    ]).then(([
      eventsNotifications,
      productsNotifications,
      blogNotifications
    ]) => dispatch(receiveFetchRestNotifications([
      ...eventsNotifications.list,
      ...productsNotifications.list,
      ...blogNotifications.list
    ]))).then(() =>
      this.setState({notifications: true})
    )
  }

  getTabNotifications(activeRole, activeTab, getCount = false) {
    const {
      restNotificationsList,
      groupsNotificationsList
    } = this.props;

    const allNotifications = [
      ...restNotificationsList,
      ...groupsNotificationsList
    ];

    const notificationsList = allNotifications.filter(n =>
      n.objectReferenceRole.code === activeRole && n.module === activeTab
    );

    return getCount? !!notificationsList.length && notificationsList.length : notificationsList;
  }

  setViewedNotification(notificationsList, fromGroups) {
    const { dispatch, accessToken } = this.props;

    setViewedNotificationAction(dispatch, accessToken, notificationsList, fromGroups);
  }

  profTab () {
    const {
      user: {profDetails},
      userType,
      demo,
    } = this.props;

    const admin = userType.find(role =>  role.code === 'admin');

    const professionalRole = "professional";

    let tabs = [
      {
        title: I18n.t('general.header.events'),
        tabSupliments: this.getTabNotifications("professional", "events", true),
        content: (
          <EventsList
            role={professionalRole}
            notificationsList={this.getTabNotifications("professional", "events")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        )
      },
      {
        title: I18n.t('general.header.products'),
        tabSupliments: this.getTabNotifications("professional", "products", true),
        content: (
          <ProductsList
            role={professionalRole}
            notificationsList={this.getTabNotifications("professional", "products")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        ),
      },
      {
        title: I18n.t('general.header.posts'),
        tabSupliments: this.getTabNotifications("professional", "blog", true),
        content: (
          <PostsList
            role={professionalRole}
            notificationsList={this.getTabNotifications("professional", "blog")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        ),
      },
      {
        title: I18n.t('general.header.places'),
        content: (
          <PlacesList prosId={profDetails.id} />
        ),
      },
    ];

    if (!!admin || !demo) {
      tabs.splice(
        1,0,
        {
          title: I18n.t('general.header.groups'),
          tabSupliments: this.getTabNotifications("professional", "groups", true),
          content: (
            <GroupsList
              role={professionalRole}
              notificationsList={this.getTabNotifications("professional", "groups")}
              setViewedNotification={(list) => this.setViewedNotification(list, true)}
            />
          ),
        },
      )
    }

    return tabs
  }

  agentTab () {
    const {
      user: {placeDetails},
      userType,
      demo,
    } = this.props;

    const admin = userType.find(role =>  role.code === 'admin');

    const placeRole = "place";

    let tabs = [
      {
        title: I18n.t('general.header.events'),
        tabSupliments: this.getTabNotifications("place", "events", true),
        content: (
          <EventsList
            role={placeRole}
            notificationsList={this.getTabNotifications("place", "events")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        ),
      },
      {
        title: I18n.t('general.header.products'),
        tabSupliments: this.getTabNotifications("place", "products", true),
        content: (
          <ProductsList
            role={placeRole}
            notificationsList={this.getTabNotifications("place", "products")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        ),
      },
      {
        title: I18n.t('general.header.posts'),
        tabSupliments: this.getTabNotifications("place", "blog", true),
        content: (
          <PostsList
            role={placeRole}
            notificationsList={this.getTabNotifications("place", "blog")}
            setViewedNotification={(list) => this.setViewedNotification(list)}
          />
        ),
      },
      {
        title: I18n.t('general.header.professionals'),
        content: (
          <ProfessionalsList placeId={placeDetails.id} />
        ),
      },
      {
        title: I18n.t('agent.branches'),
        content: (
          <BranchesList
            role={placeRole}
            branchesList={placeDetails.branches}
            name={placeDetails.name}
          />
        )
      },
    ];

    if (!!admin || !demo) {
      tabs.splice(
        1,0,
        {
          title: I18n.t('general.header.groups'),
          tabSupliments: this.getTabNotifications("place", "groups", true),
          content: (
            <GroupsList
              role={placeRole}
              notificationsList={this.getTabNotifications("place", "groups")}
              setViewedNotification={(list) => this.setViewedNotification(list, true)}
            />
          ),
        },
      )
    }

    if (placeDetails.calendar.status) {
      tabs.push(
        {
          title: I18n.t('general.agent.calendar'),
          content: (
              <Calendar
                calendarPlace={placeDetails.calendar}
              />
          ),
        },
      )
    }
    return tabs
  } 

  adminTab () {
    const {
      userType,
    } = this.props;

    const admin = userType.find(role =>  role.code === 'admin');

    return  [
      {
        title: I18n.t('general.header.events'),
        tabSupliments: this.getTabNotifications("place", "events", true),
        content: (
          <EventsList
            role={admin.code}
          />
        ),
      },
      {
        title: I18n.t('general.header.groups'),
        tabSupliments: this.getTabNotifications("member", "groups", true),
        content: (
          <GroupsList
            role={admin ? "admin" : "member"}
            notificationsList={this.getTabNotifications("member", "groups")}
            setViewedNotification={(list) => this.setViewedNotification(list, true)}
          />
        ),
      },
      {
        title: I18n.t('general.header.products'),
        tabSupliments: this.getTabNotifications("place", "products", true),
        content: (
          <ProductsList
            role={admin.code}
          />
        ),
      },
      {
        title: I18n.t('general.header.posts'),
        tabSupliments: this.getTabNotifications("place", "blog", true),
        content: (
          <PostsList
            role={admin.code}
          />
        ),
      },
    ];
  }

  memberTab () {
    const {
      demo,
      userType
    } = this.props;

    let tabs = [];

    const member = userType.find(role =>  role.code === 'member');

    if (!demo) {
      tabs.push(
        {
          title: I18n.t('general.header.groups'),
          tabSupliments: this.getTabNotifications("member", "groups", true),
          content: (
            <GroupsList
              role={member.code}
              notificationsList={this.getTabNotifications("member", "groups")}
              setViewedNotification={(list) => this.setViewedNotification(list, true)}
            />
          ),
        },
      )
    }

    return tabs
  }

  rolesTab () {
    const {
      UIVersion,
      user: {roles},
      userType,
      demo,
      user,
    } = this.props;

    const {
      activeTabItemIndexProf,
      activeTabItemIndexAgent,
      activeTabItemIndexAdmin,
      notifications,
    } = this.state;

    const admin = userType.find(role =>  role.code === 'admin');

    let tabs = [];

    if (roles.find(data => data.code === 'admin')) {
      tabs.push(
        {
          title: I18n.t('general.header.admin'),
          content: (
            <div>
              <User
                admin={admin}
                demo={demo}
              />
              {
                UIVersion !== MOBILE_VERSION &&(
                  <Tabs
                    items={this.adminTab()}
                    activeItemIndex={activeTabItemIndexAdmin}
                    onChange={(activeTabItemIndexAdmin) => {
                      this.setState({
                        activeTabItemIndexAdmin,
                      });
                    }}
                  />
                )
              }
            </div>
          ),
          code: 'member'
        },
      )
    }

    if (roles.find(data => data.code === 'member') && !user.hide) {
      tabs.push(
        {
          title: I18n.t('general.header.member'),
          content: (
            <div>
              <User
                admin={admin}
                demo={demo}
              />
              {
                UIVersion !== MOBILE_VERSION &&(
                  <Tabs
                    items={this.memberTab()}
                    activeItemIndex={0}
                    onChange={() => {}}
                  />
                )
              }
            </div>
          ),
          code: 'member'
        },
      )
    }

    if(roles.find(data => data.code === 'professional') && !user.profDetails.hide) {
      tabs.push(
        {
          title: I18n.t('general.header.professional'),
          content: (
            <div>
              <Professional
                admin={admin}
                demo={demo}
              />
              {
                UIVersion !== MOBILE_VERSION &&(
                  <div>
                    {
                      (notifications &&(
                        <Tabs
                          items={this.profTab()}
                          activeItemIndex={activeTabItemIndexProf}
                          onChange={(activeTabItemIndexProf) => {
                            this.setState({
                              activeTabItemIndexProf,
                            });
                          }}
                        />
                      )) || (
                        <Loader contrast sm />
                      )
                    }
                  </div>
                )
              }
            </div>
          ),
          code: 'professional'
        }
      )
    }

    if (roles.find(data => data.code === 'place') && !user.placeDetails.hide) {
      tabs.push(
        {
          title: I18n.t('general.header.place'),
          content: (
            <div>
              <Place
                admin={admin}
                demo={demo}
              />
              {
                UIVersion !== MOBILE_VERSION &&(
                  <div  className={s.placesTabs}>
                    <div>
                      {
                        (notifications &&(
                          <Tabs
                            items={this.agentTab()}
                            activeItemIndex={activeTabItemIndexAgent}
                            onChange={(activeTabItemIndexAgent) => {
                              this.setState({
                                activeTabItemIndexAgent,
                              });
                            }}
                          />
                        )) || (
                          <Loader contrast sm />
                        )
                      }
                    </div>

                    {
                      !user.placeDetails.calendar.status &&(
                        <div className={s.add}>
                          <span className="icon-plus" />
                          <div className={s.redirect}>
                            <div onClick={() =>
                              this.shareCalendar(true)
                            }>
                              {I18n.t('general.agent.calendar')}
                            </div>
                          </div>
                        </div>
                      )
                    }

                  </div>
                )
              }
            </div>
          ),
          code: 'place'
        },
      )
    }

    if (user.profPending === 'pending') {
      tabs.push(
        {
          title: I18n.t('general.header.professional'),
          content: (
            <div />
          ),
          code: 'professional'
        }
      )
    }

    if (user.placePending === 'pending') {
      tabs.push(
        {
          title: I18n.t('general.header.place'),
          content: (
            <div />
          ),
          code: 'place'
        },
      )
    }

    return tabs
  }

  shareCalendar(statusCalendar) {
    const {
      dispatch,
      accessToken
    } = this.props;

    dispatch(
      fetchAuthorizedApiRequest(
        `/v1/places/calendar/change-status`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          body: appendToFormData(
            new FormData(),
            {
              status: statusCalendar
            }
          )
        }
      )
    )
      .then(response => {
        switch (response.status) {
          case 200:

            return Promise.resolve();

          default:

            return Promise.reject(
              new SilencedError('Failed to set calendar.')
            );
        }
      })
      .then(() => {
        window.location.reload();
      })
  }

  render() {
    const {
      UIVersion,
      confirmed,
      location,
    } = this.props;

    const {
      activeTabItemIndex,
    } = this.state;

    return (
      <Layout
        hasSidebar
        hasAds
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div style={UIVersion === MOBILE_VERSION ? null : {padding: 15}}>
          <div>
            {
              !confirmed && (
                <div className={s.confirm}>
                  {I18n.t('general.components.accountConfirmPopover')}
                </div>
              )
            }
          </div>

          <Tabs
            add
            isMobile={UIVersion === MOBILE_VERSION}
            items={this.rolesTab()}
            activeItemIndex={activeTabItemIndex}
            historyRole={location.state ? location.state.activeTabRole : null}
            onChange={(activeTabItemIndex) => {
              this.setState({
                activeTabItemIndex,
              });
            }}
          />

        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    UIVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    user: state.user,
    confirmed: state.user.confirmed,
    restNotificationsList: state.notifications.rest,
    groupsNotificationsList: state.notifications.forGroups,
    socialMediaTypes: state.socialMediaTypes.list,
    userType: state.user.roles,
    demo: state.app.demo,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EditProfile)));
