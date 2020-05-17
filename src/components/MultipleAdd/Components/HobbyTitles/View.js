import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  titlesList,
  onTitleRemove,
  onUpdate,
  isMobile,
}) => (
  <div>
    {
      !!titlesList && (
        titlesList.map((title, i) => {
          return (
            <ListItem
              key={i}
              data={title}
              isMobile={isMobile}
              onTitleRemove={() => {
                onTitleRemove(i)
              }}

              onUpdate={(updatedTitle) => {
                onUpdate(updatedTitle, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
