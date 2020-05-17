import React from "react";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./Hobbies.scss";
import Buttons from "../../../../_hobbies/Hobbies/Buttons";
import { setSelectedSidebarHobby} from "../../../../../actions/navigation";
import classes from "classnames";

const HobbiesList = ({
  list,
  userHobbies,
  childrenHobbies,
  isAuthenticated,
  history,
  dispatch,
  isLoaded,
}) => (
  <div className={s.hobbiesList}>
    {
      list.map((hobby, index) => {
        const hobbiesOrigin = hobby.audience === "children"
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
                <span onClick={() => {
                  dispatch(setSelectedSidebarHobby(hobby.id));
                  history.push('/events')
                }}>
                  {hobby.name}</span>
            </div>
            <img
              src={hobby.image.src}
              alt={hobby.name}
              onClick={() => {
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
                hobby.can_be_favorite && isAuthenticated && (
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
);

export default withStyles(s)(HobbiesList);
