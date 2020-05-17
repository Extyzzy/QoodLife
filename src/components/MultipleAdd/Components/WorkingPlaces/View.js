import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  workingPlacesList,
  onWorkingPlaceRemove,
  onUpdate,
  isMobile,
}) => (
  <div>
    {
      !!workingPlacesList.length && (
        workingPlacesList.map((workingPlace, i) => {
          return (
            <ListItem
              key={i}
              data={workingPlace}
              isMobile={isMobile}
              onInstitutionRemove={() => {
                onWorkingPlaceRemove(i)
              }}

              onUpdate={(updatedWorkingPlace) => {
                onUpdate(updatedWorkingPlace, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
