import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setEmailState = (newValue) => {
        setEmail(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const handleSubmit = async (loginInfo) => {
        alert(`Submittedddd: ${email} and ${password}`);

        var data = {

        };

        // use whatever the springboot url is
        const response = await fetch('localhost:3001/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }

    return(
        <div id="loginContainer">
            <h1 id="header">Login</h1>
            <div id="formArea">
                <form id="loginForm" onSubmit={handleSubmit}>
                    <input className="loginInputField" name="email" type="email" placeholder=" Email" onChange={setEmailState}/>
                    <input className="loginInputField" name="password" type="password" placeholder=" Password" onChange={setPasswordState}/>
                    <input className="submitBtn" type="button" value="Login" onClick={handleSubmit}/>
                    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;