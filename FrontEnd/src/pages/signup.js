import React from 'react';
import { Link } from 'react-router-dom';
import '../css/signup.css';

const Signup = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const setFirstNameState = (newValue) => {
        setFirstName(newValue.target.value);
    }

    const setLastNameState = (newValue) => {
        setLastName(newValue.target.value);
    }

    const setAddressState = (newValue) => {
        setAddress(newValue.target.value);
    }

    const setPhoneState = (newValue) => {
        setPhone(newValue.target.value);
    }

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const handleSubmit = async (signupInfo) => {
        alert(`Submitted: ${JSON.stringify(signupInfo)}`)
        
        const data = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
            username: username,
            password: password
        };

        // use whatever the springboot url is
        const response = await fetch('localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        alert(`Response: ${response}`);
    }

    return(
        <div id="signupContainer">
            <h1 id="header">Sign Up</h1>
            <div id="formArea">
                <form id="loginForm" onSubmit={handleSubmit} method="POST">
                    <input name="firstName" type="text" placeholder=" First Name" onchange={setFirstNameState}/>
                    <input name="lastName" type="text" placeholder=" Last Name" onchange={setLastNameState}/>
                    <input name="address" type="text" placeholder=" Address" onchange={setAddressState}/>
                    <input name="phone" type="tel" placeholder=" Phone" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}" onchange={setPhoneState}/>
                    <input name="username" type="text" placeholder=" Username" onchange={setUsernameState}/>
                    <input name="password" type="password" placeholder=" Password" onchange={setPasswordState}/>
                    <button id="submitBtn" type="submit">Register</button>
                    <p>Already have an account? <Link to="/">Login here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Signup;