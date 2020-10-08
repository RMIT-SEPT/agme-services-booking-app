import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import '../css/profile.css';

const Profile = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;
    const [firstName, setFirstName] = useState(userDetails.firstName);
    const [lastName, setLastName] = useState(userDetails.lastName);
    const [username, setUsername] = useState(userDetails.username);
    const [password, setPassword] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(userDetails.phoneNumber);
    const [address, setAddress] = useState(userDetails.address);

    const setFirstNameState = (newValue) => {
        setFirstName(newValue.target.value);
    }

    const setLastNameState = (newValue) => {
        setLastName(newValue.target.value);
    }

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const setPhoneNumberState = (newValue) => {
        setPhoneNumber(newValue.target.value);
    }

    const setAddressState = (newValue) => {
        setAddress(newValue.target.value);
    }

    const handleSubmit = async () => {
        // JSON to send to backend API. Compare new states with the original in userDetail, and only send the ones you're changing.
        const data = { };
        if (userDetails.firstName !== firstName)
            data.firstName = firstName
        if (userDetails.lastName !== lastName)
            data.lastName = lastName;
        if (userDetails.username !== username)
            data.username = username;
        if (password !== null) 
            data.password = password;
        if (userDetails.phoneNumber !== phoneNumber)
            data.phoneNumber = phoneNumber;
        if (userDetails.address !== address)
            data.address = address;

        // POST request to backend with the data JSON
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/profile/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                alert('Successfully edited profile details. Please re-login to view your new details.');
            } else {
                alert('Failed to edit profile details.');
            }
        });
    }

    const customerView = () => {
        return (
            <React.Fragment>
                <span>First Name <input value={firstName} onChange={setFirstNameState}/> <br/></span> 
                <span>Last Name <input value={lastName} onChange={setLastNameState}/> <br/></span> 
                <span>Username <input value={username} onChange={setUsernameState}/> <br/></span> 
                <span>Password <input placeholder="Enter new password" onChange={setPasswordState}/> <br/></span> 
                <span>Phone <input value={phoneNumber} onChange={setPhoneNumberState}/> <br/></span> 
                <span>Address <input value={address} onChange={setAddressState}/> <br/></span> 
                <input id="submitBtn" type="button" value="Update Details" onClick={handleSubmit}/>
            </React.Fragment>
        )
    }

    const workerView = () => {
        return (
            <React.Fragment>
                <p id="worker-username">Username: {username}</p>
            </React.Fragment>
        )
    }

    return (
        <div>
            <Card.Header>Profile</Card.Header>
            <div className="profileContainer">
                <div id="avatarContainer">
                    <img src={`${userDetails.id % 5}.png`} alt="Avatar"/>
                    <p>{userDetails.firstName} {userDetails.lastName}</p>
                </div>
                <div id="profileDetailsContainer">
                    {userType === 'customer' ? customerView() : workerView()}
                </div>
            </div>
        </div>
    )
}

export default Profile;