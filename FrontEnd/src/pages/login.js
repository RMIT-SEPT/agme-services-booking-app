import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../css/login.css';

const Login = () => {

    const history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') === null ? false : true);
    const [responseMsg, setResponseMsg] = useState('');

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const handleSubmit = async () => {

        // JSON to send to backend API
        const data = {
            username: username,
            password: password
        };

        // POST request to backend with the data JSON
        await fetch('http://localhost:8080/api/v1/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    const expiryTime = new Date();
                    expiryTime.setMinutes(expiryTime.getMinutes() + 20)

                    localStorage.setItem('token', json.token);
                    localStorage.setItem('token-expiry', expiryTime);
                    localStorage.setItem('role', json.role);
                    setAuthenticated(true);
                })
            } else {
                response.json().then(json => {
                    setResponseMsg(`Invalid Username/Password Supplied.`)
                })
            }
        });
    }

    return (
        <div id="loginContainer">
            { authenticated ? history.push("/home") : null}

            <h1 id="header">Login</h1>
            <div id="formArea">
                <form id="loginForm">
                    <input className="loginInputField" name="username" type="text" placeholder=" Username" onChange={setUsernameState}/>
                    <input className="loginInputField" name="password" type="password" placeholder=" Password" onChange={setPasswordState}/>
                    <input className="submitBtn" type="button" value="Login" onClick={handleSubmit}/>
                    <p id="loginResponseMsg">{responseMsg}</p>
                    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;