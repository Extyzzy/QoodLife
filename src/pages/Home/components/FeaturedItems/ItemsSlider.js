import React  from 'react';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from './ItemsSlider.scss';

import {PrevArrow, NextArrow} from '../../../../components/_carousel/CarouselArrows';
import EventsListItem from '../../../_events/Events/components/ListItem';
import ProfessionalsListItem from '../../../_professionals/Professionals/components/ListItem';
import PlacesListItem from '../../../_places/Places/components/ListItem';
import ProductsListItem from '../../../_products/Products/components/ListItem';

const getListItemComponent = (key) => {
  switch (key) {
    case 'event':

      return EventsListItem;

    case 'professional':

      return ProfessionalsListItem;

    case 'place':

      return PlacesListItem;

    case 'product':

      return ProductsListItem;

    default:

      throw new Error('Provided navigation item is not supported.');

  }
};

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 4,
  nextArrow: (
    <NextArrow
      arrowClassName={s.prevArrow}
    />
  ),
  prevArrow: (
    <PrevArrow
      arrowClassName={s.nextArrow}
    />
  ),
};

const prepareShortTitle = (item,property,shortProperty)=>{
  item[shortProperty] = item[property].substr(0,30);
  const lastSpaceIndex = item[shortProperty].lastIndexOf(' ');
  if(lastSpaceIndex!==-1 && lastSpaceIndex!==0){
    item[shortProperty] = item[shortProperty].substr(0,lastSpaceIndex)
  }
  if(item[shortProperty].endsWith(',')){
    item[shortProperty]=item[shortProperty].substr(0,item[shortProperty].lastIndexOf(','))
  }
  item[shortProperty]+='...'
}

const ItemsSlider = ({
  itemsList,
  popup,
  onPopupOpen,
  onPopupClose,
  getListItemOnPopupComponentWillUnmount,
  getListItemPopupActionButtons,
}) => (
  <div className={s.root}>
    {
      itemsList && !!itemsList.length && (
        <Slider
          className={s.slider}
          {...sliderSettings}
        >
          {
            itemsList.map(item => {
              switch (item.key) {
                case 'place':
                  if(item.name.length>30){
                    prepareShortTitle(item,'name','shortName')
                  }
                  break;
                case 'product':
                  if(item.title.length>30){
                    prepareShortTitle(item,'title','shortTitle')
                  }
                  break;
                case 'event':
                  if(item.title.length>30){
                    prepareShortTitle(item,'title','shortTitle')
                  }
                  break;
                default:
                  break;
              }
              const ListItem = getListItemComponent(item.key);

              return (
                <div
                  key={`${item.key}_${item.id}`}
                >
                  <ListItem
                    data={item}
                    viewMode="icons"
                    className={s.listItem}
                    onPopupOpen={onPopupOpen}
                    onPopupClose={onPopupClose}
                    onPopupComponentWillUnmount={
                      getListItemOnPopupComponentWillUnmount(item.key)
                    }
                    popupActionButtons={
                      getListItemPopupActionButtons(item.key)
                    }
                  />
                </div>
              );
            })
          }
        </Slider>
      )
    }

    {popup}
  </div>
);

export default withStyles(s)(ItemsSlider);
