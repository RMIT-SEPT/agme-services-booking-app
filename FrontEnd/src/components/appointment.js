import React from 'react';
import moment from 'moment';

const Appointment = ({details, userType}) => {
    const user = userType;
    const bookingId = details.bookingId;
    const startTime = details.startTime;
    const endTime = details.endTime;
    const customer = details.customerEntity;
    const worker = details.workerEntity;

    const renderAppointmentDetails = () => {
        const custName = customer ? `${customer.firstName} ${customer.lastName}` : "null";
        switch (user) {
            case ('customer'):
                return <p>Worker Assigned: {worker.firstName} {worker.lastName} </p>

            case ('worker'):
                return <p>Customer: {custName}</p>

            case ('admin'):
                return <p>Customer: {custName}<br/> Worker Assigned: {worker.firstName} {worker.lastName}</p>
        }
    }

    // The bottom of the appointment will say 'worker assigned' if the user variable is a customer. Vice versa as well.
    return(
        <div id="appointmentContainer">
            <div className="timeDiv">
                <p>{moment(startTime).format("dddd, MMMM Do")}</p>
                <p>{moment(startTime).format("LT")} - {moment(endTime).format("LT")}</p>
            </div>
            <div className="infoDiv">
                <p>ID: {bookingId}</p>
                {renderAppointmentDetails()}
            </div>
        </div>
    )
}

export default Appointment;