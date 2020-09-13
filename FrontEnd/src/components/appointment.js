import React from 'react';

const Appointment = ({details, userType}) => {
    const user = userType;
    const bookingId = details.bookingId;
    const startTime = details.startTime;
    const endTime = details.endTime;
    const customer = details.customerEntity;
    const worker = details.workerEntity;

    const getCustomerName = () => {
        return <p>Customer Assigned: {customer.firstName} {customer.lastName}</p>
    }

    const getWorkerName = () => {
        return <p>Worker Assigned: {worker.firstName} {worker.lastName} </p>
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
                {user === 'customer' ? getWorkerName() : getCustomerName()}
            </div>
        </div>
    )
}

export default Appointment;