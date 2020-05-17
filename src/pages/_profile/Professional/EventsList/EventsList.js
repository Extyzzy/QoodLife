import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './EventsList.scss';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { FILTER_OWNED } from '../../../../helpers/filter';
import {
  fetchEventsWithStore,
  loadMoreEventsUsingStore
} from '../../../../actions/events';
import ComponentsList from '../../../../components/ComponentsList/ComponentsList';
import Loader from '../../../../components/Loader';
import EventsListItem from '../../../../pages/_events/Events/components/ListItem';
import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../constants';

class EventsList extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false
    };

    this.createdAt = moment().utcOffset(0);
    this.loadMore = this.loadMore.bind(this);
  }

  componentDidMount() {
    this.fetchEventsList();
  }

  componentWillUnmount() {
    if (this.fetchEventsListFetcher instanceof Promise) {
      this.fetchEventsListFetcher.cancel();
    }
  }

  fetchEventsList() {
    const { dispatch, accessToken, navigation } = this.props;

    this.fetchEventsListFetcher = dispatch(
      fetchEventsWithStore(accessToken, {
        navigation,
        group: FILTER_OWNED,
        __GET: {
          take: DEFAULT_NOF_RECORDS_PER_PAGE,
          role: 'professional'
        }
      })
    );
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      eventsList
    } = this.props;

    if (!loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(accessToken, {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            before: this.createdAt.unix(),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            skip: eventsList.length,
            role: 'professional'
          }
        })
      );
    }
  }

  render() {
    const { eventsList, isFetching, loadingMore, couldLoadMore } = this.props;
    if (isFetching) {
      return <Loader />;
    }

    return (
      <div>
        {(!!eventsList.length && (
          <ComponentsList
            component={EventsListItem}
            list={eventsList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('events.eventsNotFound')}
        {couldLoadMore && (
          <div className="text-center">
            <button
              className="btn btn-default"
              disabled={loadingMore}
              onClick={this.loadMore}
            >
              {loadingMore
                ? I18n.t('general.elements.loading')
                : I18n.t('general.elements.loadMore')}
            </button>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    accessToken: state.auth.accessToken,
    loadingMore: state.events.loadingMore,
    couldLoadMore: state.events.couldLoadMore,
    eventsList: state.events.list,
    isFetching: state.events.isFetching
  };
}

export default connect(mapStateToProps)(withStyles(s)(EventsList));
