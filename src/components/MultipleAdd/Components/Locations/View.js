import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  branchesList,
  onPlaceRemove,
  onUpdate,
  onDefaultPlace,
  isMobile,
  __defaultBranch,
}) => (
  <div>
    {
      !!branchesList.length && (
        branchesList.map((place, i) => {
          return (
            <ListItem
              key={i}
              data={place}
              isMobile={isMobile}
              onPlaceRemove={() => {
                onPlaceRemove(i)
              }}
              defaultBranch={__defaultBranch}
              onUpdate={(updatedPlace) => {
                onUpdate(updatedPlace, i)
              }}

              onDefaultPlace={(onDefault) => {
                onDefaultPlace(onDefault, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
