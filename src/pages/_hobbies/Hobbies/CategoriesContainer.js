import React, { Component } from "react";
import {connect} from "react-redux";
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import Categories from './Categories';
import Hobbies from './Hobbies';
import PageNotFound from '../../_errors/PageNotFound';
import MobileVersionCategories from './MobileVersion/CategoriesMobile';
import MobileVersionHobbies from './MobileVersion/HobbiesMobile';
import { MOBILE_VERSION } from '../../../actions/app';

class CategoriesContainer extends Component {

  getCategoryChildren(categoriesList, categoryId, nameParent, treeID) {
    for (let i in categoriesList) {
      let {
        category,
        category: {
          id: ctgId,
          name,
        },
        children,
        hobbies,
      } = categoriesList[i];

      if (ctgId === categoryId) {
        if (children) {
          return {
            type: 'categories',
            children,
            name,
          };
        }

        return {
          type: 'hobbies',
          category: category,
          children: hobbies,
          nameParent,
          treeID,
        };
      }

      if (children) {
        const temp = this.getCategoryChildren(
          children,
          categoryId,
          name,
          ctgId,
        );

        if ( ! isEmpty(temp)) {
          return temp;
        }
      }
    }

    return {};
  }

  getChildren() {
    const {
      categoriesList,
      match: {params: {categoryId}},
    } = this.props;

    if (categoryId) {
      return this.getCategoryChildren(
        categoriesList,
        categoryId
      );
    }

    return {
      type: 'categories',
      children: categoriesList,
    };
  }

  getListItemCategories() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersionCategories;

      default:
        return Categories;
    }
  }

  getListItemHobbies() {
    const { UIVersion } = this.props;

    switch (UIVersion) {
      case MOBILE_VERSION:
        return MobileVersionHobbies;

      default:
        return Hobbies;
    }
  }

  render() {
    const {
      userHobbies,
      childrenHobbies,
      history,
      match: {params: {categoryId}},
      dispatch,
      isAuthenticated,
    } = this.props;

    const {
      type: childrenType,
      category,
      children,
      name,
      nameParent,
      treeID,
    } = this.getChildren();

    const Categories = this.getListItemCategories();
    const Hobbies = this.getListItemHobbies();

    switch (childrenType) {
      case 'categories':
        return (
          <Categories
            categoriesList={children}
            userHobbies={userHobbies}
            childrenHobbies={childrenHobbies}
            hasLinkToHobbies={!!categoryId}
            name={name}
            history={history}
            dispatch={dispatch}
            isAuthenticated={isAuthenticated}
          />
        );

      case 'hobbies':

        return (
          <Hobbies
            categoryId={categoryId}
            nameParent={nameParent}
            category={category}
            hobbiesList={children}
            userHobbies={userHobbies}
            childrenHobbies={childrenHobbies}
            treeID={treeID}
            history={history}
            dispatch={dispatch}
            isAuthenticated={isAuthenticated}
          />
        );

      default:

        return (
          <PageNotFound/>
        );
    }
  }
}

function mapStateToProps(state) {
  return {
    categoriesList: state.hobbies.list,
    userHobbies: state.auth.isAuthenticated ? state.user.hobbies : null,
    childrenHobbies: state.auth.isAuthenticated ? state.user.childrenHobbies : null,
    UIVersion: state.app.UIVersion,
    isAuthenticated: state.auth.isAuthenticated,
  };
}

export default withRouter(connect(mapStateToProps)(CategoriesContainer));
