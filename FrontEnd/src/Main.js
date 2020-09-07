import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import Profile from './pages/profile';

const Main = () =>  {
    return (
        <Switch>
            <Route exact path='/' component={Login}></Route>
            <Route exact path='/signup' component={Signup}></Route>
            <Route exact path='/home' component={Home}></Route>
            <Route exact path='/profile' component={Home}></Route>
            <Route exact path='/employees' component={Home}></Route>
            <Route exact path='/availability' component={Home}></Route>
            <Route exact path='/booking' component={Home}></Route>
            <Route exact path='/history' component={Home}></Route>
        </Switch>
    );
}

export default Main;