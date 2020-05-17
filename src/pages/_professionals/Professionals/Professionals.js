import React, { Component } from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Professionals.scss";
import {I18n} from 'react-redux-i18n';
import { MOBILE_VERSION } from '../../../actions/app';
import { DEFAULT_ADS_BLOCKS_FREQUENCE_GRID } from '../../../constants';
import { sliderSettings } from '../../../components/_carousel/SliderSettingsMobile';

import { chunk } from 'lodash';
import Loader from "../../../components/Loader/Loader";
import ComponentsList from "../../../components/ComponentsList/ComponentsList";
import ProfessionalsListItem from "./components/ListItem";
import classes from "classnames";

class Professionals extends Component {
  static propTypes = {
    isFetching: PropTypes.bool.isRequired,
    isLoaded: PropTypes.bool.isRequired,
    professionalsList: PropTypes.array.isRequired,
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
      professionalsList,
      onItemComponentWillUnmount,
      onItemPopupComponentWillUnmount,
      itemActionButtons,
      itemPopupActionButtons,
      placesGroupLength,
      showLoadMore,
      onLoadMore,
      loadingMore,
      viewMode,
      UIVersion
    } = this.props;

    const professionalsGroups = chunk(professionalsList, DEFAULT_ADS_BLOCKS_FREQUENCE_GRID);

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
              (!!professionalsList && !!professionalsList.length && (
                <div>
                  {
                    professionalsGroups.map((group, groupKey) =>
                      <div key={groupKey}>
                        {
                          (UIVersion === MOBILE_VERSION && (
                            <Slider
                              className={s.slider}
                              {...sliderSettings}
                            >
                              {
                                !!group.length
                                && group.map((professional, index) =>  {
                                  return (
                                    <div key={index}>
                                      <ProfessionalsListItem
                                        data={professional}
                                        onComponentWillUnmount={
                                          onItemComponentWillUnmount
                                        }
                                        onPopupComponentWillUnmount={
                                          onItemPopupComponentWillUnmount
                                        }
                                        actionButtons={itemActionButtons}
                                        popupActionButtons={itemPopupActionButtons}
                                        viewMode={viewMode}
                                        className={s.professionalsList}
                                      />
                                    </div>
                                  );
                                })
                              }
                            </Slider>
                          )) || (
                            <ComponentsList
                              className={s.professionalsList}
                              component={ProfessionalsListItem}
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
                          groupKey+1 === professionalsGroups.length && (
                            <div className="text-center">
                              <button
                                className="btn btn-default"
                                disabled={loadingMore}
                                onClick={() => onLoadMore(groupKey+placesGroupLength)}
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
                      )
                  }
                </div>
              )) || (
                <div className={s.notFound}>
                  { I18n.t('professionals.professionalsNotfound') }
                </div>
              )
            )
          }
        </div>
    );

  }
}

export default withStyles(s)(Professionals);
