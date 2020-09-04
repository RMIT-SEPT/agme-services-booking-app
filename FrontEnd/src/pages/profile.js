import React, { useState } from 'react';
import '../css/profile.css';

const Profile = ({userDetails}) => {
    // Images are random numbers, choose a random avatar!
    const randomNumber = Math.floor(1 + Math.random() * (6 - 1));

    // You'll notice theres a div for each detail.
    // Couldn't get label text and editable-label component to be inline together without everything being bad.
    return (
        <div className="profileContainer">
            <div id="avatarContainer">
                <img src={`${randomNumber}.png`} alt="Avatar"/>
                <p>{userDetails.firstName} {userDetails.lastName}</p>
            </div>
            <div id="profileDetailsContainer">
                <span>Username: <input value={userDetails.username}/> <br/></span> 
                <span>Phone: <input value={userDetails.phoneNumber}/> <br/></span> 
                <span>Address: <input value={userDetails.address}/> <br/></span> 
            </div>
        </div>
    )
}

export default Profile;