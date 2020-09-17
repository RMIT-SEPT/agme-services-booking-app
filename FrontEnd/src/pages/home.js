import React, { useState, useEffect } from 'react';
import '../css/home.css';

import Dashboard from '../components/dashboard';
import SupportLinks from '../components/supportLinks.js';
import HomeAppointments from '../components/homeAppointments.js';
import PastAppointments from '../components/pastAppointments.js';
import BookingPage from './customer/bookingPage';
import Availability from './worker/availabilityPage';
import ProfilePage from './profile';
import WorkerList from './admin/workerList';
import AdminCalendar from './admin/adminCalendar';

const Home = () => {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') === null ? false : true);
    const [userDetails, setUserDetails] = useState({});

    useEffect(async() => {
        const fetchData = async() => {
            const userRole = localStorage.getItem('role');
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
                            userType: userRole,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName,
                            address: json.address,
                            phoneNumber: json.phoneNumber
                        }
                        localStorage.setItem('userDetails', JSON.stringify(details));
                        setUserDetails(details);
                    } else if (userRole == 'worker') {
                        const details = {
                            userType: userRole,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName,
                            role: json.role
                        }
                        localStorage.setItem('userDetails', JSON.stringify(details));
                        setUserDetails(details);
                    } else if (userRole == 'admin') {
                        // Not sure admin's details payload.
                        const details = {
                            userType: userRole,
                            id: json.id,
                            username: json.username,
                            firstName: json.firstName,
                            lastName: json.lastName
                        }
                        localStorage.setItem('userDetails', JSON.stringify(details));
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
                        return <HomeAppointments/>
                    case "/profile":
                        return <ProfilePage/>
                    case "/booking":
                        return <BookingPage/>
                    case "/history":
                        return <PastAppointments/>
                }
                break;

            case ("worker"):
                switch (pathname) {
                    case "/home":
                        return <HomeAppointments/>
                    case "/profile":
                        return <ProfilePage/>
                    case "/availability":
                        return <Availability/>
                    case "/history":
                        return <PastAppointments/>
                }
                break;

            case ("admin"):
                switch (pathname) {
                    case "/home":
                        return <WorkerList/>
                    case "/businesshours":
                        return <AdminCalendar/>
                    case "/history":
                        return <PastAppointments/>
                    case "/createbookings":
                        return <PastAppointments/>
                }
                break;
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