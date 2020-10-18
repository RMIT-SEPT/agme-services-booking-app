import React from 'react';
import Enzyme, {shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Profile from '../pages/profile.js';
import Appointment from '../components/appointment.js';
import BookingPage from '../pages/customer/bookingPage.js';
import HomeAppointments from '../components/homeAppointments.js';
import PastAppointments from '../components/pastAppointments.js';

import 'babel-polyfill';

Enzyme.configure({adapter: new Adapter()})

const userDetails = {
    userType: 'customer',
    firstName: 'Wayne',
    lastName: 'Kerr',
    username: 'wkerr56',
    password: '1234',
    phoneNumber: '0400000000',
    address: 'Bourke St'
}

const appointment = {
    bookingId: 1,
    startTime: new Date('September 14, 2020 18:00:00').toLocaleString(),
    endTime: new Date('September 14, 2020 18:30:00').toLocaleString(),
    workerEntity: {
        firstName: 'John',
        lastName: 'Smith'
    }
}

localStorage.setItem('userDetails', JSON.stringify(userDetails));

test('appointment component renders details correctly', () => {
    const wrapper = shallow(<Appointment details={appointment} userType={userDetails.userType}/>);
    const appTime = wrapper.find('.timeDiv');
    // test div has only two elements
    expect(appTime.children().length).toEqual(0);

    const appInfo = wrapper.find('.infoDiv');
    // test div has only two elements
    expect(appInfo.children().length).toEqual(0);
})

test('profile page renders user details correctly', () => {
    const wrapper = shallow(<Profile/>);

    const profileContainer = wrapper.find('#profileDetailsContainer');

    // test profile container has 8 child elements
    expect(profileContainer.children().length).toEqual(7);

    // test user details match
    expect(profileContainer.childAt(0).childAt(1).props().value).toEqual(userDetails.firstName); 
    expect(profileContainer.childAt(1).childAt(1).props().value).toEqual(userDetails.lastName);
    expect(profileContainer.childAt(2).childAt(1).props().value).toEqual(userDetails.username);
    expect(profileContainer.childAt(3).childAt(1).props().value).toBeUndefined();
    expect(profileContainer.childAt(4).childAt(1).props().value).toEqual(userDetails.phoneNumber);
    expect(profileContainer.childAt(5).childAt(1).props().value).toEqual(userDetails.address);
})

test('booking page renders without crashing', () => {
    const wrapper = shallow(<BookingPage/>);
})

test('home appointments component renders without crashing', () => {
    const wrapper = shallow(<HomeAppointments/>);
})

test('past appointments component renders without crashing', () => {
    const wrapper = shallow(<PastAppointments/>);
})