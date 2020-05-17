import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Forbidden.scss';
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';

const Forbidden = () => (
  <div className={s.root}>
    <h1 className={s.title}>403</h1>
    <p>{I18n.t('general.errorMessages.forbiddenMessage')}</p>
  </div>
);

export { Forbidden as ForbiddenWithoutDecorators };
export default withRouter(withStyles(s)(Forbidden));
