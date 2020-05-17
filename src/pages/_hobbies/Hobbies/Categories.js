import React  from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import {Link} from "react-router-dom";
import {LinkContainer} from 'react-router-bootstrap';
import classes from "classnames";
import s from "./Categories.scss";
import Layout from '../../../components/_layout/Layout';
import Buttons from './Buttons';
import {I18n} from 'react-redux-i18n';
import {
  setSelectedSidebarCategory,
  setSelectedSidebarHobby,
} from "../../../actions/navigation";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Categories = ({
  categoriesList,
  userHobbies,
  childrenHobbies,
  hasLinkToHobbies,
  name,
  categoryId,
  dispatch,
  history,
  isAuthenticated,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.nav}>
        {
          (hasLinkToHobbies && (
            <LinkContainer to="/hobbies" className={s.link}>
              <h3 className={s.title}> {I18n.t('hobbies.browseHobbies')}</h3>
            </LinkContainer>
          )) || (
            <h3 className={s.title}>
              {I18n.t('hobbies.browseHobbies')}
            </h3>
          )
        }
        {
          name &&(
            <div className={s.containnerTree}>
              <span className={classes(s.tree, "icon-arrow-right")} />
                <h1>{name}</h1>
            </div>
          )
        }
      </div>
      <div className={s.categoriesList}>

        {
          categoriesList.map((e, index) => {
            return (
            <div
              key={e.category.id}
              className={s.listItem}
            >
              <div className={s.title}>
                {e.category.name}
              </div>

              <LazyLoadImage
                effect='blur'
                width='392px'
                height='200px'
                src={e.category.image.src}
                alt={e.category.name}
              />

              <div className={s.cardBlock}>
                <div className={s.hobbiesList}>
                  {
                    ((!!e.hobbies && !e.children) && (
                      e.hobbies.slice(0, 6).map((hobby) => {
                        const hobbiesOrigin = e.category.for_children
                          ? childrenHobbies
                          : userHobbies;

                        const isActive = !!hobbiesOrigin && !!hobbiesOrigin.length
                          && !!hobbiesOrigin.find(({id}) => id === hobby.id);

                        return (
                          <div
                            key={hobby.id}
                            className={
                              classes(
                                s.listItem, {
                                  [s.active]: isActive,
                                }
                              )
                            }
                          >
                            {
                              hobby.can_be_favorite && (
                                <Buttons
                                  isActive={isActive}
                                  hobby={hobby}
                                />
                              )
                            }
                            <span onClick={() => {
                              if (!isAuthenticated  && hobby.is_for_18) {
                                return history.push('/login');
                              }

                              dispatch(setSelectedSidebarCategory(e.category.id));
                              dispatch(setSelectedSidebarHobby(hobby.id));
                              history.push('/events')
                            }}>
                              {hobby.name}
                            </span>
                          </div>
                        )
                      })
                    )) || (
                      (!e.hobbies && !!e.children) && (
                        e.children.slice(0, 6).map((child, i) => {
                          return (
                            <div
                              key={child.category.id}
                              className={s.listItem}
                            >
                              <Link
                                className={s.link}
                                to={`/hobbies/${child.category.id}`}
                              >
                                {child.category.name}
                              </Link>
                            </div>
                          )
                        })
                    ))
                  }

                </div>

                <div className={s.more}>
                  <Link to={`/hobbies/${e.category.id}`}>
                    {I18n.t('hobbies.loadMore')}
                  </Link>
                </div>
              </div>
            </div>
          )})
        }
      </div>
    </div>
  </Layout>
);

export default withStyles(s)(Categories);
