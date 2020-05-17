import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HobbiesMobile.scss';
import Layout from '../../../components/_layout/Layout';
import Buttons from './Buttons';
import Loader from '../../../components/Loader';
import {
  clearSelectedSidebarCategory,
  setSelectedSidebarCategory,
  setSelectedSidebarHobby
} from '../../../actions/navigation';
import { I18n } from 'react-redux-i18n';
import { fetchAuthorizedApiRequest } from '../../../fetch';
import { SilencedError } from '../../../exceptions/errors';

class HobbiesContainerMobile extends Component {
  constructor() {
    super();
    this.state = {
      category: null,
      hobbySecound: null,
      allHobbies: null,
      categoryRoute: true,
      groupsRoute: false,
      hobbiesRoute: false
    };
  }

  componentDidMount() {
    const { accessToken, dispatch } = this.props;
    const localStorageLang = localStorage.getItem('USER_LANGUAGE');

    dispatch(clearSelectedSidebarCategory());

    this.fetchAllHobbies = dispatch(
      fetchAuthorizedApiRequest(`/v1/hobbies?category=all&lang=${localStorageLang ? localStorageLang : 'en'}`, {
        ...(accessToken
          ? {
              headers: {
                Authorization: `Bearer ${accessToken}`
              }
            }
          : {})
      })
    );

    this.fetchAllHobbies
      .then(response => {
        switch (response.status) {
          case 200:
            return response.json();
          default:
            return Promise.reject(
              new SilencedError('Failed to fetch all hobbies.')
            );
        }
      })
      .then(data => {
        this.setState({
          allHobbies: data.list
        });
        return Promise.resolve();
      });
  }

  componentWillUnmount() {
    if (this.fetchAllHobbies instanceof Promise) {
      this.fetchAllHobbies.cancel();
    }
  }

  updateRouteCategory = () => {
    this.props.dispatch(clearSelectedSidebarCategory());
    this.setState({
      categoryRoute: true,
      groupsRoute: false,
      hobbiesRoute: false
    });
  };

  updateRouteGroups = () => {
    this.setState({
      categoryRoute: false,
      groupsRoute: true,
      hobbiesRoute: false
    });
  };

  updateRouteHobbies = () => {
    this.setState({
      categoryRoute: false,
      groupsRoute: false,
      hobbiesRoute: true
    });
  };

