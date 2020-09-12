import React, { useState } from 'react';
import '../css/profile.css';

const Profile = ({userDetails}) => {
    // Images are random numbers, choose a random avatar!
    const randomNumber = Math.floor(1 + Math.random() * (6 - 1));

    const userType = userDetails.userType;
    const [editedDetails, setEditedDetails] = useState('');
    const [firstName, setFirstName] = useState(userDetails.firstName);
    const [lastName, setLastName] = useState(userDetails.lastName);
    const [username, setUsername] = useState(userDetails.username);
    const [password, setPassword] = useState(userDetails.password);
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
        // JSON to send to backend API
        const data = {
            username: username,
            phoneNumber: phoneNumber,
            address: address
        };

        // POST request to backend with the data JSON
        const response = await fetch(`http://localhost:8080/api/v1/customer/profile/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                setEditedDetails('Successfully Edited Profile Details.');
            } else {
                setEditedDetails('Failed to Edit Profile Details.');
            }
        });
    }

    const customerView = () => {
        return (
            <React.Fragment>
                <span>First Name: <input value={firstName} onChange={setFirstNameState}/> <br/></span> 
                <span>Last Name: <input value={lastName} onChange={setLastNameState}/> <br/></span> 
                <span>Username: <input value={username} onChange={setUsernameState}/> <br/></span> 
                <span>Password: <input value={password} onChange={setPasswordState}/> <br/></span> 
                <span>Phone: <input value={phoneNumber} onChange={setPhoneNumberState}/> <br/></span> 
                <span>Address: <input value={address} onChange={setAddressState}/> <br/></span> 
                <input id="submitBtn" type="button" value="Change Details" onClick={handleSubmit}/>
                <p>{editedDetails}</p>
            </React.Fragment>
        )
    }

    const workerView = () => {
        return (
            <React.Fragment>
                <p>Username: {username}</p>
            </React.Fragment>
        )
    }

    return (
        <div className="profileContainer">
            <div id="avatarContainer">
                <img src={`${randomNumber}.png`} alt="Avatar"/>
                <p>{userDetails.firstName} {userDetails.lastName}</p>
            </div>
            <div id="profileDetailsContainer">
                {userType === 'customer' ? customerView() : workerView()}
            </div>
        </div>
    )
}

export default Profile;