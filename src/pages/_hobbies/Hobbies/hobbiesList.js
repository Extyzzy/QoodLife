import React  from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import { Link } from "react-router-dom";
import { I18n } from 'react-redux-i18n';
import classes from "classnames";
import s from "./Categories.scss";
import Buttons from './Buttons';
import {
  setSelectedSidebarCategory,
  setSelectedSidebarHobby,
} from "../../../actions/navigation";

const List = ({
  categoriesList,
  userHobbies,
  name,
  dispatch,
  history,
}) => (
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

          <img
            src={e.category.image.src}
            alt={e.category.name}
          />

          <div className={s.cardBlock}>
            <div className={s.hobbiesList}>
              {
                ((!!e.hobbies && !e.children) && (
                  e.hobbies.map((hobby) => {
                    const hobbiesOrigin = e.for_children
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
                    e.children.map((child, i) => {
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
              <div className={s.listItem}>
                <Link
                  to={`/hobbies/${e.category.id}`} className={s.link}>
                  ...
                </Link>
              </div>
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
);

export default withStyles(s)(List);
