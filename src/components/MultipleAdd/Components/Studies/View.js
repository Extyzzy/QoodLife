import React from 'react';
import ListItem from './Item';

import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "../../MultipleAdd.scss";

const View = ({
  institutionsList,
  onInstitutionRemove,
  onUpdate,
  isMobile,
}) => (
  <div>
    {
      !!institutionsList.length && (
        institutionsList.map((institution, i) => {
          return (
            <ListItem
              key={i}
              data={institution}
              isMobile={isMobile}
              onInstitutionRemove={() => {
                onInstitutionRemove(i)
              }}

              onUpdate={(updatedInstitution) => {
                onUpdate(updatedInstitution, i)
              }}
            />
          )
        })
      )
    }
  </div>
);

export default withStyles(s)(View);
