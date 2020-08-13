import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const handleSubmit = async (loginInfo) => {
        alert(`Submittedddd: ${username} and ${password}`);

        const data = {
            username: username,
            password: password
        };

        // use whatever the springboot url is
        const response = await fetch('http://localhost:8080/api/v1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        alert(`Response: ${response}`);
    }

    return(
        <div id="loginContainer">
            <h1 id="header">Login</h1>
            <div id="formArea">
                <form id="loginForm">
                    <input className="loginInputField" name="username" type="text" placeholder=" Username" onChange={setUsernameState}/>
                    <input className="loginInputField" name="password" type="password" placeholder=" Password" onChange={setPasswordState}/>
                    <input className="submitBtn" type="button" value="Login" onClick={handleSubmit}/>
                    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;