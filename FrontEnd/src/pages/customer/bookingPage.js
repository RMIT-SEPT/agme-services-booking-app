import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Card from 'react-bootstrap/Card';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';

const BookingPage = () => {
    const localizer = momentLocalizer(moment)
    const calendarStyle = {
        height: 533,
        margin: '20px 10px'
    }

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [workers, setWorkers] = useState([]);

    const customEventProp = () => {
        return {
            style: {
                backgroundColor: '#227FE8',
                fontSize: 'small',
                color: 'white'
            }
        }
    }

    useEffect(() => {
        const fetchData = async() => {
            var allEvents = [];
            var allWorkers = [];
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/availabilities`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(json => {
                    json.map((value) => {
                        const worker = value.workerEntity;
                        const event = {
                            start: moment(value.startTime).toDate(),
                            end: moment(value.endTime).toDate(),
                            resource: {
                                bookingId: value.bookingId,
                                workerId: worker.id
                            }
                        }
                        allEvents.push(event)
                        
                        if (!(allWorkers.find((tempWorker) => tempWorker.id === worker.id))) {
                            allWorkers.push(value.workerEntity)
                        }
                    });
                    setBookings([...allEvents])
                    setWorkers([...allWorkers])
                    console.log(allWorkers)

                    if (allWorkers.length > 0) {
                        // set initial worker and bookings
                        setFilteredBookings(allEvents.filter((event) => event.resource.workerId === allWorkers[0].id))
                    }
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
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/booking/${resource.bookingId}`, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then((response) => {
            if (response.ok) {
                // remove from calendar availabilities
                setBookings(bookings.filter((booking) => (booking.resource.bookingId != resource.bookingId)));
                setFilteredBookings(filteredBookings.filter((booking) => (booking.resource.bookingId != resource.bookingId)))
            }
        })
    }

    const handleBookingsChange = (workerId) => {
        setFilteredBookings(bookings.filter((booking) => booking.resource.workerId == workerId));
    }
    
    return(
        <div>
            <Card.Header>Book Appointment</Card.Header>
            <div id="bookings">
                <span id="workerTag" >Worker</span>

                <select onChange={(e) => handleBookingsChange(e.target.value)} id="custWorkerSelection">
                    {Object.entries(workers).map(([key, value]) => {
                        return <option value={value.id} label={`${value.firstName} ${value.lastName} - ${value.role}`}/>
                    })}
                </select>
                <Calendar
                    id="customer-calendar"
                    localizer={localizer}
                    events={filteredBookings}
                    style={calendarStyle}
                    defaultView={'week'}
                    views={['week', 'day', 'agenda']}
                    onSelectEvent={handleAdd}
                    eventPropGetter={customEventProp}
                />
            </div>
        </div>
    )
}

export default BookingPage;