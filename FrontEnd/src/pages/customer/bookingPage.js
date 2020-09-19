import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';

const BookingPage = () => {
    const localizer = momentLocalizer(moment)

    // Get start and end times
    //const startTimeFrame
    //const endTimeFrame

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            await fetch(`http://localhost:8080/api/v1/customer/availabilities`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(json => {
                    json.map((value) => {
                        const event = {
                            title: `${value.workerEntity.role}: ${value.workerEntity.firstName}`,
                            start: moment(value.startTime).toDate(),
                            end: moment(value.endTime).toDate(),
                            resource: {
                                bookingId: value.bookingId
                            }
                        }
                        setBookings([...bookings, event])
                    });
                })
            })
        }
        fetchData();
    }, [])
    
    const handleAdd = (event) => {
        if (window.confirm("Would you like to add this booking?")) {
            // add customer entity to booking in database
            makeBooking(event.resource)
        }
    }

    const makeBooking = async(resource) => {
        await fetch(`http://localhost:8080/api/v1/customer/booking/${resource.bookingId}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((response) => {
            if (response.ok) {
                // remove from calendar availabilities
                setBookings(bookings.filter((booking) => (booking.resource.bookingId != resource.bookingId)));
            }
        })
    }
    
    return(
        <div id="bookings">
            <Calendar
                id="customer-calendar"
                localizer={localizer}
                events={bookings}
                style={{ height: 400, width: 750}}
                defaultView={'work_week'}
                views={['work_week', 'day', 'agenda']}
                onSelectEvent={handleAdd}
            />
        </div>
    )
}

export default BookingPage;