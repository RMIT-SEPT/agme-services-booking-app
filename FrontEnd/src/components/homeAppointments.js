import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const HomeAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        displayBookings();
    }, []);

    const displayBookings = async() => {
        if (userType === 'customer') {
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/view`, {
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
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/bookings`, {
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

    return(
        <div id="appointmentsContainer">
            <h1> Your Appointments </h1>
            {Object.entries(appointments).map(([key, value]) => {
                return <Appointment details={value} userType={userType} futureApp={true} displayBookings={displayBookings}/>
            })}
        </div>
    )
}

export default HomeAppointments;