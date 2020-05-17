import React, { Component } from 'react';
import { connect } from "react-redux";
import { MOBILE_VERSION } from '../../actions/app';
import Hobbies from './Components/Hobbies'
import Childrens from './Components/Childrens';
import Locations from './Components/Locations';
import SocialMediaLinks from './Components/SocialMediaLinks';
import WorkingPlaces from './Components/WorkingPlaces';
import Studies from './Components/Studies';
import HobbyTitles from './Components/HobbyTitles';

class MultipleAddContainer extends Component {

  render() {
    const {
      dataType,
      role,
      data,
      options,
      onChange,
      haveTitles,
      UIVersion,
    } = this.props;

    const isMobile = UIVersion === MOBILE_VERSION;

    switch (dataType) {
      case 'childrens':
        return (
          <Childrens
            childrens={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'socialMediaLinks':
        return (
          <SocialMediaLinks
            links={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'workingPlaces':
        return (
          <WorkingPlaces
            places={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'studies':
        return (
          <Studies
            institutions={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'hobbies':
        return (
          <Hobbies
            hobbies={data}
            hobbiesList={options}
            role={role}
            haveTitles={haveTitles}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'hobbies-filters':
        return (
          <Hobbies
            filters
            hobbies={data}
            hobbiesList={options}
            role={role}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      case 'titles':
        return(
          <HobbyTitles
            titlesList={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
      default:
        return (
          <Locations
            branches={data}
            isMobile={isMobile}
            onChange={onChange}
          />
        )
    }
  }
}

function mapStateToProps(store) {
  return {
    UIVersion: store.app.UIVersion,
  };
}

export default connect(mapStateToProps)(MultipleAddContainer);
