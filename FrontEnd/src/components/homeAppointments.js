import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const HomeAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);
    const [showAmount, setShowAmount] = useState(appointments.length);

    useEffect(() => {
        const fetchData = async() => {

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
                        setShowAmount(array.length);
                    })
                });
            }
        }
        // Have to make the async function then call it for some reason.
        fetchData();
    }, []);

    return(
        <div id="appointmentsContainer">
            <h1> Your Appointments 
                <span className="showXAmount" onClick={() => setShowAmount(appointments.length)}>
                    Show All
                </span>
                <span className="showXAmount" onClick={() => setShowAmount(10)}>
                    Show 10
                </span>
                <span className="showXAmount" onClick={() => setShowAmount(5)}>
                    Show 5
                </span>
            </h1>
            {Object.entries(appointments.slice(0, showAmount)).map(([key, value]) => {
                return <Appointment key={key} details={value} userType={userType}/>
            })}
        </div>
    )
}

export default HomeAppointments;