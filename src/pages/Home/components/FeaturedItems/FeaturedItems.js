import React from 'react';
import {Nav, NavItem} from "react-bootstrap";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import withStyles from "isomorphic-style-loader/lib/withStyles";
import s from "./FeaturedItems.scss";
import FeaturedPosts from '../FeaturedPosts';
import Loader from '../../../../components/Loader';
import ItemsSliderContainer from './ItemsSliderContainer';
import classes from "classnames";

const FeaturedItems = ({
  navigationItems,
  activeNavigationItem,
  onNavigationItemSelect,
  activeNavigationItemList,
  itemsAreLoading,
  getListItemOnPopupComponentWillUnmount,
  getListItemPopupActionButtons,
  postsList,
}) => (
  <div className={s.root}>
    <Nav
      bsStyle="tabs"
      justified
      className={classes(s.navigation,
        {[s.activeTab]: !activeNavigationItem})
      }
      activeKey={activeNavigationItem}
      onSelect={onNavigationItemSelect}
    >
      {
        navigationItems.map(({key, children}) => (
          <NavItem
            key={key}
            eventKey={key}
            className={s.navigationItem}>
            {children}
          </NavItem>
        ))
      }
    </Nav>

    <div className={s.content}>
    {
      (itemsAreLoading && <Loader sm />) || (
        <ItemsSliderContainer
          itemsList={activeNavigationItemList}
          getListItemOnPopupComponentWillUnmount={
            getListItemOnPopupComponentWillUnmount
          }
          getListItemPopupActionButtons={
            getListItemPopupActionButtons
          }
        />
      )
    }
    </div>


    <FeaturedPosts
      postsList={postsList}
    />
  </div>
);

export default withStyles(s)(FeaturedItems);
