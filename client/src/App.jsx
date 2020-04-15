import React, {useEffect, useState} from 'react';
import { Switch, Route, Redirect } from 'react-router-dom'
import AppBar from './components/appBar/AppBar';
import Recipes from './components/recipes/Recipes';
import Add from './components/recipes/Add';
import Edit from './components/recipes/Edit';
import API from './utils/api';
import AUTH from './utils/auth';
import Login from './components/authorisation/Login';
import SignUp from './components/authorisation/SignUp';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = (user, jwt_token) => {
    setUser(user);
    localStorage.setItem('jwt_token', jwt_token)
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem('jwt_token', '');
  };

  useEffect(() => {
    if (!!localStorage.getItem('jwt_token').length) {
      setIsLoading(true);

      AUTH.get(`me`, {
        headers: {Authorization: localStorage.getItem('jwt_token')}
      })
      .then(res => {
        const user = res.data;
        setUser(user);
        setIsLoading(false);
      })
      .catch(error => {
        localStorage.setItem('jwt_token', '');
        setIsLoading(false);
      });
    }
  }, []);

  return (
    <div className="App">
      <AppBar user={user} logout={logout}/>
      <Switch>
        <Route exact path='/'>
          <Redirect to="/recipes"/>
        </Route>
        <Route path='/recipes'>
          <Recipes user={user}/>
        </Route>
        <Route path='/add'>
          <Add user={user}/>
        </Route>
        <Route path='/edit/:id' component={Edit}/>
        <Route path='/login'>
          <Login user={user} login={login}/>
        </Route>
        <Route path='/signUp'>
          <SignUp user={user} login={login}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
