import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Places.scss";
import {I18n} from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE_GRID } from '../../../constants';
import { sliderSettings } from '../../../components/_carousel/SliderSettingsMobile';

import { chunk } from 'lodash';
import MobileAdsCarousel from '../../../components/MobileAdsCarousel';
import ComponentsList from "../../../components/ComponentsList/ComponentsList";
import Loader from "../../../components/Loader/Loader";
import PlacesListItem from "./components/ListItem";
import classes from 'classnames';

class Places extends Component {

  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    placesList: PropTypes.array.isRequired,
    onItemComponentWillUnmount: PropTypes.func,
    onItemPopupComponentWillUnmount: PropTypes.func,
    itemActionButtons: PropTypes.func,
    itemPopupActionButtons: PropTypes.func,
    showLoadMore: PropTypes.bool.isRequired,
    onLoadMore: PropTypes.func.isRequired,
    loadingMore: PropTypes.bool.isRequired,
  };

  render() {
    const {
      isFetching,
      isLoaded,
      placesList,
      onItemComponentWillUnmount,
      onItemPopupComponentWillUnmount,
      itemActionButtons,
      itemPopupActionButtons,
      showLoadMore,
      onLoadMore,
      loadingMore,
      viewMode,
      UIVersion
    } = this.props;

    const placesGroups = chunk(placesList, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);

    return (
        <div className={s.root}>
          <div className={classes(s.header,{
            [s.loaderHeight]: isFetching,
          })}>
            {
              isFetching && (
                <Loader className={s.loader} sm contrast/>
              )
            }
          </div>

          {
            isLoaded && (
              (placesList && placesList.length > 0 && (
                <div>
                  {
                    placesGroups.map((group, groupKey) =>
                      <div key={groupKey}>
                        {
                          (UIVersion === MOBILE_VERSION && (
                            <Slider
                              className={s.slider}
                              {...sliderSettings}
                            >
                              {
                                !!group.length
                                && group.map((place, index) =>  {
                                  return (
                                    <div key={index}>
                                      <PlacesListItem
                                        data={place}
                                        onComponentWillUnmount={
                                          onItemComponentWillUnmount
                                        }
                                        onPopupComponentWillUnmount={
                                          onItemPopupComponentWillUnmount
                                        }
                                        actionButtons={itemActionButtons}
                                        popupActionButtons={itemPopupActionButtons}
                                        viewMode={viewMode}
                                        className={s.placesList}
                                      />
                                    </div>
                                  );
                                })
                              }
                            </Slider>
                          )) || (
                            <ComponentsList
                              className={s.placesList}
                              component={PlacesListItem}
                              list={group}
                              onComponentWillUnmount={
                                onItemComponentWillUnmount
                              }
                              onPopupComponentWillUnmount={
                                onItemPopupComponentWillUnmount
                              }
                              actionButtons={itemActionButtons}
                              popupActionButtons={itemPopupActionButtons}
                              viewMode={viewMode}
                            />
                          )
                        }
                        {
                          showLoadMore &&
                          groupKey+1 === placesGroups.length && (
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
                          groupKey+1 === placesGroups.length && (
                            <MobileAdsCarousel blockIndex={groupKey} />
                          )
                        }
                      </div>
                    )
                  }
                </div>
              )) || (
                <div className={s.notFound}>
                  { I18n.t('agent.placesNotFound') }
                </div>
              )
            )
          }
        </div>
    );

  }
}

export default withStyles(s)(Places);
