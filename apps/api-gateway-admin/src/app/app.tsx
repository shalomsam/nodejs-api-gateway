import React from 'react';
import { Route, Switch, Redirect, BrowserRouter } from 'react-router-dom';
import { PrivateRoute } from '../helpers/PrivateRoute';
import Home from '../pages/Dashboard/Home';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';


function App() {

  return (
    <BrowserRouter>
      <Switch>
        <PrivateRoute exact path="/home" component={Home} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/register" component={RegisterPage} />
        <Redirect from="*" to="/login" />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
