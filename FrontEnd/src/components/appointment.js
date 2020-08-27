import React from 'react';

const Appointment = (appointmentJSON) => {
    const service = appointmentJSON.details.service;
    const time = appointmentJSON.details.time;
    const worker = appointmentJSON.details.worker;
    const description = appointmentJSON.details.description;

    return(
        <div id="appointmentContainer">
            {/* {service} {time} {worker} {description} */}
            <div className="timeDiv">
                <p>{time}</p>
            </div>
            <div className="infoDiv">
                <p>{service} - {description} </p>
                <p>Worker Assigned: {worker} </p>
            </div>
        </div>
    )
}

export default Appointment;