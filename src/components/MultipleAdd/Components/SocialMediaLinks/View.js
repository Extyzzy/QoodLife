import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  mediaOptions,
  linkslist,
  onLinkRemove,
  onUpdate,
  isMobile,
}) => (
  <div>
    {
      !!linkslist.length && (
        linkslist.map((link, i) => {
          return (
            <ListItem
              key={i}
              data={link}
              isMobile={isMobile}
              mediaOptions={mediaOptions}
              onLinkRemove={() => {
                onLinkRemove(i)
              }}

              onUpdate={(updatedLink) => {
                onUpdate(updatedLink, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
