import React from 'react';
import { Switch, Route } from 'react-router';
import Bundle from '../../../core/Bundle';

/* eslint-disable */
import loadList from 'bundle-loader?lazy!./List';

import loadCategory from 'bundle-loader?lazy!./Category';
import loadEditCategory from 'bundle-loader?lazy!./CategoryForm';
import loadNewCategory from 'bundle-loader?lazy!./CategoryForm';

import loadNewHobby from 'bundle-loader?lazy!./HobbyForm';
import loadEditHobby from 'bundle-loader?lazy!./HobbyForm';

import loadPageNotFound from 'bundle-loader?lazy!../../../pages/_errors/PageNotFound';
/* eslint-enable */

const ListBundle = Bundle.generateBundle(loadList);
const CategoryBundle = Bundle.generateBundle(loadCategory);
const EditCategoryBundle = Bundle.generateBundle(loadEditCategory);
const NewCategoryBundle = Bundle.generateBundle(loadNewCategory);

const NewHobbyBundle = Bundle.generateBundle(loadNewHobby);
const EditHobbyBundle = Bundle.generateBundle(loadEditHobby);

const PageNotFoundBundle = Bundle.generateBundle(loadPageNotFound);

class HobbiesSwitch extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/administration/hobbies"
          component={ListBundle}
        />
        <Route
          exact
          path="/administration/hobbies/new"
          component={NewCategoryBundle}
        />
        <Route
          exact
          path="/administration/hobbies/:categoryId"
          component={CategoryBundle}
        />
        <Route
          exact
          path="/administration/hobbies/:categoryId/edit"
          component={EditCategoryBundle}
        />
        <Route
          exact
          path="/administration/hobbies/:categoryId/new"
          component={NewHobbyBundle}
        />
        <Route
          exact
          path="/administration/hobbies/:categoryId/edit/:hobbyId"
          component={EditHobbyBundle}
        />
        <Route component={PageNotFoundBundle} />
      </Switch>
    );
  }
}

export default HobbiesSwitch;
