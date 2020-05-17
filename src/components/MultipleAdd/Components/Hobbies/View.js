import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  selectedHobbies,
  hobbiesOptions,
  role,
  haveTitles,
  onHobbyRemove,
  onUpdate,
  isMobile,
  filters,
}) => (
  <div>
    {
      !!selectedHobbies.length && (
        selectedHobbies.map((hobby, i) => {
          return (
            <ListItem
              key={i}
              filters={filters}
              data={hobby}
              isMobile={isMobile}
              role={role}
              haveTitles={haveTitles}
              hobbiesOptions={hobbiesOptions}
              onHobbyRemove={() => {
                onHobbyRemove(i)
              }}

              onUpdate={(updatedHobby) => {
                onUpdate(updatedHobby, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
