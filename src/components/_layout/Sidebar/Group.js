import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import classes from "classnames";
import {withRouter} from "react-router-dom";
import s from "./Sidebar.scss";
import { Scrollbars } from 'react-custom-scrollbars';
import {I18n} from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../../actions/app';

import {
  changeSidebarGroup,
  clearSelectedSidebarHobby,
  setSelectedSidebarHobby,
  clearSelectedSidebarCategory,
  setSelectedSidebarCategory,
  setSidebarProductFilter,
  clearSidebarProductFilter,
  setSidebarPlacesTitle,
  clearSidebarPlacesTitle,
  setSidebarProsTitle,
  clearSidebarProsTitle,
} from "../../../actions/navigation";

import { switchPlacesActiveStatus } from '../../../actions/places';
import { switchProsActiveStatus } from '../../../actions/professionals';


class SidebarGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      listBlockMaxHeight: this.getListBlockMaxHeight(),
    };

    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  getListBlockMaxHeight() {
    if(this.props.UIVersion !== MOBILE_VERSION) {
      return window.innerHeight
        - 380;
    } else {
      return window.innerHeight
        - 210;
    }
  }

  handleResize(e) {
    this.setState({
      listBlockMaxHeight: this.getListBlockMaxHeight(),
    });
  }

  render() {
    const {
      list,
      name,
      sidebarOpenedGroup,
      dispatch,
      history: {location},
      history,
      title,
      selectedCategory,
      selectedHobby,
      selectedFilter,
      selectedPlaceTitle,
      selectedProsTitle,
      placesAreActive,
      professionalsAreActive,
      isAuthenticated,
      demo,
      sideBar,
      UIVersion,
      filterSideBarProducts,
    } = this.props;

    const placesAndProsPage = location.pathname === "/places-and-pros";

    const alphabeticalSort = (arrayData) => {
      return arrayData.sort((a, b) => {
        return a.name === b.name ? 0 : +(a.name > b.name) || -1;
      })
    };

    if (list && list[0] && list[0].category && sidebarOpenedGroup === name)
      return (
        <div className={classes(
          s.group,
          {[s.open]: name === sidebarOpenedGroup}
        )}>
          <a onClick={() => {
            dispatch(clearSelectedSidebarCategory());

            if (name !== sidebarOpenedGroup) {
              return dispatch(changeSidebarGroup(name));
            }

            if (name === 'SIDEBAR_GROUP_ALL' && !demo) {
              return dispatch(changeSidebarGroup('SIDEBAR_GROUP_RELATED'));
            } else {
              return dispatch(changeSidebarGroup('SIDEBAR_GROUP_ALL'));
            }
          }}>{title}</a>

          <Scrollbars
            autoHeight={true}
            autoHeightMin={0}
            autoHeightMax={this.state.listBlockMaxHeight}
            autoHide={true}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            <ul className={s.list}>
              {
                list.map(h => {
                  const name = h.category.name;
                  const active = h.category.id === selectedCategory ||
                    (
                      h.children && !!h.children.filter(e =>
                        e.category.id === selectedCategory
                      ).length
                    );

                  return (
                    <div
                      key={h.category.id}
                      className={classes(
                        s.contentHobby,
                        {[s.active]: active}
                      )}>
                      <li
                        className={classes(s.category, {[s.active]: active})}
                        onClick={() => {
                          dispatch(
                            active
                              ? clearSelectedSidebarCategory()
                              : setSelectedSidebarCategory(h.category.id)
                          );
                        }}>
                        {name}
                        <i className={classes("icon-angle-down", {[s.left]: !active})} />
                        </li>
                      <li>
                        <ul>
                          {
                            active && (h.hobbies && alphabeticalSort(h.hobbies).map(child => {
                              const active = child.id === selectedHobby;
                              const age = child.ageGroups.find(data => data.startYear === 18);

                                return (
                                    <li key={child.name}
                                        className={classes(
                                          {[s.active]: active}, s.hobby
                                        )}
                                        onClick={() => {
                                          if (!isAuthenticated  && age && age.startYear === 18) {
                                            history.push('/login');
                                          }

                                          dispatch(
                                            active
                                              ? clearSelectedSidebarHobby()
                                              : setSelectedSidebarHobby(child.id)
                                          );

                                          if (UIVersion === MOBILE_VERSION) {
                                            sideBar();
                                          }
                                        }}>
                                      {child.name}
                                    </li>
                                  )
                                }
                              ))
                              }

                          {
                            active && h.children && alphabeticalSort(h.children).map(child => {
                              const active = child.category.id === selectedCategory;
                              return (
                                <div key={child.category.name}>
                                  <li className={classes({[s.active]: active}, s.hobby)}
                                      onClick={() => {
                                        dispatch(
                                          active
                                            ? setSelectedSidebarCategory(h.category.id)
                                            : setSelectedSidebarCategory(child.category.id)
                                        );
                                      }}>
                                    {child.category.name}
                                    <i className={classes("icon-angle-down", {[s.left]: !active})} />
                                  </li>
                                  <li className={s.subcategoryHobby}>
                                    <ul>
                                      { active && alphabeticalSort(child.hobbies).map(child => {
                                        const active = child.id === selectedHobby;
                                        return (
                                          <div key={child.name}>
                                            <li className={classes(
                                              {[s.active]: active},
                                              s.hobby
                                            )}
                                                onClick={() => {
                                                  dispatch(
                                                    active
                                                      ? clearSelectedSidebarHobby()
                                                      : setSelectedSidebarHobby(child.id)
                                                  );
                                                  if (UIVersion === MOBILE_VERSION) {
                                                    sideBar();
                                                  }
                                                }}>
                                              {child.name}
                                            </li>
                                          </div>
                                        )
                                      })
                                      }
                                    </ul>
                                  </li>
                                </div>
                              )
                            })
                          }
                        </ul>
                      </li>
                    </div>
                  );
                })
              }
            </ul>
          </Scrollbars>
        </div>
      );

    else
      return (
        <div className={classes(s.group, {
          [s.open]: name === sidebarOpenedGroup
        })}>
          <a onClick={() => {
            dispatch(clearSelectedSidebarCategory());

            if (name !== sidebarOpenedGroup) {
             return dispatch(changeSidebarGroup(name));
            }

            if (name === 'SIDEBAR_GROUP_ALL') {
              return dispatch(changeSidebarGroup('SIDEBAR_GROUP_RELATED'));
            } else {
              return dispatch(changeSidebarGroup('SIDEBAR_GROUP_ALL'));
            }
          }}>{title}</a>

          <Scrollbars
            autoHeight={sidebarOpenedGroup === 'SIDEBAR_GROUP_RELATED' || sidebarOpenedGroup === 'SIDEBAR_GROUP_FOR_CHILDRENS'}
            autoHeightMin={0}
            autoHeightMax={250}
            autoHide={sidebarOpenedGroup === 'SIDEBAR_GROUP_RELATED' || sidebarOpenedGroup === 'SIDEBAR_GROUP_FOR_CHILDRENS'}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
            <ul className={s.list}>
              {
                sidebarOpenedGroup === name && alphabeticalSort(list).map((h, m) => {
                  const active = h.id === selectedHobby;
                  const name = h.name;

                  return (
                    <li key={m}>
                      <p
                        className={classes(
                          s.category,
                          {[s.active]: active}
                        )}
                        onClick={() => {
                          dispatch(
                            active
                              ? clearSelectedSidebarHobby()
                              : setSelectedSidebarHobby(h.id)
                          );
                          dispatch(switchPlacesActiveStatus(true));
                          dispatch(switchProsActiveStatus(true));
                          if (UIVersion === MOBILE_VERSION) {
                            sideBar();
                          }
                        }}
                      >{name}</p>
                      {
                        active && (
                          (placesAndProsPage && (
                            <ul className={s.placesAndProsOptions}>
                              <li
                                className={classes({[s.active]: placesAreActive})}
                                onClick={() => {
                                  dispatch(switchPlacesActiveStatus(true));
                                  dispatch(switchProsActiveStatus(false));
                                }}
                              >
                                {I18n.t('general.header.places')}
                                <i className={classes("icon-angle-down", {[s.left]: !placesAreActive})} />
                              </li>
                              {
                                 placesAreActive && (
                                   !!h.titles.place.length && (
                                     <ul>
                                       {
                                         alphabeticalSort(h.titles.place).map((t, index) =>
                                           <li
                                             key={index}
                                             className={classes(
                                               {[s.active]: t.id === selectedPlaceTitle}
                                             )}
                                             onClick={() => {
                                               if(selectedPlaceTitle === t.id){
                                                 dispatch(
                                                   clearSidebarPlacesTitle()
                                                 );
                                               } else {
                                                 dispatch(
                                                   setSidebarPlacesTitle(t.id)
                                                 );
                                               }
                                               if (UIVersion === MOBILE_VERSION) {
                                                 sideBar();
                                               }
                                             }}
                                           >{t.name}</li>
                                         )
                                       }
                                     </ul>
                                   )
                                )
                              }
                              <li
                                className={classes({[s.active]: professionalsAreActive})}
                                onClick={() => {
                                  dispatch(switchPlacesActiveStatus(false));
                                  dispatch(switchProsActiveStatus(true));
                                }}
                              >
                                {I18n.t('general.header.professionals')}
                                <i className={classes("icon-angle-down", {[s.left]: !professionalsAreActive})} />
                              </li>
                              {
                                professionalsAreActive && (
                                  !!h.titles.professional.length && (
                                    <ul>
                                      {
                                        alphabeticalSort(h.titles.professional).map((t, index) =>
                                          <li
                                            key={index}
                                            className={classes(
                                              {[s.active]: t.id === selectedProsTitle}
                                            )}
                                            onClick={() => {
                                              if(selectedProsTitle === t.id){
                                                dispatch(
                                                  clearSidebarProsTitle()
                                                );
                                              } else {
                                                dispatch(
                                                  setSidebarProsTitle(t.id)
                                                );
                                              }
                                              if (UIVersion === MOBILE_VERSION) {
                                                sideBar();
                                              }
                                            }}
                                          >{t.name}</li>
                                        )
                                      }
                                    </ul>
                                  )
                                )
                              }
                            </ul>
                          )) || (
                            filterSideBarProducts && (
                              !!h.filters.length && (
                                <ul className={s.placesAndProsOptions}>
                                  {
                                    alphabeticalSort(h.filters).map(({name, id: filterId}) =>
                                      <li
                                        className={classes(
                                          {[s.active]: selectedFilter === filterId})
                                        }
                                        key={filterId}
                                        onClick={() => {
                                          if(selectedFilter === filterId){
                                            dispatch(
                                              clearSidebarProductFilter()
                                            );
                                          } else {
                                            dispatch(
                                              setSidebarProductFilter(filterId)
                                            );
                                          }
                                          if (UIVersion === MOBILE_VERSION) {
                                            sideBar();
                                          }
                                        }}
                                      >
                                        {name}
                                      </li>
                                    )
                                  }
                                </ul>
                              )
                            )
                          )
                        )
                      }
                    </li>
                  );
                })
              }
            </ul>
          </Scrollbars>
        </div>
      );
  };
}

function mapStateToProps(store) {
  return {
    placesAreActive: store.places.active,
    filterSideBarProducts: store.products.filterSideBar,
    professionalsAreActive: store.professionals.active,
    sidebarOpenedGroup: store.navigation.sidebarOpenedGroup,
    selectedHobby: store.navigation.selectedHobby,
    selectedFilter: store.navigation.selectedFilter,
    selectedPlaceTitle: store.navigation.selectedPlaceTitle,
    selectedProsTitle: store.navigation.selectedProsTitle,
    selectedCategory: store.navigation.selectedCategory,
    UIVersion: store.app.UIVersion,
    isAuthenticated: store.auth.isAuthenticated,
    demo: store.app.demo,
  };
}

SidebarGroup.contextTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(s)(SidebarGroup)));
