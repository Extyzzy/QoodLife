import React, { Component } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from 'react-redux';
import { chunk } from 'lodash';
import { sliderSettings } from "../_carousel/SliderSettingsMobile";
import { DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK } from '../../constants';
import ProductsListItem from '../../pages/_products/Products/components/ListItem';

import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './MobileAdsCarousel.scss';

class MobileAdsCarousel extends Component {
  static defaultProps = {
    adsProductsList: []
  };

  render() {
    const { adsProductsList, blockIndex } = this.props;

    const currentBlockProductsGroup = chunk(
      adsProductsList,
      DEFAULT_NOF_ADS_RECORDS_PER_MOBILE_BLOCK
    )[blockIndex];

    const settings = {
      ...sliderSettings,
      responsive: [{
        breakpoint: 500,
        settings: {
          slidesToShow: 1.8,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1.8,
        }
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 1.8,
        }
      }]
    };

    if(!currentBlockProductsGroup) {
      return (
        <div />
      )
    }

    return (
      <div className={s.root}>
        <Slider
          className={s.slider}
          {...settings}
        >
          {
            !!currentBlockProductsGroup.length
            && currentBlockProductsGroup.map((add, i) =>  {
              return (
                <div
                  key={`${i}_${add.id}`}
                >
                  <ProductsListItem
                    data={add}
                    viewMode="icons"
                    className={s.listItem}
                  />
                </div>
              );
            })
          }
        </Slider>
      </div>
    )
  }
}

function mapStateToProps(store) {
  return {
    adsProductsList: store.adsModule.list,
    isFetching: store.adsModule.isFetching
  };
}

export default connect(mapStateToProps)(withStyles(s)(MobileAdsCarousel));
