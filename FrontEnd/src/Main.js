import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';

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
            <Route exact path='/workers' component={Home}></Route>
            <Route exact path='/businesshours' component={Home}></Route>
            <Route exact path='/createbookings' component={Home}></Route>

        </Switch>
    );
}

export default Main;