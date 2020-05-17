import React  from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./CategoriesMobile.scss";
import Layout from '../../../../components/_layout/Layout/Layout';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link} from "react-router-dom";
import { sliderSettings } from "../../../../components/_carousel/SliderSettingsMobile/SliderSettingsMobile";
import Buttons from '../Buttons';
import classes from "classnames";

const Categories = ({
  categoriesList,
  userHobbies,
  hasLinkToHobbies,
  name,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.categoriesList}>
        <h1>{name}</h1>
        {
          categoriesList.map((e, index) => (
            <div
              key={e.category.id}
              className={s.listItem}
            >

              <Link to={'/hobbies/' + e.category.id } className={s.link}>
                <div className={s.categoryName}>
                  {e.category.name}
                </div>
              </Link>

              {
                !!e.children && (
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >
                      {
                        e.children.map((data, i) => {
                          const {
                            name,
                            image,
                            id,
                          } = data.category;

                          return(
                            <div key={i}>
                              <Link to={'/hobbies/' + id }>
                              <div className={s.content}>
                                <div className={s.listItem}>
                                  <div className={s.title}>
                                    <span>{name}</span>
                                  </div>
                                  <img src={image.src} alt={name} />
                                </div>
                              </div>
                              </Link>
                            </div>
                          )
                        })
                       }
                  </Slider>
               )}

              {
                !!e.hobbies && (
                  <Slider
                    className={s.slider}
                    {...sliderSettings}
                  >

                    {
                      e.hobbies.map((hobby, i) => {
                        const {
                          name,
                          image
                        } = hobby;

                        const isActive = !!userHobbies && !!userHobbies.length
                          && !!userHobbies.find(({id}) => id === hobby.id);

                        return (
                          <div key={i} className={s.content}>
                            <div className={s.listItem}>
                                <div className={s.title}>
                                 <span>{name}</span>
                                </div>
                              <img src={image.src} alt={name} />
                              <div className={classes(
                                s.buttonContainer, {
                                  [s.active]: isActive,
                                })
                              }>
                                <Buttons
                                  isActive={isActive}
                                  hobby={hobby}
                                />
                              </div>
                            </div>

                          </div>
                        )
                      })
                    }

                  </Slider>
                )
              }
            </div>
          ))
        }
        </div>
      </div>
  </Layout>
);

export default withStyles(s)(Categories);
