import React from 'react';
import { Switch, Route } from 'react-router-dom'

import AllRecipes from './AllRecipes';
import OneRecipe from './OneRecipe';

const Recipes = ({user}) => {

  return (
    <Switch>
      <Route exact path='/recipes'>
        <AllRecipes user={user}/>
      </Route>
      <Route exact path='/recipes/my'>
        <AllRecipes onlyMy user={user}/>
      </Route>
      <Route exact path='/recipes/liked'>
        <AllRecipes liked user={user}/>
      </Route>
      <Route path='/recipes/:id'>
        <OneRecipe user={user}/>
      </Route>
    </Switch>
  );
};

export default Recipes;
