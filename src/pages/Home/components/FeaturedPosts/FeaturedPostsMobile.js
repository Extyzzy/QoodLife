import React from 'react';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./FeaturedPostsMobile.scss";
import Slider from "react-slick";
import { sliderSettings } from "../../../../components/_carousel/SliderSettingsMobile";
import {Link} from "react-router-dom";

const FeaturedPosts = ({
  postsList,
  postsAreLoading,
  onItemComponentWillUnmount,
  onItemPopupComponentWillUnmount,
  itemActionButtons,
  itemPopupActionButtons,
}) => (
  <div className={s.root}>
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

export default withStyles(s)(FeaturedPosts);
