import React from 'react';
import '../css/login.css';

const Login = () => {
    const handleSubmit = (loginInfo) => {
        alert(`Submitted: ${JSON.stringify(loginInfo)}`)
    }

    return(
        <div id="loginContainer">
            <h1 id="header">LOGIN</h1>
            <div id="formArea">
                <form id="loginForm" onSubmit={handleSubmit} method="POST">
                    <input name="email" type="email" placeholder=" Email"/>
                    <input name="password" type="password" placeholder=" Password"/>
                    <button id="submitBtn" type="submit">Login</button>
                </form>
            </div>
        </div>
    )
}

export default Login;