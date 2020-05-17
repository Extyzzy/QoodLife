import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Favorites.scss';
import Layout from '../../../components/_layout/Layout';
import Tabs from "../../../components/Tabs/Tabs";
import PlacesList from './components/PlacesList/PlacesList';
import ProfessionalsList from './components/ProfessionalsList/ProfessionalsList';
import ProductsList from './components/ProductsList';
import PostsList from './components/PostsList';
import EventsList from './components/EventsList';
import {I18n} from 'react-redux-i18n';
import connect from "react-redux/es/connect/connect";

class Favorites extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      activeTabItemIndex: 0,
    };
  }

  items() {

    let items = [
      {
        title: I18n.t('general.header.events'),
        content: (
          <EventsList />
        ),
      },
      {
        title: I18n.t('general.header.professionals'),
        content: (
          <ProfessionalsList />
        ),
      },
      {
        title: I18n.t('general.header.places'),
        content: (
          <PlacesList />
        ),
      },
      {
        title: I18n.t('general.header.products'),
        content: (
          <ProductsList />
        ),
      },
      {
        title: I18n.t('general.header.posts'),
        content: (
          <PostsList />
        ),
      },
    ];

    return items;
  }

  render() {
    const { activeTabItemIndex } = this.state;

    return (
      <Layout
        hasSidebar
        hasAds
        whichSidebar='My Profile'
        contentHasBackground
      >
        <div className={s.root}>
          <Tabs
            items={this.items()}
            activeItemIndex={activeTabItemIndex}
            onChange={(activeTabItemIndex) => {
              this.setState({
                activeTabItemIndex,
              });
            }}
          />
        </div>
      </Layout>
    );
  }
}

function mapStateToProps(store) {
  return {
    demo: store.app.demo,
  };
}

export default connect(mapStateToProps)(withStyles(s)(Favorites));
