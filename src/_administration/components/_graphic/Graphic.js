import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Graphic.scss';
import classes from 'classnames';
import {I18n} from 'react-redux-i18n';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const CustomizedAxisTick = ({x, y, payload,}) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
  </g>
);

const Graphic = ({
     data,
     selectedOption,
     handleOptionChange,
     name,
     id1,
     id2,
     isFetching,
}) => (
  <div className={s.root}>
    <h1>{name}</h1>
  <div className={s.containnerButton}>
    <div className={s.radio}>
      <input id={id1} name={name} type="radio" value='week'
             checked={selectedOption  === 'week'}
             onChange={handleOptionChange}
             disabled={isFetching}
      />
      <label htmlFor={id1} className={s.radioLabel}>
        {I18n.t('administration.graph.lastWeek')}
      </label>
    </div>

    <div className={s.radio}>
      <input id={id2} name={name} type="radio" value='month'
             checked={selectedOption  === 'month'}
             onChange={handleOptionChange}
             disabled={isFetching}
      />
      <label htmlFor={id2} className={s.radioLabel}>
        {I18n.t('administration.graph.lastMonth')}
      </label>
    </div>
  </div>

    <div className={classes(s.container, {
      [s.isLoading]: isFetching}
      )}>
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="name" height={70} tick={<CustomizedAxisTick/>}/>
          <YAxis/>
          <CartesianGrid strokeDasharray="3 3"/>
          <Tooltip/>
          <Area
            type='monotone'
            dataKey='count' 
            stroke='green'
            fill='green'/>
        </AreaChart>
      </ResponsiveContainer>
    </div>

  </div>

);

export default withStyles(s)(Graphic);