  render() {
    const {
      hobbySecound,
      allHobbies,
      categoryRoute,
      groupsRoute,
      hobbiesRoute
    } = this.state;

    const {
      dispatch,
      selectedCategory,
      history,
      childrenHobbies,
      userHobbies,
      userChildren,
      isAuthenticated
    } = this.props;

    if (!allHobbies) {
      return <Loader />;
    }

    const hobbies = allHobbies.filter(
      data => data.category.id === selectedCategory
    );
    const hobby = hobbies.length ? hobbies[0] : null;

    return (
      <Layout removeAllGroup contentHasBackground>
        <div className={s.root}>
          <div className={s.dataContainer}>
            {categoryRoute && (
              <span className={s.title} onClick={this.updateRouteCategory}>
                {I18n.t('general.footer.hobbies')}
              </span>
            )}
            {groupsRoute && (
              <div>
                <span className={s.title} onClick={this.updateRouteCategory}>
                  {I18n.t('general.footer.hobbies')}
                </span>
                <i className="icon-angle-down" />
                <span className={s.title} onClick={this.updateRouteGroups}>
                  {hobby.category.name}
                </span>
              </div>
            )}
            {hobbiesRoute && (
              <div>
                <span className={s.title} onClick={this.updateRouteCategory}>
                  {I18n.t('general.footer.hobbies')}
                </span>
                <i className="icon-angle-down" />
                <span className={s.title} onClick={this.updateRouteGroups}>
                  {hobby.category.name}
                </span>
                <i className="icon-angle-down" />
                <span className={s.title} onClick={this.updateRouteHobbies}>
                  {hobbySecound.category.name}
                </span>
              </div>
            )}
            {categoryRoute && (
              <ul>
                {allHobbies.map(data => {
                  const active =
                    data.category.id === selectedCategory ||
                    (data.children &&
                      !!data.children.filter(
                        e => e.category.id === selectedCategory
                      ).length);

                  return (
                    <li
                      className={classes({
                        [s.open]: data.category.id === selectedCategory
                      })}
                      onClick={() => {
                        this.setState({
                          hobbySecound: null,
                          categoryRoute: false,
                          groupsRoute: true
                        });
                        dispatch(
                          active
                            ? clearSelectedSidebarCategory()
                            : setSelectedSidebarCategory(data.category.id)
                        );
                      }}
                      key={data.category.id}
                    >
                      {data.category.name}
                    </li>
                  );
                })}
              </ul>
            )}
            {groupsRoute &&
              (hobby && hobby.hobbies && (
                <div>
                  <ul>
                    {hobby.hobbies.map(data => {
                      const hobbiesOrigin = data.for_children
                        ? childrenHobbies
                        : userHobbies;

                      const isActive =
                        !!hobbiesOrigin &&
                        !!hobbiesOrigin.length &&
                        !!hobbiesOrigin.find(({ id }) => id === data.id);

                      return (
                        <li key={data.id}>
                          {data.can_be_favorite && (
                            <Buttons isActive={isActive} hobby={data} />
                          )}

                          <span
                            onClick={() => {
                              if (!isAuthenticated && data.is_for_18) {
                                return history.push('/login');
                              }

                              dispatch(
                                setSelectedSidebarCategory(hobby.category.id)
                              );
                              dispatch(setSelectedSidebarHobby(data.id));
                              history.push('/events');
                            }}
                          >
                            {data.name}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            {groupsRoute &&
              (hobby && hobby.children && (
                <div>
                  <ul>
                    {hobby.children.map(child => {
                      const active = hobbySecound
                        ? child.category.id === hobbySecound.category.id
                        : false;

                      return (
                        <li
                          className={classes({ [s.open]: active })}
                          onClick={() => {
                            this.setState({
                              hobbySecound: child,
                              hobbiesRoute: true,
                              groupsRoute: false
                            });
                          }}
                          key={child.category.name}
                        >
                          {child.category.name}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            {hobbiesRoute &&
              (hobby &&
                hobby.children &&
                hobbySecound &&
                hobbySecound.hobbies && (
                  <div>
                    <ul>
                      {hobbySecound.hobbies.map(child => {
                        const hobbiesOrigin = hobbySecound.category.for_children
                          ? childrenHobbies
                          : userHobbies;

                        const isActive =
                          !!hobbiesOrigin &&
                          !!hobbiesOrigin.length &&
                          !!hobbiesOrigin.find(({ id }) => id === child.id);

                        return (
                          <li key={child.id}>
                            <span
                              onClick={() => {
                                if (!isAuthenticated && child.is_for_18) {
                                  return history.push('/login');
                                }

                                dispatch(
                                  setSelectedSidebarCategory(
                                    hobbySecound.category.id
                                  )
                                );
                                dispatch(setSelectedSidebarHobby(child.id));
                                history.push('/events');
                              }}
                            >
                              {child.name}
                            </span>

                            {child.can_be_favorite && (
                              <Buttons
                                children={userChildren}
                                isActive={isActive}
                                hobby={child}
                              />
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
          </div>
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    userHobbies: store.user.hobbies || [],
    userChildren: store.auth.isAuthenticated
      ? !!store.user.children.length
      : false,
    childrenHobbies: store.auth.isAuthenticated
      ? store.user.childrenHobbies
      : null,
    selectedCategory: store.navigation.selectedCategory,
    selectedHobby: store.navigation.selectedHobby,
    accessToken: store.auth.isAuthenticated ? store.auth.accessToken : null,
    isAuthenticated: store.auth.isAuthenticated
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(s)(HobbiesContainerMobile))
);
