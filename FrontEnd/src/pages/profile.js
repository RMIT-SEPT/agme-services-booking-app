import React, { useState } from 'react';
import '../css/profile.css';

const Profile = () => {
    // Images are random numbers, choose a random avatar!
    const randomNumber = Math.floor(1 + Math.random() * (6 - 1));

    // const profileDetails = await fetch('http://localhost:8080/api/v1/user/profile', {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     }
    // });

    const profileDetails = {
        firstName: "John",
        lastName: "Smith",
        userName: "john123",
        email: "john.s@hotmail.com",
        phone: "0411 222 333",
        address: "21 Lemon Street, Richmond VIC 3041"
    }

    // You'll notice theres a div for each detail.
    // Couldn't get label text and editable-label component to be inline together without everything being bad.
    return (
        <div className="profileContainer">
            <div id="avatarContainer">
                <img src={`${randomNumber}.png`} alt="Avatar"/>
                <p>{profileDetails.firstName} {profileDetails.lastName}</p>
            </div>
            <div id="profileDetailsContainer">
                <span>Username: <input value={profileDetails.userName}/> <br/></span> 
                <span>Email: <input value={profileDetails.email}/> <br/></span> 
                <span>Phone: <input value={profileDetails.phone}/> <br/></span> 
                <span>Address: <input value={profileDetails.address}/> <br/></span> 
            </div>
        </div>
    )
}

export default Profile;