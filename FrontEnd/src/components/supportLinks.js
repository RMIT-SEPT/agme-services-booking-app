import React from 'react';
import { Link } from 'react-router-dom';
import '../css/supportLinks.css';

const SupportLinks = (userJSON) => {
    const userType = userJSON.userDetails.userType;
    const userName = userJSON.userDetails.userName;

    return(
        <div id="supportLinks">
            <Link className="individualSupportItem" to="/aboutus">About Us</Link>
            <Link className="individualSupportItem" to="/contactus">Contact Us</Link>
            <span className="individualSupportItem">Welcome, {userName}!</span>
        </div>
    )
}

export default SupportLinks;