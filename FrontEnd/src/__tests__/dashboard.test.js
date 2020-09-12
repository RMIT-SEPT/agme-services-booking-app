import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from '../components/dashboard.js';

test('renders', ()=> {
    const div = document.createElement('div');

    const userDetails = {
        userType: 'customer'
    }
    ReactDOM.render(<Dashboard userDetails={userDetails}/>, div);
})