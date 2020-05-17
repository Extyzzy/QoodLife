import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './PageNotFound.scss';
import {I18n} from 'react-redux-i18n';
const PageNotFound = () => (
  <div className={s.root}>
    <h1 className={s.title}>404</h1>
    <p>{I18n.t('general.errorMessages.page404Message')}</p>
  </div>
);

export { PageNotFound as PageNotFoundWithoutDecorators };
export default withStyles(s)(PageNotFound);
