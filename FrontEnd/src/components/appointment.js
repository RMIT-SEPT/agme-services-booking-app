import React from 'react';
import moment from 'moment';
import FadeIn from 'react-fade-in';
import Paper from '@material-ui/core/Paper';

const Appointment = ({details, userType, futureApp, displayBookings}) => {
    const user = userType;
    const bookingId = details.bookingId;
    const startTime = details.startTime;
    const endTime = details.endTime;
    const customer = details.customerEntity;
    const worker = details.workerEntity;

    const handleCancel = async() => {
        if (window.confirm("Are you sure you want to cancel the booking?")) {
            // remove customer entity from this booking
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/booking/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                if (response.ok) {
                    // refresh page
                    displayBookings();
                }
                else {
                    window.alert("Can't cancel booking 48 hours from start time");
                }
            })
        }
    }

    const renderAppointmentDetails = () => {
        switch (user) {
            case ('customer'):
                let removeBookingBtn;
                if (futureApp) {
                    removeBookingBtn = <p><input className="removeBooking" type="button" value="Cancel Booking" onClick={handleCancel}/></p>
                }

                return (
                    <React.Fragment>
                        <p>Worker Assigned: {worker.firstName} {worker.lastName} </p>
                        {removeBookingBtn}
                    </React.Fragment>
                )
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
                <p id="date">{moment(startTime).format("dddd, MMMM Do")}</p>
                <div id="app-left">
                    <p>{moment(startTime).format("LT")} - {moment(endTime).format("LT")}</p>
                    <p>ID: {bookingId}</p>
                </div>
                <div id="app-right">
                    {renderAppointmentDetails()}
                </div>
            </Paper>
        </FadeIn>
    )
}

export default Appointment;