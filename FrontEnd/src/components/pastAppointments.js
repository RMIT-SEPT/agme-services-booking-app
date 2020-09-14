import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const PastAppointments = ({userDetails}) => {
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            // Request for customer's past bookings.
            if (userType === 'customer') {
                await fetch('http://localhost:8080/api/v1/customer/view/past', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                    })
                })
            } else if (userType === 'worker') {
                //Do a request for worker's past appointments.
                setAppointments(null);
            }
        }
        // Have to make the async function then call it for some reason.
        fetchData();
    }, []);

    return(
        <div id="appointmentsContainer">
            <h1> Past Appointments </h1>
            {Object.entries(appointments).map(([key, value]) => {
                return <Appointment details={value} userType={userType}/>
            })}
        </div>
    )
}

export default PastAppointments;