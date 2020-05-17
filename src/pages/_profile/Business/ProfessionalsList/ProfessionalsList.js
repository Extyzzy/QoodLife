import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ProfessionalsList.scss';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';
import { fetchApiRequest } from '../../../../fetch';
import { InternalServerError } from '../../../../exceptions/http';
import { FILTER_OWNED } from '../../../../helpers/filter';
import {
  loadMoreEventsUsingStore
} from '../../../../actions/events';
import ComponentsList from '../../../../components/ComponentsList/ComponentsList';
import Loader from '../../../../components/Loader/Loader';
import ProfessionalsListItem from "../../../_professionals/Professionals/components/ListItem";
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
    this.fetchProfessionalsList();
  }

  componentWillUnmount() {
    if (this.fetchProfessionalsList instanceof Promise) {
      this.fetchProfessionalsList.cancel();
    }
  }

  fetchProfessionalsList() {
    const { placeId } = this.props;
    this.fetchProfessionalsList = fetchApiRequest(`/v1/places/connected/${placeId}`);

    this.fetchProfessionalsList
    .then(response => {
      switch(response.status) {
        case 200:
          return response.json();
        default:
          return Promise.reject(
            new InternalServerError()
          );
      }
    })
    .then(g => {
      this.setState({
        professionalsList: g.list,
        isLoaded: true,
      });

      return Promise.resolve();
    });
  }


  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      professionalsList
    } = this.props;

    if (!loadingMore) {
      dispatch(
        loadMoreEventsUsingStore(accessToken, {
          navigation,
          group: FILTER_OWNED,
          __GET: {
            before: this.createdAt.unix(),
            take: DEFAULT_NOF_RECORDS_PER_PAGE,
            skip: professionalsList.length,
            role: 'place'
          }
        })
      );
    }
  }

  render() {
    const { professionalsList, isFetching, loadingMore, couldLoadMore } = this.props;
    if (isFetching) {
      return <Loader />;
    }

    return (
      <div>
        {(!!professionalsList.length && (
          <ComponentsList
            component={ProfessionalsListItem}
            list={professionalsList}
            showOwnerDetails={false}
          />
        )) ||
          I18n.t('professionals.professionalsNotfound')}
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
    professionalsList: state.professionals.list,
    isFetching: state.events.isFetching
  };
}

export default connect(mapStateToProps)(withStyles(s)(EventsList));
