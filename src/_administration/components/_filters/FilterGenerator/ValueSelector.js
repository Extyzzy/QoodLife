import React  from 'react';
import { toString } from 'lodash';
import Select from "react-select";
import "react-select/dist/react-select.css";
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css'
import moment from 'moment';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ValueSelector.scss';
import {I18n} from 'react-redux-i18n';

const ValueSelector = ({
  id,
  data: {
    type,
    params: {
      inputType = 'text',
      inputPlaceholder = '',
      dateFormat = 'DD-MM-YYYY',
      timeFormat = 'HH:mm',
      selectOptions = [],
      multipleSelect = false,
      checkboxLabel,
    } = {},
  },
  filterValue,
  changeFilterValue,
}) => {
  switch (type) {
    case 'input':

      return (
        <input
          type={inputType}
          placeholder={inputPlaceholder}
          className="form-control"
          value={
            toString(filterValue)
          }
          onChange={({target: {value}}) => {
            changeFilterValue(id, value);
          }}
        />
      );

    case 'date':

      return (
        <div className={s.dateInterval}>
          <div className={s.since}>
            <Datetime
              value={
                filterValue instanceof Object
                  ? filterValue.since : null
              }
              dateFormat={dateFormat}
              timeFormat={timeFormat}
              onChange={v => {
                const since = v instanceof moment ? v : null;
                const until = filterValue instanceof Object
                  ? filterValue.until : null;

                changeFilterValue(
                  id,
                  {
                    since,
                    until: until instanceof moment ?
                      (since instanceof moment ? (
                        until.isAfter(since) || until.isSame(since)
                          ? until : null
                      ) : until) : null,
                  }
                );
              }}
              readOnly={true}
              inputProps={{
                placeholder: I18n.t('administration.filter.intervalStart'),
              }}
            />
          </div>

          <div className={s.until}>
            <Datetime
              value={
                filterValue instanceof Object
                  ? filterValue.until : null
              }
              dateFormat={dateFormat}
              timeFormat={timeFormat}
              onChange={v => {
                changeFilterValue(
                  id,
                  {
                    until: v instanceof moment ? v : null,
                    since: filterValue instanceof Object
                      ? filterValue.since : null,
                  }
                );
              }}
              readOnly={true}
              inputProps={{
                placeholder: I18n.t('administration.filter.intervalEnd'),
              }}
              isValidDate={current => {
                const since = filterValue instanceof Object
                  ? filterValue.since : null;

                if (since instanceof moment) {
                  return current.isAfter(since) ||
                    current.isSame(since);
                }

                return true;
              }}
            />
          </div>
        </div>
      );

    case 'select':

      return (
        <Select
          value={filterValue}
          options={selectOptions}
          optionClassName="needsclick"
          onChange={v => {
            changeFilterValue(
              id,
              v instanceof Array
                ? v.map(({value}) => value)
                : (v ? v.value : null)
            );
          }}
          multi={multipleSelect}
        />
      );

    case 'check':

      return (
        <div className="checkbox">
          <label>
            <input
              type="checkbox"
              checked={!!filterValue}
              onChange={({target: {checked}}) => {
                changeFilterValue(id, + checked);
              }}
            />
            {checkboxLabel}
          </label>
        </div>
      );

    default:

      return null;

  }
};

export default withStyles(s)(ValueSelector);
