import React, { useState } from 'react';
import '../css/profile.css';

const Profile = ({userDetails}) => {
    // Images are random numbers, choose a random avatar!
    const randomNumber = Math.floor(1 + Math.random() * (6 - 1));

    const userType = userDetails.userType;
    const [editedDetails, setEditedDetails] = useState(false);
    const [username, setUsername] = useState(userDetails.username);
    const [phoneNumber, setPhoneNumber] = useState(userDetails.phoneNumber);
    const [address, setAddress] = useState(userDetails.address);

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPhoneNumberState = (newValue) => {
        setPhoneNumber(newValue.target.value);
    }

    const setAddressState = (newValue) => {
        setAddress(newValue.target.value);
    }

    const handleSubmit = async () => {
        // JSON to send to backend API
        const data = {
            username: username,
            phoneNumber: phoneNumber,
            address: address
        };

        // POST request to backend with the data JSON
        const response = await fetch(`http://localhost:8080/api/v1/${userType}/profile/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                setEditedDetails(true);
            }
        });
    }

    return (
        <div className="profileContainer">
            <div id="avatarContainer">
                <img src={`${randomNumber}.png`} alt="Avatar"/>
                <p>{userDetails.firstName} {userDetails.lastName}</p>
            </div>
            <div id="profileDetailsContainer">
                <span>Username: <input value={username} onChange={setUsernameState}/> <br/></span> 
                <span>Phone: <input value={phoneNumber} onChange={setPhoneNumberState}/> <br/></span> 
                <span>Address: <input value={address} onChange={setAddressState}/> <br/></span> 
                <input id="submitBtn" type="button" value="Change Details" onClick={handleSubmit}/>
                { editedDetails ? <p>Successfully Edited Profile Details.</p> : null}
            </div>
        </div>
    )
}

export default Profile;