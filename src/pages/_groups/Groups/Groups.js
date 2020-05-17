import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import { I18n } from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE } from '../../../constants';
import Calendar from '../../../components/Calendar';
import Layout from "../../../components/_layout/Layout/Layout";
import Loader from "../../../components/Loader/Loader";
import ComponentsList from "../../../components/ComponentsList/ComponentsList";
import MobileAdsCarousel from '../../../components/MobileAdsCarousel';
import GroupsListItem from "./components/ListItem";
import classes from 'classnames';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Groups.scss";
import ListItemsFilter from "../../../components/ListItemsFilter";
import {Link} from 'react-router-dom';

class Groups extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    groups: PropTypes.array.isRequired,
    onItemComponentWillUnmount: PropTypes.func,
    onItemPopupComponentWillUnmount: PropTypes.func,
    showItemOwnerDetails: PropTypes.bool,
    itemActionButtons: PropTypes.func,
    itemPopupActionButtons: PropTypes.func,
    showLoadMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
  };

  constructor() {
    super();

    this.state = {
      withDate: false,
    };
  }

  render() {
    const {
      isFetching,
      isLoaded,
      groups,
      groupsHasSince,
      onItemComponentWillUnmount,
      onItemPopupComponentWillUnmount,
      onSetDefaultLocation,
      showItemOwnerDetails,
      itemActionButtons,
      itemPopupActionButtons,
      showLoadMore,
      onLoadMore,
      loadingMore,
      UIVersion,
      changeDistanceRange,
      onGroupsSinceChange,
      distance,
      longitude,
      location,
      isAuthenticated,
    } = this.props;

    const {
      withDate,
    } =this.state;

    const groupsGroups = chunk(groups, DEFAULT_ADS_BLOCKS_FREQUENCE);

    return (
      <Layout
        hasSidebar
        hasAds
        contentHasBackground
      >
        <div className={classes(s.root, {
          [s.mobile]: UIVersion === MOBILE_VERSION,
        })}>
          <div className={s.header}>
            {
              isFetching && (
                <Loader className={s.loader} sm contrast/>
              )
            }
          </div>

          {
            isLoaded && (
              <div>
                {
                  isAuthenticated && (
                    <Calendar />
                  )
                }
                <div className={s.filter}>
                  <ListItemsFilter
                    hasDistanceRange
                    hasSearchBox
                    changeDistanceRange={changeDistanceRange}
                    onCancelLocationchange={onSetDefaultLocation}
                    distance={distance}
                    geolocationIsAllowed={!!longitude}
                    getLocation={location}
                  />

                  <div className={s.buttons}>
                    {
                      (groupsHasSince === 'not-null' && (
                        <button
                          className={s.groupsButton}
                          onClick={() => onGroupsSinceChange('null')}
                          onMouseOver={() => this.setState({ withDate: true })}
                          onMouseOut={() => this.setState({ withDate: false })}
                        >
                          {
                            (withDate &&(
                              I18n.t('groups.withoutDays')
                            )) || (
                              I18n.t('groups.withDays')
                            )
                          }
                        </button>
                      )) || (
                        <button
                          className={s.groupsButton}
                          onClick={() => onGroupsSinceChange('not-null')}
                          onMouseOver={() => this.setState({ withDate: true })}
                          onMouseOut={() => this.setState({ withDate: false })}
                        >
                          {
                            (withDate &&(
                              I18n.t('groups.withDays')
                            )) || (
                              I18n.t('groups.withoutDays')
                            )
                          }
                        </button>
                      )
                    }
                    {
                      isAuthenticated && (
                        <Link
                          to={'/groups/create'}
                          className={s.groupsButtonAdd}
                        >
                          {I18n.t('groups.addGroupButton')}
                        </Link>
                      )
                    }
                  </div>
                </div>
                {
                  (groups && groups.length > 0 && (
                    <div>
                      {
                        groupsGroups.map((group, groupKey) =>
                          <div key={groupKey}>
                            <ComponentsList
                              className={s.groupsList}
                              component={GroupsListItem}
                              list={group}
                              groupHasDate={groupsHasSince}
                              onComponentWillUnmount={
                                onItemComponentWillUnmount
                              }
                              onPopupComponentWillUnmount={
                                onItemPopupComponentWillUnmount
                              }
                              showOwnerDetails={showItemOwnerDetails}
                              actionButtons={itemActionButtons}
                              popupActionButtons={itemPopupActionButtons}
                            />

                            {
                              showLoadMore &&
                              groupKey+1 === groupsGroups.length && (
                                <div className="text-center">
                                  <button
                                    className="btn btn-default"
                                    disabled={loadingMore}
                                    onClick={() => onLoadMore(groupKey)}
                                  >
                                    {
                                      loadingMore
                                      ? I18n.t('general.elements.loading')
                                      : I18n.t('general.elements.loadMore')
                                    }
                                  </button>
                                </div>
                              )
                            }

                            {
                              UIVersion === MOBILE_VERSION &&
                              group.length === DEFAULT_ADS_BLOCKS_FREQUENCE && (
                                <MobileAdsCarousel blockIndex={groupKey} />
                              )
                            }
                          </div>
                        )
                      }
                    </div>
                  )) || I18n.t('groups.groupsNotFound')
                }
              </div>
            )
          }
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    UIVersion: state.app.UIVersion,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Groups));
