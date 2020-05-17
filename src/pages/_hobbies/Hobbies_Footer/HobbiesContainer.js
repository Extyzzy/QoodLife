import React, { Component } from "react";
import {connect} from "react-redux";
import { withRouter } from 'react-router';
import classes from "classnames";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from './Hobbies.scss';
import Layout from '../../../components/_layout/Layout';
import Buttons from './Buttons';
import Loader from '../../../components/Loader';
import HobbiesContainerMobile from './HobbiesContainerMobile';
import {
  clearSelectedSidebarCategory,
  setSelectedSidebarCategory, setSelectedSidebarHobby,
} from "../../../actions/navigation";
import {I18n} from "react-redux-i18n";
import {fetchAuthorizedApiRequest} from "../../../fetch";
import {SilencedError} from "../../../exceptions/errors";
import { DESKTOP_VERSION } from '../../../actions/app';

class CategoriesContainer extends Component {
  constructor() {
    super();
    this.state = {
      category: null,
      hobbySecound: null,
      allHobbies: null,
    }
  }

  componentDidMount() {
    const {
      accessToken,
      dispatch
    } = this.props;
    const localStorageLang = localStorage.getItem('USER_LANGUAGE');

    this.fetchAllHobbies = dispatch(
        fetchAuthorizedApiRequest(`/v1/hobbies?category=all&lang=${localStorageLang ? localStorageLang : 'en'}`, {
      ...(accessToken ? {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      } : {})
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
          allHobbies: data.list,
        });
        return Promise.resolve();
      });
  }

  componentWillUnmount() {
    if (this.fetchAllHobbies instanceof Promise) {
      this.fetchAllHobbies.cancel();
    }
  }

  render() {
    const {
      hobbySecound,
      allHobbies,
    } = this.state;

    const {
      dispatch,
      selectedCategory,
      history,
      childrenHobbies,
      userHobbies,
      userChildren,
      isAuthenticated,
      uiVersion
    } = this.props;

    if ( ! allHobbies ) {
      return (
        <Loader />
      );
    }

    const hobbies = allHobbies.filter(data => data.category.id === selectedCategory);
    const hobby = hobbies.length ? hobbies[0] : null;

    const footerContainer =
      uiVersion === DESKTOP_VERSION ? (
        <Layout
          hasAds
          hasSidebar
          removeAllGroup
          contentHasBackground
      >
        <div className={s.root}>
          <div>
            <span className={s.title}>{I18n.t('general.footer.hobbiesPage.category')}</span>
            <ul>
              {
                allHobbies.map(data => {
                  const active = data.category.id === selectedCategory ||
                    (
                      data.children && !!data.children.filter(e =>
                        e.category.id === selectedCategory
                      ).length
                    );

                  return (
                    <li className={classes({
                      [s.open]: data.category.id === selectedCategory
                    })}
                    onClick={() => {
                      this.setState({
                        hobbySecound: null,
                      });
                      dispatch(
                        active
                          ? clearSelectedSidebarCategory()
                          : setSelectedSidebarCategory(data.category.id)
                      )}}
                      key={data.category.id}
                    >
                      {data.category.name}
                    </li>
                  )
                })
              }
            </ul>
          </div>

          {
            hobby && hobby.hobbies &&(
              <div>
                <span className={s.title}>{I18n.t('general.footer.hobbiesPage.hobbies')}</span>
                <ul>
                  {
                    hobby.hobbies.map(data => {
                      const hobbiesOrigin = data.for_children
                        ? childrenHobbies
                        : userHobbies;

                      const isActive = !!hobbiesOrigin && !!hobbiesOrigin.length
                        && !!hobbiesOrigin.find(({id}) => id === data.id);


                      return (
                        <li key={data.id}>

                             <i className={classes(
                              "glyphicon glyphicon glyphicon-chevron-right",
                              s.arrow
                            )} />

                          {
                            data.can_be_favorite && (
                              <Buttons
                                isActive={isActive}
                                hobby={data}
                              />
                            )
                          }

                          <span onClick={() => {
                            if (!isAuthenticated  && data.is_for_18) {
                              return history.push('/login');
                            }

                            dispatch(setSelectedSidebarCategory(hobby.category.id));
                            dispatch(setSelectedSidebarHobby(data.id));
                            history.push('/events')
                          }}>{data.name}</span>

                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            )
          }

          {
            hobby && hobby.children &&(
              <div>
                <span className={s.title}>{I18n.t('general.footer.hobbiesPage.groups')}</span>
                <ul>
                  {
                    hobby.children.map(child => {
                      const active = hobbySecound ? child.category.id === hobbySecound.category.id : false;

                      return (
                        <li className={classes({[s.open]: active})}
                            onClick={() => {
                              this.setState({
                                hobbySecound: child,
                              });
                            }}
                            key={child.category.name}>

                             <i className={classes(
                               "glyphicon glyphicon glyphicon-chevron-right",
                                s.arrow,
                               {[s.open]: active})
                             }  />

                          {child.category.name}
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            )
          }

          {
            hobby && hobby.children && hobbySecound && hobbySecound.hobbies &&(
              <div>
                <span className={s.title}>{I18n.t('general.footer.hobbiesPage.hobbies')}</span>
                <ul>
                  {
                    hobbySecound.hobbies.map(child => {
                      const hobbiesOrigin = hobbySecound.category.for_children
                        ? childrenHobbies
                        : userHobbies;

                      const isActive = !!hobbiesOrigin && !!hobbiesOrigin.length
                        && !!hobbiesOrigin.find(({id}) => id === child.id);

                      return (
                        <li key={child.id}>
                          <span onClick={() => {
                            if (!isAuthenticated  && child.is_for_18) {
                              return history.push('/login');
                            }

                            dispatch(setSelectedSidebarCategory(hobbySecound.category.id));
                            dispatch(setSelectedSidebarHobby(child.id));
                            history.push('/events')
                          }}>{child.name}</span>

                          <i className={classes(
                            "glyphicon glyphicon glyphicon-chevron-right",
                             s.arrow
                          )} />

                            {
                              child.can_be_favorite && (
                                <Buttons
                                  children={userChildren}
                                  isActive={isActive}
                                  hobby={child}
                                />
                              )
                            }
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            )
          }

        </div>
      </Layout>
      ) : <HobbiesContainerMobile />
      return footerContainer;
  }
}

function mapStateToProps(store) {
  return {
    uiVersion: store.app.UIVersion,
    userHobbies: store.user.hobbies || [],
    userChildren: store.auth.isAuthenticated ? !!store.user.children.length : false,
    childrenHobbies: store.auth.isAuthenticated ? store.user.childrenHobbies : null,
    selectedCategory: store.navigation.selectedCategory,
    selectedHobby: store.navigation.selectedHobby,
    accessToken: store.auth.isAuthenticated ? store.auth.accessToken : null,
    isAuthenticated: store.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(CategoriesContainer)));
