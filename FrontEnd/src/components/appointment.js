import React from 'react';

const Appointment = ({details, userType}) => {
    const user = userType;
    const bookingId = details.bookingId;
    const startTime = details.startTime;
    const endTime = details.endTime;
    const customer = details.customerEntity;
    const worker = details.workerEntity;

    const renderAppointmentDetails = () => {
        switch (user) {
            case ('customer'):
                return <p>Worker Assigned: {worker.firstName} {worker.lastName} </p>

            case ('worker'):
                return <p>Customer: {customer.firstName} {customer.lastName}</p>

            case ('admin'):
                return <p>Customer: {customer.firstName} {customer.lastName}<br/> Worker Assigned: {worker.firstName} {worker.lastName}</p>
        }
    }

    // The bottom of the appointment will say 'worker assigned' if the user variable is a customer. Vice versa as well.
    return(
        <div id="appointmentContainer">
            <div className="timeDiv">
                <p>{startTime}</p>
                <p>{endTime}</p>
            </div>
            <div className="infoDiv">
                <p>ID: {bookingId}</p>
                {renderAppointmentDetails()}
            </div>
        </div>
    )
}

export default Appointment;