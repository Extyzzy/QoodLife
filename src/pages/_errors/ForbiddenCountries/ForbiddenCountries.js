import React  from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Forbidden.scss';
import { withRouter } from 'react-router';
import {I18n} from 'react-redux-i18n';

const ForbiddenCountries = (props) => (
  <div className={s.root}>
    <p className={s.text}>{I18n.t('general.errorMessages.countryError')}</p>
  </div>
);

export { ForbiddenCountries as ForbiddenWithoutDecorators };
export default withRouter(withStyles(s)(ForbiddenCountries));
