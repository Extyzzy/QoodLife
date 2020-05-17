import React, { Component } from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import classes from "classnames";
import {withRouter} from "react-router-dom";
import {
  changeSidebarGroup,
  clearSelectedSidebarHobby,
  setSelectedSidebarHobby,
  clearSelectedSidebarCategory,
  setSelectedSidebarCategory
} from "../../../../actions/navigation";
import s from "./GroupMobile.scss";
import { Scrollbars } from 'react-custom-scrollbars';

class SidebarGroup extends Component {
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
    return window.innerHeight - 380;
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
      selectedCategory,
      selectedHobby,
      title,
      dispatch,
    } = this.props;

    if (list[0] && list[0].category)
      return (
        <div className={classes(s.group, {
          [s.open]: name === sidebarOpenedGroup
        })}>
          <a onClick={() => {
            if (sidebarOpenedGroup !== name) {
              dispatch(changeSidebarGroup(name));
            } else {
              dispatch(clearSelectedSidebarCategory());
            }
          }}>{title}</a>
          <Scrollbars
            autoHeight={sidebarOpenedGroup === 'SIDEBAR_GROUP_ALL'}
            autoHeightMin={0}
            autoHeightMax={this.state.listBlockMaxHeight}
            autoHide={sidebarOpenedGroup === 'SIDEBAR_GROUP_ALL'}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
          <ul className={s.list}>
            {
              list.map(h => {
                const active = h.category.id === selectedCategory
                  || (h.children && !!h.children.filter(e =>
                      e.category.id === selectedCategory
                  ).length);

                const name = h.category.name;
                return (
                  <div key={h.category.id} className={classes({
                    [s.active]: active,
                  }, s.contentHobby)} >
                    <li className={classes({
                      [s.active]: active,
                    }, s.category)} onClick={() => {
                      dispatch(
                        active
                          ? clearSelectedSidebarCategory()
                          : setSelectedSidebarCategory(h.category.id)
                      );
                    }}>{name}</li>
                    <li>
                      <ul>
                        {
                          active && (h.hobbies.length > 0 && h.hobbies.map(child => {
                            const active = child.id === selectedHobby;
                            return (
                              <li key={child.name}
                                  className={classes({[s.active]: active}, s.hobby)}
                                  onClick={() => {
                                    dispatch(
                                      active
                                        ? clearSelectedSidebarHobby()
                                        : setSelectedSidebarHobby(child.id)
                                    );
                                  }}>
                                {child.name}
                              </li>
                            )
                          }))
                        }

                        { active && h.children.length >0 && h.children.map(child => {
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
                              </li>
                              <li className={s.subcategoryHobby}>
                                <ul>
                                  { active && child.hobbies.map(child => {
                                    const active = child.id === selectedHobby;
                                    return (
                                      <div key={child.name}>
                                        <li className={classes({[s.active]: active}, s.hobby)}
                                            onClick={() => {
                                              dispatch(
                                                active
                                                  ? clearSelectedSidebarHobby()
                                                  : setSelectedSidebarHobby(child.id)
                                              );
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
            if (sidebarOpenedGroup !== name) {
              dispatch(changeSidebarGroup(name));
            } else {
              dispatch(clearSelectedSidebarCategory());
            }
          }}>{title}</a>

          <Scrollbars
            autoHeight={sidebarOpenedGroup === 'SIDEBAR_GROUP_RELATED'}
            autoHeightMin={0}
            autoHeightMax={this.state.listBlockMaxHeight}
            autoHide={sidebarOpenedGroup === 'SIDEBAR_GROUP_RELATED'}
            autoHideTimeout={1000}
            autoHideDuration={200}
          >
          <ul className={s.list}>
            {
              list.map(h => {
                const active = h.id === selectedHobby;
                const name = h.name;

                return (
                  <li key={h.id} className={classes({
                    [s.active]: active,
                  },s.category)} onClick={() => {
                    dispatch(
                      active
                        ? clearSelectedSidebarHobby()
                        : setSelectedSidebarHobby(h.id)
                    );
                  }}>{name}</li>
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
    sidebarOpenedGroup: store.navigation.sidebarOpenedGroup,
    selectedHobby: store.navigation.selectedHobby,
    selectedCategory: store.navigation.selectedCategory,
  };
}

SidebarGroup.contextTypes = {
  router: PropTypes.any.isRequired,
};

export default withRouter(connect(mapStateToProps)(withStyles(s)(SidebarGroup)));
