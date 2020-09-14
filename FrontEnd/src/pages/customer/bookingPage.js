import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';

const BookingPage = (userDetails) => {
    const userName = userDetails.userName;
    const localizer = momentLocalizer(moment)

    // Get start and end times
    //const startTime = new Date();

    const [availability, setAvailability] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            const response = await fetch(`http://localhost:8080/api/v1/customer/availabilities`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                
                response.json().then(json => {
                    json.map((availableBooking) => {
                        
                        const event = {
                            title: `${availableBooking.workerEntity.role}: ${availableBooking.workerEntity.firstName}`,
                            start: moment(availableBooking.startTime).toDate(),
                            end: moment(availableBooking.endTime).toDate(),
                            resource: {
                                bookingId: availableBooking.bookingId,
                                worker: availableBooking.workerEntity
                            }
                        }
                        console.log(event)
                        setAvailability([...availability, event])
                    });
                    
                })
            })
        }
        fetchData();
    }, [])
    /*
    const handleAdd = ({start, end}) => {
        const title = window.prompt('New Event name')
        
        if (title) {
            setEvents([...myEventsList, {
                title: title,
                start: start,
                end: end,
                allDay: false,
                resource: null
            }]);
        }
        
    }
    */
    return(
        <div id="bookings">
            <Calendar
                id="customer-calendar"
                localizer={localizer}
                events={availability}
                style={{ height: 400, width: 750}}
                defaultView={'work_week'}
                views={['work_week', 'day', 'agenda']}
                //onSelectEvent={handleAdd}
            />
        </div>
    )
}

export default BookingPage;