import React from 'react';

const Appointment = ({details}) => {
    const bookingId = details.bookingId;
    const startTime = details.startTime;
    const endTime = details.endTime;
    const worker = details.workerEntity;

    return(
        <div id="appointmentContainer">
            <div className="timeDiv">
                <p>{startTime}</p>
                <p>{endTime}</p>
            </div>
            <div className="infoDiv">
                <p>ID: {bookingId}</p>
                <p>Worker Assigned: {worker.firstName} {worker.lastName} </p>
            </div>
        </div>
    )
}

export default Appointment;