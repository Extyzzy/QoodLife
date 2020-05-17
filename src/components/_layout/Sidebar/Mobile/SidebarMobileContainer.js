import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withRouter } from 'react-router-dom';
import s from './SidebarMobile.scss';
import SideBarMobileHobies from './SideBarMobileHobbies';
import SideBarMobileProfile from './SideBarMobileProfile';

class SidebarMobile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSideBar: false,
      showCloseButton: true,
      showFavorites: this.props.match.path.startsWith('/profile/favorites'),
      showProfessional: this.props.match.path.startsWith('/profile/professional'),
      showAgent: this.props.match.path.startsWith('/profile/business')
    };
  }

  getListItem() {
    const { whichSidebar } = this.props;

    switch (whichSidebar) {
      case 'My Profile':
        return SideBarMobileProfile;

      default:
        return SideBarMobileHobies;
    }
  }

  sideBar() {
    const {showCloseButton, showSideBar} = this.state;

    this.setState({
      showCloseButton: !showCloseButton,
      showSideBar: !showSideBar,
    });
  }

  showAgent() {
    const {showAgent} = this.state;
    this.setState({
      showAgent: !showAgent,
    });
  }

  showProfessional() {
    const {showProfessional} = this.state;
    this.setState({
      showProfessional: !showProfessional,
    });
  }

  showFavorites() {
    const {showFavorites} = this.state;
    this.setState({
      showFavorites: !showFavorites,
    });
  }

  render () {
    const {
      userHobbies,
      hobbies,
      isAuthenticated,
      viewSwitchMode,
      ads,
      userRoles,
    } = this.props;

    const {
      showSideBar,
      showCloseButton,
      showFavorites,
      showProfessional,
      showAgent
    } = this.state;

    const SideBarMobileHobies = this.getListItem();
    showSideBar ? document.body.style.overflow = 'hidden' : document.body.style.overflow = '';
    
    if (isAuthenticated) {
      const isProfessional = userRoles.find(role => role.code === 'professional');
      const isAgent = userRoles.find(role => role.code === 'place')
      return <SideBarMobileHobies
        ads={ads}
        showCloseButton={showCloseButton}
        userHobbies={userHobbies}
        hobbies={hobbies}
        isAuthenticated={isAuthenticated}
        showSideBar={showSideBar}
        viewSwitchMode={viewSwitchMode}
        sideBar={this.sideBar.bind(this)}
        showFavorites={this.showFavorites.bind(this)}
        favorites={showFavorites}
        showProfessional={this.showProfessional.bind(this)}
        professional={showProfessional}
        isProfessional={isProfessional}
        showAgent={this.showAgent.bind(this)}
        agent={showAgent}
        isAgent={isAgent}
      />
    } else return <SideBarMobileHobies
      ads={ads}
      showCloseButton={showCloseButton}
      userHobbies={userHobbies}
      hobbies={hobbies}
      isAuthenticated={isAuthenticated}
      showSideBar={showSideBar}
      viewSwitchMode={viewSwitchMode}
      sideBar={this.sideBar.bind(this)}
    />
  };
}

function mapStateToProps(store) {
  return {
    userHobbies: (store.user && store.user.hobbies) || [],
    hobbies: store.hobbies.list,
    isAuthenticated: store.auth.isAuthenticated,
    ads: store.app.ads,
    userRoles: store.user.roles
  };
}

export default withRouter(connect(mapStateToProps)(withStyles(s)(SidebarMobile)));
