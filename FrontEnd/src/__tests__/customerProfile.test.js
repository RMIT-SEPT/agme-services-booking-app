import React from 'react';
import Enzyme from 'enzyme';
import Profile from '../pages/profile.js';
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

localStorage.setItem('userDetails', JSON.stringify(userDetails));

test('renders without crashing', () => {
    const wrapper = shallow(<Profile/>);
})

global.fetch = jest.fn(() => Promise.resolve({}));
test('clicking update will alert user with message', async () => {
    const wrapper = shallow(<Profile/>);
    global.alert = jest.fn();
    const submitBtn = wrapper.find('#updateProfileBtn');

    // Simulate onclick function (enzyme .simulate doesnt work ????)
    await submitBtn.props().onClick();

    expect(submitBtn.length).toEqual(1);
    expect(global.alert).toHaveBeenCalledTimes(1);
    // Note: Don't need to test what alert msg is, since fetch is a mock it will always fail.
})

test('check onChange for firstNameInput field works as intended, with input "David"', async () => {
    const wrapper = shallow(<Profile/>);
    const firstNameInput = wrapper.find('.profileContainer #profileDetailsContainer #firstNameInput');

    firstNameInput.props().onChange({target: { value: "" } });
    firstNameInput.props().onChange({target: { value: "D" } });
    firstNameInput.props().onChange({target: { value: "Da" } });
    firstNameInput.props().onChange({target: { value: "Dav" } });
    firstNameInput.props().onChange({target: { value: "Davi" } });
    firstNameInput.props().onChange({target: { value: "David" } });

    expect(wrapper.find('.profileContainer #profileDetailsContainer #firstNameInput').props().value).toEqual("David");
})