import React from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ComponentsList.scss';

class ComponentsList extends React.Component {
  static propTypes = {
    list: PropTypes.arrayOf(
      PropTypes.object.isRequired,
    ),
    component: PropTypes.any.isRequired,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    viewMode: PropTypes.string,
  };

  static defaultProps = {
    viewMode: 'list',
    notificationsList: [],
    setViewedNotification: () => {}
  };

  render() {
    const {
      list,
      component,
      className,
      itemClassName,
      viewMode,
      notificationsList,
      ...extras,
    } = this.props;
    
    return (
      <div className={classes(s.root, s[viewMode], className)}>
        {
          list && Array.isArray(list) && list.map((e,index) => (
            React.createElement(
              component, {
                data: e,
                key: e.id,
                viewMode,
                className: itemClassName,
                notification: notificationsList.filter(n => n.objectReferenceId === e.id),
                ...extras,
              }
            )
          ))
        }
      </div>
    );
  }
}

export { ComponentsList as ComponentsListWithoutDecorators };
export default withStyles(s)(ComponentsList);
