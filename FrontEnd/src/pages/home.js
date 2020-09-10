import React, { useState, useEffect } from 'react';
import { useHistory, Redirect, Route, useLocation } from 'react-router-dom';
import '../css/home.css';

import Dashboard from '../components/dashboard';
import SupportLinks from '../components/supportLinks.js';
import HomeAppointments from '../components/homeAppointments.js';
import PastAppointments from '../components/pastAppointments.js';
import BookingPage from './customer/bookingPage';
import Availability from './worker/availabilityPage';
import ProfilePage from './profile';

const Home = (loginResponse) => {
    var userRole;
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') === null ? false : true);
    const [userDetails, setUserDetails] = useState({});
    // Use Effect will execute upon fully rendering.
    useEffect(async() => {
        userRole = loginResponse.location.state.loginDetails.role;
        if (userRole === 'customer') {
            // Successful login, get user details from backend.
            const response = await fetch(`http://localhost:8080/api/v1/customer/profile`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(json => {
                    const details = {
                        userType: loginResponse.location.state.loginDetails.role,
                        username: json.username,
                        firstName: json.firstName,
                        lastName: json.lastName,
                        address: json.address,
                        phoneNumber: json.phoneNumber
                    }
                    setUserDetails(details);
                })
            });
        } else if (userRole === 'worker') {
            // Do a request for worker's profile details
            const details = {
                userType: loginResponse.location.state.loginDetails.role,
                username: "JohnnyJohnJohns",
                firstName: "John"
            }
            setUserDetails(details);

        } else {
            // Relevant admin details, if necessary.
            const details = {
                userType: loginResponse.location.state.loginDetails.role,
                username: "JohnnyJohnJohns",
                firstName: "John"
            }
            setUserDetails(details);
        }
    }, []);

    const pathname = window.location.pathname;

    const loadHomeMainView = () => {
        switch (userDetails.userType) {
            case ("customer"):
                switch (pathname) {
                    case "/home":
                        return <HomeAppointments userDetails={userDetails}/>
                    case "/profile":
                        return <ProfilePage userDetails={userDetails}/>
                    case "/booking":
                        return <BookingPage userDetails={userDetails}/>
                    case "/history":
                        return <PastAppointments userDetails={userDetails}/>
                }
                break;

            case ("worker"):
                switch (pathname) {
                    case "/home":
                        return <HomeAppointments userDetails={userDetails}/>
                    case "/profile":
                        return <HomeAppointments userDetails={userDetails}/>
                    case "/availability":
                        return <Availability userDetails={userDetails}/>
                    case "/history":
                        return <PastAppointments userDetails={userDetails}/>
                }
                break;

            case ("admin"):
                return "some admin calendar or something";

            default:
                return "ERROR: UserType not found, reload or somethin lmao";
        }
    }

    return (
        <div className="homeContainer">
            <Dashboard userDetails={userDetails}/>
            <div className="homeMainArea">
                <SupportLinks userDetails={userDetails}/>
                {loadHomeMainView()}
            </div>
        </div>
    )
}

export default Home;