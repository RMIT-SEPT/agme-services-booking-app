import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Dashboard from '../components/dashboard.js';
import Adapter from 'enzyme-adapter-react-16';

import { cleanup } from '@testing-library/react'
import { shallow } from 'enzyme';

Enzyme.configure({adapter: new Adapter()})
afterEach(cleanup);

const customerDetails = {
    userType: 'customer'
}

const workerDetails = {
    userType: 'worker'
}

const adminDetails = {
    userType: 'admin'
}

global.window = { location: { pathname: null } }

test('renders without crashing', () => {
    const wrapper = shallow(<Dashboard userDetails={customerDetails}/>);
})

test('renders with correct buttons for customer type', () => {
    const wrapper = shallow(<Dashboard userDetails={customerDetails}/>);
    
    // Get ID's within the Dashboard
    const home = wrapper.find('#home');
    const profile = wrapper.find('#profile');
    const booking = wrapper.find('#booking');
    const history = wrapper.find('#history');

    // Check that there is ONE ID of each in the Dashboard.
    expect(home.length).toEqual(1);
    expect(profile.length).toEqual(1);
    expect(booking.length).toEqual(1);
    expect(history.length).toEqual(1);

    // Check both the worker unique button and admin unique button do NOT exist in the Dashboard.
    const availability = wrapper.find('#availability');
    const employees = wrapper.find('#employees');
    expect(availability.length).toEqual(0);
    expect(employees.length).toEqual(0);
})

test('renders with correct buttons for worker type', () => {
    const wrapper = shallow(<Dashboard userDetails={workerDetails}/>);
    
    // Get ID's within the Dashboard
    const home = wrapper.find('#home');
    const profile = wrapper.find('#profile');
    const availability = wrapper.find('#availability');
    const history = wrapper.find('#history');

    // Check that there is ONE ID of each in the Dashboard.
    expect(home.length).toEqual(1);
    expect(profile.length).toEqual(1);
    expect(availability.length).toEqual(1);
    expect(history.length).toEqual(1);

    // Check both the customer unique button and admin unique button do NOT exist in the Dashboard.
    const booking = wrapper.find('#booking');
    const employees = wrapper.find('#employees');
    expect(booking.length).toEqual(0);
    expect(employees.length).toEqual(0);
})

test('renders with correct buttons for admin type', () => {
    const wrapper = shallow(<Dashboard userDetails={adminDetails}/>);
    
    // Get ID's within the Dashboard
    const home = wrapper.find('#home');
    const profile = wrapper.find('#profile');
    const employees = wrapper.find('#employees');
    const history = wrapper.find('#history');

    // Check that there is ONE ID of each in the Dashboard.
    expect(home.length).toEqual(1);
    expect(profile.length).toEqual(1);
    expect(employees.length).toEqual(1);
    expect(history.length).toEqual(1);

    // Check both the customer unique button and worker unique button do NOT exist in the Dashboard.
    const booking = wrapper.find('#booking');
    const availability = wrapper.find('#availability');
    expect(booking.length).toEqual(0);
    expect(availability.length).toEqual(0);
})

// Mock 'history' in dashboard, since you cannot access useHistory through unit tests.
const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useHistory: () => ({
            push: mockHistoryPush
        }),
}));
test('clicking profile button (for any user type) will correctly push path onto history with the current state (userDetails)', () => {
    const wrapper = shallow(<Dashboard userDetails={customerDetails}/>);
    const profileButton = wrapper.find('#profile');

    const event = { target: { id: 'profile' } };

    // Simulate the onClick function
    profileButton.simulate('click', event );

    // Check that after clicking profile button, path was pushed onto history, as well as the userDetails state.
    expect(mockHistoryPush).toBeCalledWith('/profile', {"userType": "customer"});
})