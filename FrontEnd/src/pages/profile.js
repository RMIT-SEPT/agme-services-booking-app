import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import '../css/profile.css';

const Profile = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;
    const userRole = userDetails.role;
    const [firstName, setFirstName] = useState(userDetails.firstName);
    const [lastName, setLastName] = useState(userDetails.lastName);
    const [username, setUsername] = useState(userDetails.username);
    const [password, setPassword] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(userDetails.phoneNumber);
    const [address, setAddress] = useState(userDetails.address);
    const history = useHistory();

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

    const deleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account?")) {
            // POST request to backend with the data JSON
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/profile/delete/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
            }).then(response => {
                if (response.ok) {
                    localStorage.clear();
                    window.alert("Account deleted. Redirecting to login page.");
                    history.push("/");
                } else {
                    alert('Failed to delete account');
                }
            });
        }
    }

    const customerView = () => {
        return (
            <React.Fragment>
                <span>First Name <input id="firstNameInput" value={firstName} onChange={setFirstNameState}/> <br/></span> 
                <span>Last Name <input id="lastNameInput" value={lastName} onChange={setLastNameState}/> <br/></span> 
                <span>Username <input id="usernameInput" value={username} onChange={setUsernameState}/> <br/></span> 
                <span>Password <input id="passwordInput" placeholder="Enter new password" onChange={setPasswordState}/> <br/></span> 
                <span>Phone <input id="phoneInput" value={phoneNumber} onChange={setPhoneNumberState}/> <br/></span> 
                <span>Address <input id="addressInput" value={address} onChange={setAddressState}/> <br/></span> 
                <div id="profileButtons">
                <input id="updateProfileBtn" type="button" value="Update Details" onClick={handleSubmit}/>
                <div id="profileSpacer"></div>
                <input id="deleteProfileBtn" type="button" value="Delete Account" onClick={deleteAccount}/>
                </div>
            </React.Fragment>
        )
    }

    const workerView = () => {
        return (
            <React.Fragment>
                <span>Username <input id="username" value={username}/> <br/></span>
                <span>Role <input id="role" value={userRole}/> <br/></span>
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