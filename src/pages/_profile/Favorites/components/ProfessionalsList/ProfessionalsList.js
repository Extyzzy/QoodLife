import React, { Component } from "react";
import {connect} from "react-redux";
import { isEqual } from 'lodash';
import { I18n } from "react-redux-i18n";
import moment from 'moment';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./ProfessionalsList.scss";
import Loader from '../../../../../components/Loader';
import { FILTER_FAVORITE } from '../../../../../helpers/filter';
import { confirm } from '../../../../../components/_popup/Confirm';
import ComponentsList from "../../../../../components/ComponentsList";
import ProfListItem from "../../../../../pages/_professionals/Professionals/components/ListItem";

import {
  clearProfessionals,
  fetchProfessionalsWithStore,
  unfollow,
  removeProfessionalFromList,
  loadMoreProfessionalsUsingStore,
} from "../../../../../actions/professionals";

import {
  DEFAULT_NOF_RECORDS_PER_PAGE,
} from '../../../../../constants';

class ProfessionalsListContainer extends Component {
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
      clearProfessionals()
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
        fetchProfessionalsWithStore(
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
    if (this.fetchProfessionalsListFetcher instanceof Promise) {
      this.fetchProfessionalsListFetcher.cancel();
    }
  }

  fetchPlacesList() {
    const {
      dispatch,
      accessToken,
      navigation,
    } = this.props;

    this.fetchProfessionalsListFetcher = dispatch(
      fetchProfessionalsWithStore(
        accessToken,
        {
          group: FILTER_FAVORITE,
          navigation,
        }
      )
    );

    this.fetchProfessionalsListFetcher
      .finally(() => {
        if ( ! this.fetchProfessionalsListFetcher.isCancelled()) {
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
      id: profId,
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
                    unfollow(
                      accessToken,
                      profId
                    )
                  );

                  _this.removeFromFavoritesFetcher
                    .then(() => {
                      _this.setState({
                        isRemovingFromFavorites: false,
                      }, () => {
                        dispatch(
                          removeProfessionalFromList(profId)
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
      professionalsList,
    } = this.props;

    if ( ! loadingMore) {
      dispatch(
        loadMoreProfessionalsUsingStore(
          accessToken,
          {
            group: FILTER_FAVORITE,
            navigation,
            __GET: {
              before: this.createdAt.unix(),
              take: DEFAULT_NOF_RECORDS_PER_PAGE,
              skip: professionalsList.length,
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
      professionalsList,
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
            (!!professionalsList && !!professionalsList.length && (
              <ComponentsList
                list={professionalsList}
                component={ProfListItem}
                onComponentWillUnmount={ this.onListItemComponentWillUnmount}
                actionButtons={this.listItemActionButtons}
                popupActionButtons={() => []}
                viewMode="icons"
              />
            )) ||  I18n.t('professionals.professionalsNotfound')
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
    isFetching: state.professionals.isFetching,
    loadingMore: state.professionals.loadingMore,
    couldLoadMore: state.professionals.couldLoadMore,
    professionalsList: state.professionals.list,
    navigation: {
      sidebarOpenedGroup: state.navigation.sidebarOpenedGroup,
      selectedHobby: state.navigation.selectedHobby,
      selectedCategory: state.navigation.selectedCategory,
    },
  };
}

export default connect(mapStateToProps)(withStyles(s)(ProfessionalsListContainer));
