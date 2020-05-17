import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  gendersOptions,
  childrensList,
  onChildRemove,
  onUpdate,
  isMobile,
}) => (
  <div>
    {
      !!childrensList.length && (
        childrensList.map((child, i) => {
          return (
            <ListItem
              key={i}
              data={child}
              isMobile={isMobile}
              gendersOptions={gendersOptions}
              onChildRemove={() => {
                onChildRemove(i)
              }}

              onUpdate={(updatedChild) => {
                onUpdate(updatedChild, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
