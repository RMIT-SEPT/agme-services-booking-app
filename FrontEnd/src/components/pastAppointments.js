import React from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';

const PastAppointments = (userJSON) => {
    const userType = userJSON.userDetails.userType;
    const userName = userJSON.userDetails.userName;
    const sampleAppointments = {
        appointment1: {
            time: "9AM - 10AM",
            service: "Fridge",
            worker: "Dane Swan",
            description: "AAAAAAAAAAAA"
        },
        appointment2: {
            time: "11AM - 1PM",
            service: "Lemon",
            worker: "Mylie Cyrus",
            description: "b"
        }
    }

    return(
        <div id="appointmentsContainer">
            <h1> Past Appointments </h1>
            {Object.entries(sampleAppointments).map(([key, value]) => {
                return <Appointment details={sampleAppointments[key]}/>
            })}
        </div>
    )
}

export default PastAppointments;