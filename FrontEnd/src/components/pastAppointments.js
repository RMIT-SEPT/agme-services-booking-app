import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const PastAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            // Request for customer's past bookings.
            if (userType === 'customer') {
                await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/view/past`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                    })
                })
            } else if (userType === 'worker' || userType === 'admin') {
                // Worker and Admin have similar endpoint, only difference is the userType.
                await fetch(process.env.REACT_APP_API_URL + `/api/v1/${userType}/bookings/history`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                    })
                })
            }
        }
        // Have to make the async function then call it for some reason.
        fetchData();
    }, []);

    return(
        <div id="appointmentsContainer">
            <h1> Past Appointments </h1>
            {Object.entries(appointments).map(([key, value]) => {
                return <Appointment key={key} details={value} userType={userType}/>
            })}
        </div>
    )
}

export default PastAppointments;