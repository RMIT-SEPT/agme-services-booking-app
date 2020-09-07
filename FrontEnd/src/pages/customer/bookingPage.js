import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';

const BookingPage = (userDetails) => {
    const userName = userDetails.userName;
    const localizer = momentLocalizer(moment)

    const date = new Date();

    const [myEventsList, setEvents] = useState([{
        title: "hello",
        start: new Date(),
        end: new Date(),
        allDay: false,
        resource: null
    }, 
    {
        title: "Fridge",
        start: new Date('September 2, 2020 03:00:00'),
        end: new Date('September 2, 2020 04:00:00'),
        allDay: false,
        resource: {
            worker: "Dane Swan",
            description: "AAAAAAAAAAAA"
        }
    },
    {
        title: "Lemon",
        start: new Date('September 1, 2020 01:00:00'),
        end: new Date('September 1, 2020 01:30:00'),
        allDay: false,
        resource: {
            worker: "Mylie Cyrus",
            description: "b"
        }
    }]);

    const handleSelect = ({start, end}) => {
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

    return(
        <div id="bookings">
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 400, width: 750}}
                defaultView={'work_week'}
                views={['work_week', 'day', 'agenda']}
                date={date}
                selectable
                onSelectEvent={event => alert(event.title)}
                onSelectSlot={handleSelect}
            />
        </div>
    )
}

export default BookingPage;