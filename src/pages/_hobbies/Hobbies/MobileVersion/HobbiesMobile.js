import React  from "react";
import {LinkContainer} from 'react-router-bootstrap';
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./HobbiesMobile.scss";
import Layout from '../../../../components/_layout/Layout/Layout';
import Buttons from '../Buttons';
import classes from "classnames";

const Hobbies = ({
  category,
  hobbiesList,
  userHobbies,
  attachHobbyToUser,
  addHobbyToUser,
  nameParent,
}) => (
  <Layout
    contentHasBackground
  >
    <div className={s.root}>
      <LinkContainer to="/hobbies"  className={s.link}>
       <h3 className={s.title}>
         {nameParent}
           {
             nameParent &&(
               <span> - </span>
             )
           }
         {category.name}
         </h3>
      </LinkContainer>

      <div className={s.hobbiesList}>
        {
          hobbiesList.map(hobby => {
            const isActive = !!userHobbies && !!userHobbies.length
              && !!userHobbies.find(({id}) => id === hobby.id);

            return(
              <div
                key={hobby.id}
                className={s.listItem}
              >
                <div className={s.title}>
                  <span>{hobby.name}</span>
                </div>
                <img
                  src={hobby.image.src}
                  alt={hobby.name}
                />
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
            )
          })
        }
      </div>
    </div>
  </Layout>
);

export default withStyles(s)(Hobbies);
