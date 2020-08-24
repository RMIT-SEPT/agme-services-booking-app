import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../css/login.css';

const Login = () => {

    const history = useHistory();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [authenticated, setAuthenticated] = useState(false);
    // Should be the JSON object that backend returns to us.
    const [userDetails, setUserDetails] = useState(null);

    const setUsernameState = (newValue) => {
        setUsername(newValue.target.value);
    }

    const setPasswordState = (newValue) => {
        setPassword(newValue.target.value);
    }

    const handleSubmit = async (loginInfo) => {

        // JSON to send to backend API
        const data = {
            username: username,
            password: password
        };

        // POST request to backend with the data JSON
        // const response = await fetch('http://localhost:8080/api/v1/user/login', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // });

        const response = {
            userDetails: {
                userName: "Mike",
                address: "2 Ox St, Edgey NSW 3011",
                userType: "customer",
                token: "ABC123"
            }
        };
        
        // If response is correct (OK?), then set authenticated to true and redirect.
        if (username === "123" && password === "123") {
            localStorage.setItem("token", response.userDetails.token);
            setAuthenticated(true);
            setUserDetails(response.userDetails);
        }
    }

    return (
        <div id="loginContainer">
            { authenticated ? history.push("/home", userDetails) : null}

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