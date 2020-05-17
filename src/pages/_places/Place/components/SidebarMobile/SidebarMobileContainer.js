import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withRouter } from 'react-router-dom';
import s from './SidebarMobile.scss';
import SideBarMobile from './SideBarMobile';

class SidebarMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false,
      showCloseButton: true
    };
  }

  sideBar() {
    const { showCloseButton, showSideBar } = this.state;

    this.setState({
      showCloseButton: !showCloseButton,
      showSideBar: !showSideBar
    });
  }

  render() {
    const { calendar, placeOrProfHobbies, eventsHobbies } = this.props;
    const { showSideBar, showCloseButton } = this.state;

    return (
      <SideBarMobile
        showCloseButton={showCloseButton}
        showSideBar={showSideBar}
        sideBar={this.sideBar.bind(this)}
        calendarPlace={calendar}
        placeOrProfHobbies={placeOrProfHobbies}
        eventsHobbies={eventsHobbies}
      />
    );
  }
}

function mapStateToProps(store) {
  return {
    eventsHobbies: store.events.listHobbiesEvents
  };
}

export default withRouter(
  connect(mapStateToProps)(withStyles(s)(SidebarMobile))
);
