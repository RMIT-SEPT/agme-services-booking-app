import React from 'react';
import { Link } from 'react-router-dom';
import '../css/login.css';

const Login = () => {
    const handleSubmit = (loginInfo) => {
        alert(`Submitted: ${JSON.stringify(loginInfo)}`)
    }

    return(
        <div id="loginContainer">
            <h1 id="header">Login</h1>
            <div id="formArea">
                <form id="loginForm" onSubmit={handleSubmit} method="POST">
                    <input name="email" type="email" placeholder=" Email"/>
                    <input name="password" type="password" placeholder=" Password"/>
                    <button id="submitBtn" type="submit">Login</button>
                    <p>Don't have an account? <Link to="/signup">Register here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Login;