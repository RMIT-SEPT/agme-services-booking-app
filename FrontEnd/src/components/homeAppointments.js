import React from 'react';
import '../css/homeAppointments.css';

import Appointment from './appointment.js';

const HomeAppointments = (userJSON) => {
    const userType = userJSON.userDetails.userType;
    const userName = userJSON.userDetails.userName;
    const sampleAppointments = {
        appointment1: {
            time: "9AM - 10AM",
            service: "Dentist",
            worker: "John Smith",
            description: "AAAAAAAAAAAA"
        },
        appointment2: {
            time: "11AM - 1PM",
            service: "Nails",
            worker: "Serena Gomez",
            description: "b"
        }
    }

    return(
        <div id="homeAppointmentsContainer">
            <h1> Your Appointments </h1>
            {Object.entries(sampleAppointments).map(([key, value]) => {
                return <Appointment details={sampleAppointments[key]}/>
            })}
        </div>
    )
}

export default HomeAppointments;