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
import AdminBookings from './admin/adminBookings';
import AdminBusinessHours from './admin/adminBusinessHours';
import { useIdleTimer } from 'react-idle-timer'
import { useHistory } from 'react-router-dom';

const Home = () => {
    const history = useHistory();

    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') === null ? false : true);
    const [userDetails, setUserDetails] = useState({});
    // 600000 = 10 minutes
    const timeoutMs = 3600000;
    
    // If user comes to this page when token has already expired or is not present, redirect to login page.
    if (new Date().getTime() > new Date(localStorage.getItem('token-expiry')).getTime() && localStorage.getItem('token') !== null) {
        alert(`Your session has expired. Redirecting back to login page.`);
        localStorage.clear();
        history.push("/");
    }

    const handleOnIdle = event => {
        alert(`You have been idle for more than ${Math.floor(timeoutMs / 60000)} minutes. Redirecting back to login page.`);
        localStorage.clear();
        history.push("/");
    }

    // Tracks idle activity. If idle for more than X minutes, log user out.
    useIdleTimer({
        timeout: timeoutMs,
        onIdle: handleOnIdle,
    })

    useEffect(() => {
        // If false, which is only when the user tries to come to this page without a token, redirect to login.
        if (!authenticated) {
            localStorage.clear();
            history.push("/");
        }
        else {
            const fetchData = async() => {
                const userRole = localStorage.getItem('role');
                await fetch(process.env.REACT_APP_API_URL + `/api/v1/${userRole}/profile`, {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(json => {
                        if (userRole === 'customer') {
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
                        } else if (userRole === 'worker') {
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
                        } else if (userRole === 'admin') {
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
        }
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
                    default:
                        return;
                }

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
                    default:
                        return;
                }

            case ("admin"):
                switch (pathname) {
                    case "/home":
                        return <WorkerList/>
                    case "/businesshours":
                        return <AdminBusinessHours/>
                    case "/history":
                        return <PastAppointments/>
                    case "/createbookings":
                        return <AdminBookings/>
                    default:
                        return;
                }

            default:
                return;
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