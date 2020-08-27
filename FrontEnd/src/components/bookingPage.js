import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const BookingPage = (userJSON) => {
    
    const [date, setDate] = useState(new Date());

    const onChange = date => {
        setDate(date)
    }
    
    return(
        <div id="bookings">
            <Calendar onChange={onChange} value={date}/>
        </div>
    )
}

export default BookingPage;