import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './CriticalError.scss';
import {I18n} from 'react-redux-i18n';
class CriticalError extends Component {
  static propTypes = {
    error: PropTypes.shape({
      name: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      stack: PropTypes.string.isRequired,
    }).isRequired,
  };

  render() {
    if (__DEV__) {
      const { error } = this.props;

      return (
        <div>
          <h1>{error.name}</h1>
          <p>{error.message}</p>
          <pre>{error.stack}</pre>
        </div>
      );
    }

    return (
      <div>
        <h1>Error</h1>
        <p>{{I18n.t('general.errorMessages.criticalError')}}</p>
      </div>
    );
  }
}

export { CriticalError as CriticalErrorWithoutStyle };
export default withStyles(s)(CriticalError);
