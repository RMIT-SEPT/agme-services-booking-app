import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const HomeAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async() => {

            if (userType === 'customer') {
                await fetch('http://localhost:8080/api/v1/customer/view', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                    })
                });
            } else if (userType === 'worker') {
                await fetch('http://localhost:8080/api/v1/worker/bookings', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                    })
                });
            }
        }
        // Have to make the async function then call it for some reason.
        fetchData();
    }, []);

    return(
        <div id="appointmentsContainer">
            <h1> Your Appointments </h1>
            {Object.entries(appointments).map(([key, value]) => {
                return <Appointment key={key} details={value} userType={userType}/>
            })}
        </div>
    )
}

export default HomeAppointments;