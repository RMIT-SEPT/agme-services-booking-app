import React from 'react';
import Enzyme from 'enzyme';
import SupportLinks from '../components/supportLinks.js';
import Adapter from 'enzyme-adapter-react-16';

import 'babel-polyfill';
import { cleanup } from '@testing-library/react';
import { shallow } from 'enzyme';

Enzyme.configure({adapter: new Adapter()})
afterEach(cleanup);

const userDetails = {
    userType: 'customer',
    firstName: 'Conant',
    lastName: 'Merigot',
    username: 'cmerigot2',
    password: '1234',
    phoneNumber: '357 290 8605',
    address: '080 Atwood Park'
}

var localStorageMock = (function() {
    var store = {};
    return {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        },
        removeItem: function(key) {
            delete store[key];
        },
        length: function() {
            return Object.keys(store).length;
        }
    };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });
window.localStorage.setItem('userDetails', userDetails);


test('renders without crashing', () => {
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
})

test('clicking on about should bring up modal text', () => {
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
    const aboutBtn = wrapper.find('#aboutBtn');

    aboutBtn.simulate('click');

    expect(aboutBtn.prop('children')).toEqual('ABOUT');
    // Every child is considered as a body of text or a <br/>
    expect(wrapper.find('#aboutUsContainer .modalText').props().children.length).toEqual(7);
})

test('clicking on contact should bring up modal text', () => {
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
    const contactBtn = wrapper.find('#contactBtn');

    contactBtn.simulate('click');

    expect(contactBtn.prop('children')).toEqual('CONTACT');
    // Every child is considered as a body of text or a <br/>
    expect(wrapper.find('#contactUsContainer .modalText').props().children.length).toEqual(5);
})

test('click on logout will bring up confirmation window', () => {
    global.confirm = jest.fn();
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
    const logoutBtn = wrapper.find('#logoutBtn');

    // Test expectations before and after the click. This test doesn't actually say 'yes' or 'no' to window.confirm, so localStorage should be same.
    expect(global.confirm).toHaveBeenCalledTimes(0);
    expect(window.localStorage.length()).toBeGreaterThan(0);
    logoutBtn.simulate('click');
    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(window.localStorage.length()).toBeGreaterThan(0);
})

test('when clicking logout, press cancel', () => {
    global.alert = jest.fn();
    global.confirm = jest.fn(() => false);
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
    const logoutBtn = wrapper.find('#logoutBtn');

    // Test expectations before and after the click. This test says no, so localstorage will stay the same.
    expect(global.confirm).toHaveBeenCalledTimes(0);
    expect(window.localStorage.length()).toBeGreaterThan(0);
    expect(global.alert).toHaveBeenCalledTimes(0);
    logoutBtn.simulate('click');

    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledTimes(0);
    expect(window.localStorage.length()).toBeGreaterThan(0);
})

const mockHistoryPush = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
        useHistory: () => ({
            push: mockHistoryPush
        }),
}));
test('when clicking logout, press confirm', () => {
    global.confirm = jest.fn(() => true);
    global.alert = jest.fn();
    const wrapper = shallow(<SupportLinks userDetails={userDetails}/>);
    const logoutBtn = wrapper.find('#logoutBtn');

    // Test expectations before and after the click. This test says yes, so localstorage will empty, there will be an alert,
    expect(global.confirm).toHaveBeenCalledTimes(0);
    expect(global.alert).toHaveBeenCalledTimes(0);
    expect(window.localStorage.length()).toBeGreaterThan(0);
    logoutBtn.simulate('click');

    expect(global.confirm).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledTimes(1);
    expect(window.localStorage.length()).toEqual(0);
    expect(mockHistoryPush).toHaveBeenCalledTimes(1);
    expect(mockHistoryPush).toHaveBeenCalledWith("/");
})