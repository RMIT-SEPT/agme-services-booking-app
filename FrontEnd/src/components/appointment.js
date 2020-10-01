import React from 'react';
import moment from 'moment';

import FadeIn from 'react-fade-in';
import Paper from '@material-ui/core/Paper';

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
                if (customer !== null)
                    return <p>Customer: {customer.firstName} {customer.lastName}</p>
                else
                    return <p>No Customer Assigned</p>

            case ('admin'):
                let customerString;
                let workerString;
                customerString = (customer === null) ? 
                    <p>No Customer Assigned<br/></p> : <p>Customer: {customer.firstName} {customer.lastName}<br/></p>;
                workerString = (worker === null) ?
                    <p>No Worker Assigned</p> : <p>Worker Assigned: {worker.firstName} {worker.lastName}</p>

                return (
                    <React.Fragment>
                        {customerString} {workerString}
                    </React.Fragment>
                )

            default:
                return;
        }
    }

    // The bottom of the appointment will say 'worker assigned' if the user variable is a customer. Vice versa as well.
    return(
        <FadeIn>
            <Paper id="appointmentContainer" >
                <div>
                    <div className="timeDiv">
                        <p>{moment(startTime).format("dddd, MMMM Do")}</p>
                        <p>{moment(startTime).format("LT")} - {moment(endTime).format("LT")}</p>
                    </div>
                    <div className="infoDiv">
                        <p>ID: {bookingId}</p>
                        {renderAppointmentDetails()}
                    </div>
                </div>
            </Paper>
        </FadeIn>
    )
}

export default Appointment;