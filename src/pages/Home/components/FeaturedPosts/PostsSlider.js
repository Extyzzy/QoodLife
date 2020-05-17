import React  from 'react';
import Slider from "react-slick";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from './PostsSlider.scss';

import {PrevArrow, NextArrow} from '../../../../components/_carousel/CarouselArrows';

import PostsListItem from '../../../_blog/Blog/components/ListItem';

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

const ItemsSlider = ({
  postsList,
  onPopupComponentWillUnmount,
  popupActionButtons,
  popup,
  onPopupOpen,
  onPopupClose,
}) => (
  <div className={s.root}>
    {
      postsList && !!postsList.length && (
        <Slider
          className={s.slider}
          {...sliderSettings}
        >
          {
            postsList.map((post, i) => {
              if(post.title.length>30){
                post.shortTitle = post.title.substr(0,30);
                const lastSpaceIndex = post.shortTitle.lastIndexOf(' ');
                if(lastSpaceIndex!==-1 && lastSpaceIndex!==0){
                  post.shortTitle = post.shortTitle.substr(0,lastSpaceIndex)
                }
                if(post.shortTitle.endsWith(',')){
                  post.shortTitle=post.shortTitle.substr(0,post.shortTitle.lastIndexOf(','))
                }
                post.shortTitle+='...'
              }

              return (
                <div key={i}>
                  <PostsListItem
                    data={post}
                    viewMode="icons"
                    className={s.listItem}
                    onPopupOpen={onPopupOpen}
                    onPopupClose={onPopupClose}
                    onPopupComponentWillUnmount={
                      onPopupComponentWillUnmount
                    }
                    popupActionButtons={
                      popupActionButtons
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
