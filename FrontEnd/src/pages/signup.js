import React from 'react';
import { Link } from 'react-router-dom';
import '../css/signup.css';

const Signup = () => {
    const handleSubmit = (signupInfo) => {
        alert(`Submitted: ${JSON.stringify(signupInfo)}`)
    }

    return(
        <div id="signupContainer">
            <h1 id="header">Sign Up</h1>
            <div id="formArea">
                <form id="loginForm" onSubmit={handleSubmit} method="POST">
                    <input name="fullName" type="text" placeholder=" Full Name"/>
                    <input name="address" type="text" placeholder=" Address"/>
                    <input name="phone" type="tel" placeholder=" Phone" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}"/>
                    <input name="email" type="email" placeholder=" Email"/>
                    <input name="password" type="password" placeholder=" Password"/>
                    <button id="submitBtn" type="submit">Register</button>
                    <p>Already have an account? <Link to="/">login here</Link></p>
                </form>
            </div>
        </div>
    )
}

export default Signup;