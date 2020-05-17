import React, { Component } from "react";
import {connect} from "react-redux";
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./EventsList.scss";
import Loader from '../../../../../components/Loader';
import ComponentsList from "../../../../../components/ComponentsList";
import EventsListItem from "../../../../../pages/_events/Events/components/ListItem";
import { withRouter } from 'react-router';
import {FILTER_OWNED} from "../../../../../helpers/filter";
import {I18n} from 'react-redux-i18n';
import {
  loadMoreEventsUsingStore,
} from "../../../../../actions/events";

import { DESKTOP_VERSION } from '../../../../../actions/app';
import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';
import classes from "classnames";

class EventsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      eventsList,
      user,
      ownerID,
      interval
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(
          accessToken,
          {
            navigation,
            group: FILTER_OWNED,
            __GET: {
              role: 'place',
              expired: 1,
              user: ownerID ? ownerID : user.id,
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: eventsList.length,
              since: {
                until: interval.until,
              },
              until: {
                since: interval.since,
              },
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isMobile,
      isFetching,
      loadingMore,
      couldLoadMore,
      eventsList,
      uiVersion
    } = this.props;

    if (isFetching) {
      return (
        <Loader />
      );
    }

    return (
      <div className={classes({
        [s.root]: uiVersion === DESKTOP_VERSION,
      })}>

        {
           (eventsList && eventsList.length && (
                <ComponentsList
                  list={eventsList}
                  component={EventsListItem}
                  onComponentWillUnmount={
                    this.onListItemComponentWillUnmount
                  }
                  showOwnerDetails={false}
                  actionButtons={this.listItemActionButtons}
                />
              )) || I18n.t('events.eventsNotFound')
        }

        {
          couldLoadMore && !isMobile && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    uiVersion: state.app.UIVersion,
    accessToken: state.auth.accessToken,
    user: state.user,
    isFetching: state.events.isFetching,
    loadingMore: state.events.loadingMore,
    couldLoadMore: state.events.couldLoadMore,
    totalNrOfItems: state.groups.totalNrOfItems,
    eventsList: state.events.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
    promotion: state.app.promotion,
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(EventsList)));
