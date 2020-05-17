import classes from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ViewModeSwitcher.scss';

function viewMode(props, propName, componentName) {
  if (props[propName]) {
    let value = props[propName];
    if (typeof value === 'string') {
      return ViewModeSwitcher.modes[value]
        ? null
        : new Error(
          `ViewMode must be one of [${Object.keys(ViewModeSwitcher.modes)
            .map(viewMode => `\`${viewMode}\``).join(', ')}].`
        );
    }
  }

  return null;
}

class ViewModeSwitcher extends React.Component {
  static modes = {
    list: {
      icon: 'icon-menu',
    },
    icons: {
      icon: 'icon-th-large',
    },
    map: {
      icon: 'icon-map-marker',
    },

  };

  static propTypes = {
    className: PropTypes.string,
    modes: PropTypes.arrayOf(
      viewMode,
    ).isRequired,
    mode: viewMode,
  };

  render() {
    const { className, modes, mode, onChange } = this.props;

    return (
      <div className={classes(s.root, className)}>
        {
          modes.map((m) => {
            const active = m === mode;

            return (
              <span
                key={m}
                className={classes(s.mode, {
                  [s.active]: active,
                })}
                onClick={() => {
                  onChange(m);
                }}
              >
                <i className={ViewModeSwitcher.modes[m].icon} />
              </span>
            );
          })
        }
      </div>
    );
  }
}

export default withStyles(s)(ViewModeSwitcher);
