import React from 'react';
import '../css/banner.css';
import SupportLinks from '../components/supportLinks.js';


const Banner = ( {userDetails} ) => {

    return(
        <div id="bannerContainer">
            <img src='logo.png'></img>
            <SupportLinks userDetails={userDetails}/>
        </div>
    )
}

export default Banner;