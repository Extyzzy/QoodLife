import React from 'react';
import moment from 'moment';
import { I18n } from 'react-redux-i18n';

const DateTimeCell = ({
  timestamp,
  dateFormat,
  timeFormat,
}) => {
  const __timestamp = moment(timestamp, 'X');

  if ( ! __timestamp.isValid()) {
    return (
      <td> - </td>
    );
  }

  return (
    <td>
      <span style={{whiteSpace: 'nowrap'}}>
        {
          __timestamp.format(dateFormat ? dateFormat : I18n.t('formats.date'))
        }
      </span>
      {' '}
      <span style={{whiteSpace: 'nowrap'}}>
          {
            __timestamp.format(timeFormat ? timeFormat : I18n.t('formats.time'))
          }
        </span>
    </td>
  );
};

export default DateTimeCell;
