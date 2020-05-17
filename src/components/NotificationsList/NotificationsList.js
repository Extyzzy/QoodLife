import React, { Component } from 'react';
import { connect } from 'react-redux';
import { forEach } from 'lodash';

class NotificationsList extends Component {
  static defaultProps = {
    activeModule: '',
    notificationsList: [],
    moduleNotificationTypes: null
  };

  constructor(props, context) {
    super(props, context);

    this.state = {};
  };

  componentDidMount() {
    const {
      notificationsList,
      activeModule,
      moduleNotificationTypes
    } = this.props;

    if(Object.keys(moduleNotificationTypes).length !== 0) {
      forEach(Object.keys(moduleNotificationTypes[activeModule].notifications), key => {
        this.setState({[key]: notificationsList.filter(n => n.type === key)})
      })
    }
  }

  render() {
    const iconsList={
      newcomment: 'icon-envelope',
      newfollower: 'icon-man',
      newgoing: 'icon-check',
      newmember: 'icon-man-bold',
      addedtofavorite: 'icon-heart'
    };

    const showList = Object.keys(this.state)
    .map(key => {return {
      label: <i className={`${iconsList[`${key.split('-').join('')}`]}`} />,
      count: this.state[`${key}`].length
    }})
    .filter(i => i.count > 0);

    return (
      <div className="notification">
        {
          !!showList.length && showList.map((notification, i) =>
            <span key={i}>{notification.label} {notification.count}</span>
          )
        }
      </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    moduleNotificationTypes: store.notifications.types
  };
}

export default connect(mapStateToProps)(NotificationsList);
