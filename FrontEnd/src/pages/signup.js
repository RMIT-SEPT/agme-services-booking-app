import React, {useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../css/signup.css';

const Signup = () => {

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();

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
        //alert(`Submitted: ${JSON.stringify(signupInfo)}`)
        
        const data = {
            firstName: firstName,
            lastName: lastName,
            address: address,
            phone: phone,
            username: username,
            password: password
        };

        // use whatever the springboot url is
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                window.alert(`Successfully created user '${username}'`);
                history.push("/");
            } else {
                response.json().then(json => {
                    alert(`Failed to create user: ${json.message}`);
                })
            }
        });
    }

    return(
        <div id="signupContainer">
            <div id="signupFormArea">
                <h1 id="header">Register for AGME</h1>
                <form id="signupForm">
                    <input name="firstName" type="text" placeholder=" First Name" onChange={setFirstNameState}/>
                    <input name="lastName" type="text" placeholder=" Last Name" onChange={setLastNameState}/>
                    <input name="address" type="text" placeholder=" Address" onChange={setAddressState}/>
                    <input name="phone" type="tel" placeholder=" Phone" pattern="[0-9]{4}-[0-9]{3}-[0-9]{3}" onChange={setPhoneState}/>
                    <input name="username" type="text" placeholder=" Username" onChange={setUsernameState}/>
                    <input name="password" type="password" placeholder=" Password" onChange={setPasswordState}/>
                    <input className="submitBtn" type="button" value="Signup" onClick={handleSubmit}/>
                </form>
                <div id="footer">
                    <p>Already have an account? <Link to="/">Login here</Link></p>
                </div>
            </div>
        </div>
    )
}

export default Signup;