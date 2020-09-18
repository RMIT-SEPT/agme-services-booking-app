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

test('appointment component renders details correctly', () => {
    const wrapper = shallow(<Appointment details={appointment}/>);

    const appTime = wrapper.find('.timeDiv');
    // test div has only two elements
    expect(appTime.children().length).toEqual(2);

    // test div has expected appointment values
    expect(appTime.childAt(0).text()).toEqual(appointment.startTime);
    expect(appTime.childAt(1).text()).toEqual(appointment.endTime);

    const appInfo = wrapper.find('.infoDiv');
    // test div has only two elements
    expect(appInfo.children().length).toEqual(2);

    // test div has expected appointment values
    expect(appInfo.childAt(0).text()).toMatch(`${appointment.bookingId}`);
    expect(appInfo.childAt(1).text()).toMatch(`${appointment.workerEntity.firstName}`);
    expect(appInfo.childAt(1).text()).toMatch(`${appointment.workerEntity.firstName}`);
})

test('profile page renders user details correctly', () => {
    const wrapper = shallow(<Profile userDetails={userDetails}/>);

    const profileContainer = wrapper.find('#profileDetailsContainer');

    // test profile container has 8 child elements
    expect(profileContainer.children().length).toEqual(8);

    // test user details match
    expect(profileContainer.childAt(0).childAt(1).props().value).toEqual(userDetails.firstName); 
    expect(profileContainer.childAt(1).childAt(1).props().value).toEqual(userDetails.lastName);
    expect(profileContainer.childAt(2).childAt(1).props().value).toEqual(userDetails.username);
    expect(profileContainer.childAt(3).childAt(1).props().value).toEqual(userDetails.password);
    expect(profileContainer.childAt(4).childAt(1).props().value).toEqual(userDetails.phoneNumber);
    expect(profileContainer.childAt(5).childAt(1).props().value).toEqual(userDetails.address);
})

test('booking page renders without crashing', () => {
    const wrapper = shallow(<BookingPage userDetails={userDetails}/>);
})

test('home appointments component renders without crashing', () => {
    const wrapper = shallow(<HomeAppointments userDetails={userDetails}/>);
})

test('past appointments component renders without crashing', () => {
    const wrapper = shallow(<PastAppointments userDetails={userDetails}/>);
})