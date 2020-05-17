import React from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./FeaturedItemsMobile.scss";
import Slider from "react-slick";
import EventsListItem from '../../../_events/Events/components/ListItem';
import ProfessionalsListItem from '../../../_professionals/Professionals/components/ListItem';
import PlacesListItem from '../../../_places/Places/components/ListItem';
import ProductsListItem from '../../../_products/Products/components/ListItem';
import { sliderSettings } from "../../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile";
import {Link} from "react-router-dom";

const FeaturedItems = ({
  navigationItems,
  activeNavigationItem,
  onNavigationItemSelect,
  activeNavigationItemList,
  itemsAreLoading,
  getListItemOnPopupComponentWillUnmount,
  getListItemPopupActionButtons,
  eventsList,
  professionalsList,
  placesList,
  productsList,
  postsList,
}) => (
  <div className={s.root}>

      <div className={s.title}>Events</div>
      {
        eventsList && !!eventsList.length && (
          <Slider
            className={s.slider}
            {...sliderSettings}
          >
            {
              eventsList.map(item => {

                return (
                  <div
                    key={`${item.key}_${item.id}`}
                  >
                    <EventsListItem
                      data={item}
                      viewMode="icons"
                      className={s.listItem}
                    />
                  </div>
                );
              })
            }
          </Slider>
        )
      }

    <div className={s.title}>Professionals</div>
    {
      professionalsList && !!professionalsList.length && (
        <Slider
          className={s.slider}
          {...sliderSettings}
        >
          {
            professionalsList.map(item => {

              return (
                <div
                  key={`${item.key}_${item.id}`}
                >
                  <ProfessionalsListItem
                    data={item}
                    viewMode="icons"
                    className={s.listItem}
                  />
                </div>
              );
            })
          }
        </Slider>
      )
    }

      <div className={s.title}>Places</div>
      {
        placesList && !!placesList.length && (
          <Slider
            className={s.slider}
            {...sliderSettings}
          >
            {
              placesList.map(item => {

                return (
                  <div
                    key={`${item.key}_${item.id}`}
                  >
                    <PlacesListItem
                      data={item}
                      viewMode="icons"
                      className={s.listItem}
                    />
                  </div>
                );
              })
            }
          </Slider>
        )
      }

      <div className={s.title}>Products</div>
      {
        productsList && !!productsList.length && (
          <Slider
            className={s.slider}
            {...sliderSettings}
          >
            {
              productsList.map(item => {

                return (
                  <div
                    key={`${item.key}_${item.id}`}
                  >
                    <ProductsListItem
                      data={item}
                      viewMode="icons"
                      className={s.listItem}
                    />
                  </div>
                );
              })
            }
          </Slider>
        )
      }

    <div className={s.title}>Blog</div>

    {
      postsList && !!postsList.length && (
        <Slider
          className={s.slider}
          {...sliderSettings}
        >
          {
            postsList.map(item => {

              return (
                <div
                  key={`${item.key}_${item.id}`}
                  className={s.posts}
                >
                  <Link to={`blog/post/${item.id}`}>
                    <div className={s.image}>
                      <img
                        src={item.image.src}
                        alt={''}
                      />
                    </div>
                  </Link>
                  <div className={s.details}>
                    {item.title}
                  </div>
                </div>
              );
            })
          }
        </Slider>
      )
    }


  </div>
);

export default withStyles(s)(FeaturedItems);
