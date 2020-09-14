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

    useEffect(async() => {
        const fetchData = async() => {
            userRole = loginResponse.location.state.loginDetails.role;
            const response = await fetch(`http://localhost:8080/api/v1/${userRole}/profile`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(json => {
                    if (userRole == 'customer') {
                        const details = {
                            userType: loginResponse.location.state.loginDetails.role,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName,
                            address: json.address,
                            phoneNumber: json.phoneNumber
                        }
                        setUserDetails(details);
                    } else if (userRole == 'worker') {
                        const details = {
                            userType: loginResponse.location.state.loginDetails.role,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName,
                            role: json.role
                        }
                        setUserDetails(details);
                    } else if (userRole == 'admin') {
                        // Not sure admin's details payload.
                        const details = {
                            userType: loginResponse.location.state.loginDetails.role,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName
                        }
                        setUserDetails(details);
                    }
                })
            })
        }
        fetchData();
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
                        return <ProfilePage userDetails={userDetails}/>
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