import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../css/home.css';

import Dashboard from '../components/dashboard.js';
import SupportLinks from '../components/supportLinks.js';
import HomeAppointments from '../components/homeAppointments.js';

const Home = (response) => {
    // Probably doesn't need to use state, since the user details don't change on this page.
    const [userDetails, setUserDetails] = useState(response.location.state);
    const userName = userDetails.userName;
    const address = userDetails.address;
    const userType = userDetails.userType;
    const token = userDetails.token;

    const loadHomeMainView = () => {
        switch (userType) {
            case ("customer"):
            case ("worker"):
                return <HomeAppointments userDetails={userDetails}/>

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