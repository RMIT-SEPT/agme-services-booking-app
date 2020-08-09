import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/signup';

const Main = () =>  {
    return (
        <Switch>
            <Route exact path='/' component={Login}></Route>
            <Route exact path='/signup' component={Signup}></Route>
        </Switch>
    );
}

export default Main;