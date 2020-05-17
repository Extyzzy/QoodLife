import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import { I18n } from "react-redux-i18n";
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./PlacesList.scss";
import Loader from '../../../../../components/Loader';
import { FILTER_FAVORITE } from '../../../../../helpers/filter';
import { confirm } from '../../../../../components/_popup/Confirm';
import ComponentsList from "../../../../../components/ComponentsList";
import PlacesListItem from "../../../../../pages/_places/Places/components/ListItem";

import {
  clearPlaces,
  fetchPlacesWithStore,
  removeFromFavorites,
  removePlaceFromList,
  loadMorePlacesUsingStore,
} from "../../../../../actions/places";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';

class PlacesListContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      isLoaded: false,
    };

    this.createdAt = moment().utcOffset(0);

    this.listItemActionButtons = this.listItemActionButtons.bind(this);
    this.loadMore = this.loadMore.bind(this);
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch(
      clearPlaces()
    );
  }

  componentDidMount() {
    this.fetchPlacesList();
  }

  componentWillReceiveProps(nextProps) {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    const { navigation: nextNavigation } = nextProps;

    if ( ! isEqual(navigation, nextNavigation)) {
      dispatch(
        fetchPlacesWithStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation: nextNavigation,
          }
        )
      );
    }
  }

  componentWillUnmount() {
    if (this.fetchPlacesListFetcher instanceof Promise) {
      this.fetchPlacesListFetcher.cancel();
    }
  }

  fetchPlacesList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    this.fetchPlacesListFetcher = dispatch(
      fetchPlacesWithStore(
        accessToken,
        {
          group: FILTER_FAVORITE,
          navigation,
        }
      )
    );

    this.fetchPlacesListFetcher
      .finally(() => {
        if ( ! this.fetchPlacesListFetcher.isCancelled()) {
          this.setState({
            isLoaded: true,
          });
        }
      })
  }

  onListItemComponentWillUnmount(_this) {
    if (_this.removeFromFavoritesFetcher instanceof Promise) {
      _this.removeFromFavoritesFetcher.cancel();
    }
  }

  listItemActionButtons(_this) {
    const {
      dispatch,
      accessToken
    } = this.props;

    const {
      isRemovingFromFavorites,
    } = _this.state;

    const {
      id: placeId,
    } = _this.props.data;

    return [
      <button
        key="RemoveFromFavorites"
        className="round-button remove"
        onClick={() => {
          if (!isRemovingFromFavorites) {
            confirm(I18n.t('general.components.confirmFavorite'))
              .then(() => {
                _this.setState({
                  isRemovingFromFavorites: true,
                }, () => {
                  _this.removeFromFavoritesFetcher = dispatch(
                    removeFromFavorites(
                      accessToken,
                      placeId
                    )
                  );

                  _this.removeFromFavoritesFetcher
                    .then(() => {
                      _this.setState({
                        isRemovingFromFavorites: false,
                      }, () => {
                        dispatch(
                          removePlaceFromList(placeId)
                        );
                      });
                    });
                });
              });
          }
        }}
      />,
    ];
  }

  loadMore() {
    const {
      dispatch,
      accessToken,
      navigation,
      loadingMore,
      placesList,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMorePlacesUsingStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: placesList.length,
            },
          }
        )
      );
    }
  }

  render() {
    const {
      isFetching,
      loadingMore,
      couldLoadMore,
      placesList,
    } = this.props;

    if (isFetching) {
      return (
        <Loader sm contrast />
      );
    }

    const { isLoaded } = this.state;

    return (
       <div className={s.root}>
        {
          isLoaded && (
            (!!placesList && !!placesList.length && (
              <ComponentsList
                list={placesList}
                component={PlacesListItem}
                onComponentWillUnmount={ this.onListItemComponentWillUnmount}
                actionButtons={this.listItemActionButtons}
                popupActionButtons={() => []}
                viewMode="icons"
              />
            )) ||  I18n.t('agent.placesNotFound')
          )
        }

        {
          couldLoadMore && (
            <div className="text-center">
              <button
                className="btn btn-default"
                disabled={loadingMore}
                onClick={this.loadMore}
              >
                {loadingMore ? I18n.t('general.elements.loading') : I18n.t('general.elements.loadMore')}
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
    accessToken: state.auth.accessToken,
    isFetching: state.places.isFetching,
    loadingMore: state.places.loadingMore,
    couldLoadMore: state.places.couldLoadMore,
    placesList: state.places.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default connect(mapStateToProps)(withStyles(s)(PlacesListContainer));
