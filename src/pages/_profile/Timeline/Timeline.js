import React, { Component } from "react";
import { connect } from "react-redux";
import {I18n} from "react-redux-i18n";
import {detachHobby, receivedetachHobby} from "../../../actions/hobbies";
import {confirm} from "../../../components/_popup/Confirm";
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Timeline.scss';
import Layout from '../../../components/_layout/Layout';
import TimelineListItem from './components/ListItem';
import Loader from '../../../components/Loader';
import {
  timeline,
  clearTimeline,
  clearTimelineData,
  setCouldLoadMore
} from '../../../actions/timeline';

import {
  changeSidebarGroup,
  clearSelectedSidebarHobby,
  setSelectedSidebarHobby,
  SIDEBAR_GROUP_RELATED,
  SIDEBAR_GROUP_FOR_CHILDRENS,
} from "../../../actions/navigation";
import {isEqual} from "lodash";

class Timeline extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      openedListItem: null,
      removeHobbyToUser: false,
      time: null,
      scroll: 0,
      scrollDirection: null,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onScrollDetecting = this.onScrollDetecting.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(
      clearTimeline()
    );
  }

  componentDidMount() {
    const {
      dispatch,
      accessToken,
    } = this.props;
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('scroll', this.onScrollDetecting);

    dispatch(
      clearTimelineData()
    );

    dispatch(
      changeSidebarGroup(SIDEBAR_GROUP_RELATED)
    );

    dispatch(
      timeline(accessToken)
    )
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const {navigation: nextNavigation} = nextProps;

    if (!isEqual(navigation, nextNavigation) && navigation.sidebarOpenedGroup !== nextNavigation.sidebarOpenedGroup) {
      dispatch(
        timeline(
          accessToken,
          nextNavigation.sidebarOpenedGroup === SIDEBAR_GROUP_FOR_CHILDRENS
        )
      )
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('scroll', this.onScrollDetecting);
    if (this.Fetcher instanceof Promise) {
      this.Fetcher.cancel();
    }
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if(scrollTop !== 0) {
      this.setState({scroll: scrollTop});
    }
  }

  onScrollDetecting() {
    const {
      lastScrollPosition,
    } = this.state;

    window.onscroll = function() {
      let newScrollPosition = window.pageYOffset || document.documentElement.scrollTop;

      if (newScrollPosition < lastScrollPosition) {
        this.setState({scrollDirection: 'up'});
      } else {
        this.setState({scrollDirection: 'down'});
      }

      this.setState({lastScrollPosition: newScrollPosition});

    }.bind(this)
  }

  render() {
    const {
      openedListItem,
      removeHobbyToUser,
      time,
      scroll,
      scrollDirection,
      scrollLocation,
    } = this.state;

    const {
      accessToken,
      dispatch,
      timeline,
      user,
      isFetching,
      UIVersion,
      navigation,
    } = this.props;

    const setDatabyNavigation = timeline.filter(data => navigation.selectedHobby === data.hobby.id)[0];

    const newData = setDatabyNavigation ?  [setDatabyNavigation] : timeline;

    return (
      <Layout
        hasSidebar
        hasAds
        removeAllGroup
        whichSidebar='My Profile'
        contentHasBackground
      >
        {
          (isFetching &&(
            <Loader sm contrast />
          )) || (
            <div className={s.root}>
              {
                newData.length ? newData.map(data => {

                  const { id: hobbyId } = data.hobby;
                  let isOpened = navigation.selectedHobby === hobbyId;
                  return (
                    <TimelineListItem
                      key={hobbyId}
                      openedListItem={openedListItem}
                      time={time}
                      scrollDirection={scrollDirection}
                      scroll={scroll}
                      isOpened={isOpened}
                      couldLoadMore={() => {
                        dispatch(setCouldLoadMore())
                      }}
                      onClose={() => {
                        dispatch(clearSelectedSidebarHobby());
                        dispatch(setCouldLoadMore());
                        this.setState({
                          openedListItem: isOpened ? null : hobbyId,
                          scrollLocation: scroll,
                        });
                        if (openedListItem === hobbyId) {
                          window.scrollTo(0, scrollLocation);
                        }
                      }}
                      onToggle={() => {
                        dispatch(setSelectedSidebarHobby(hobbyId))

                        this.setState({
                            openedListItem: isOpened ? null : hobbyId,
                            scrollLocation: scroll,
                          } , () => {
                            window.scrollTo(0, 0);
                          }
                          //   for transition, need check again this method, it's not work
                          // , () => {
                          //   if (openedListItem !== hobbyId) {
                          //     setTimeout(function() { this.setState({time: true}); }.bind(this), 500);
                          //     window.scrollTo(0, 0);
                          //   } else {
                          //     this.setState({time: false});
                          //   }
                          // }
                        );
                        if (openedListItem === hobbyId) {
                          window.scrollTo(0, scrollLocation);
                        }

                      }}
                      onDetach={() => {
                        confirm(I18n.t('profile.timeline.detachHobbyConfirm')).then(() => {
                          if (!removeHobbyToUser) {

                            this.setState({
                              removeHobbyToUser: true,
                            }, () => {

                              this.removeFetcher = dispatch(
                                detachHobby(
                                  accessToken,
                                  data.hobby
                                )
                              );

                              this.removeFetcher
                                .then(() => {
                                  this.setState({
                                    removeHobbyToUser: false,
                                  }, () => {
                                    dispatch(
                                      receivedetachHobby(
                                        data.hobby,
                                        user
                                      )
                                    );
                                  });
                                });
                            });
                          }
                        });
                      }}
                      data={data}
                      UIVersion={UIVersion}
                    />
                  );
                }) : I18n.t('profile.timeline.notFound')
              }
            </div>
          )
        }
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    accessToken: store.auth.accessToken,
    timeline: store.timeline.list,
    isFetching: store.timeline.isFetching,
    data: store.timeline.data,
    user: store.user,
    UIVersion: store.app.UIVersion,
    navigation: store.navigation,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Timeline));
