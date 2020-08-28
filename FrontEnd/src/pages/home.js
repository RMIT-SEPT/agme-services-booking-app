import React, { useState } from 'react';
import '../css/home.css';

import Dashboard from '../components/dashboard';
import SupportLinks from '../components/supportLinks.js';
import HomeAppointments from '../components/homeAppointments.js';
import PastAppointments from '../components/pastAppointments.js';
import BookingPage from './customer/bookingPage';
import Availability from './worker/availabilityPage';

const Home = (response) => {
    // Probably doesn't need to use state, since the user details don't change on this page.
    const [userDetails, setUserDetails] = useState(response.location.state);
    const userName = userDetails.userName;
    const address = userDetails.address;
    const userType = userDetails.userType;
    const token = userDetails.token;

    const pathname = response.location.pathname;

    const loadHomeMainView = () => {
        switch (userType) {
            case ("customer"):
                switch (pathname) {
                    case "/home":
                        return <HomeAppointments userDetails={userDetails}/>
                    case "/profile":
                        return <HomeAppointments userDetails={userDetails}/>
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
    /* Make a fetch everytime this page is loaded to get appointments for a customer. MAYBE better way to not just do this tho */

    // const appointments = await fetch('http://localhost:8080/api/v1/user/login', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // });
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