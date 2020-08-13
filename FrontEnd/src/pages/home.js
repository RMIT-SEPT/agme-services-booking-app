import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/home.css';

import Dashboard from '../components/dashboard.js';

const Home = (response) => {
    // Probably doesn't need to use state, since the user details
    const [userDetails, setUserDetails] = useState(response.location.state);
    const userName = userDetails.username;
    const address = userDetails.address;
    const userType = userDetails.userType;

    return (
        <div className="homeContainer">
            <Dashboard userDetails={userDetails}/>
        </div>
    )
}

export default Home;