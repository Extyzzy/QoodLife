import React  from "react";
import {LinkContainer} from 'react-router-bootstrap';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Hobbies.scss";
import Layout from '../../../components/_layout/Layout';
import Buttons from './Buttons';
import classes from "classnames";
import {I18n} from 'react-redux-i18n';
import {setSelectedSidebarCategory, setSelectedSidebarHobby} from "../../../actions/navigation";

const Hobbies = ({
  category,
  hobbiesList,
  userHobbies,
  childrenHobbies,
  attachHobbyToUser,
  addHobbyToUser,
  nameParent,
  treeID,
  redirectToEvents,
  dispatch,
  history,
  isAuthenticated,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <div className={s.nav}>
        <LinkContainer to="/hobbies" className={s.link}>
         <h3 className={s.title}>{I18n.t('hobbies.browseHobbies')}</h3>
        </LinkContainer>

        {
          (nameParent &&(
            <div className={s.containnerTree}>
              <span className={s.tree}>
                <span className={classes(s.tree, "icon-arrow-right")} />
              </span>
                <LinkContainer to={"/hobbies/" + treeID} className={s.linkTree}>
                  <h1>{nameParent}</h1>
                </LinkContainer>
              <span className={classes(s.tree, "icon-arrow-right")} />
              <h2>{category.name}</h2>
            </div>
          )) || (
            <div className={s.containnerTree}>
              <span className={classes(s.tree, "icon-arrow-right")} />
              <h2>{category.name}</h2>
            </div>
          )
        }
      </div>

      <div className={s.hobbiesList}>
        {
          hobbiesList.map((hobby, index) => {
            const hobbiesOrigin = category.for_children
              ? childrenHobbies
              : userHobbies;

            const isActive = !!hobbiesOrigin && !!hobbiesOrigin.length
                && !!hobbiesOrigin.find(({id}) => id === hobby.id);

            return(
            <div
              key={hobby.id}
              className={s.listItem}
            >
              <div className={s.title}>
                <span>
                  <p>{hobby.name}</p>
                </span>
                <button
                  className={classes("btn btn-red", s.browseHobbyButton)}
                  onClick={() => {
                    
                    if (!isAuthenticated && hobby.is_for_18) {
                      return history.push('/login');
                    }

                    dispatch(setSelectedSidebarCategory(category.id));
                    dispatch(setSelectedSidebarHobby(hobby.id));
                    history.push('/events')
                  }}
                >
                  browse hobby
                </button>
              </div>
              <img
                src={hobby.image.src}
                alt={hobby.name}
                onClick={() => {
                  dispatch(setSelectedSidebarCategory(category.id));
                  dispatch(setSelectedSidebarHobby(hobby.id));
                  history.push('/events')
                }}
              />
              <div className={classes(
                s.buttonContainer, {
                  [s.active]: isActive,
                })
              }>
                {
                  hobby.can_be_favorite && (
                    <Buttons
                      isActive={isActive}
                      hobby={hobby}
                    />
                  )
                }
              </div>
            </div>
            )
        })
        }
      </div>
    </div>
  </Layout>
);

export default withStyles(s)(Hobbies);
