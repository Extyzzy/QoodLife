import React from 'react';
import { I18n } from 'react-redux-i18n';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import Widget from '../../../../components/Widget';
import s from './Ads.scss';

const View = () => (
  <div className={s.root}>
    <ul className="breadcrumb">
      <li>
        <span className="text-muted">
          {I18n.t('administration.administration')}
        </span>
      </li>
      <li className="active">
        ads
      </li>
    </ul>
    <h2>Ads Packages</h2>
    <Widget>

    </Widget>
  </div>
);

export default withStyles(s)(View);
