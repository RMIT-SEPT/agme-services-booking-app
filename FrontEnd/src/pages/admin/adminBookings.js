import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';

const AdminBookings = (userDetails) => {
    const userName = userDetails.userName;
    const localizer = momentLocalizer(moment);

    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [currentWorker, setCurrentWorker] = useState(null);

    useEffect(() => {
        var allWorkers = []
        const fetchData = async() => {
            await fetch(`http://localhost:8080/api/v1/admin/workers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(async(json) => {
                    Object.entries(json).map(([key, value]) => {
                        allWorkers.push(value);
                        setWorkers([...allWorkers])
                    })

                    if (allWorkers.length > 0) {
                        handleBookingsChange(allWorkers[0].id);
                        setCurrentWorker(allWorkers[0])
                    }
                })
            })
        }
        
        fetchData();
    }, [])

    const handleBookingsChange = async(e) => {
        var allBookings = [];
        setCurrentWorker(workers.find((worker) => worker.id == e));
        await fetch(`http://localhost:8080/api/v1/admin/bookings`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => { 
            response.json().then(json => {
                var filteredBookings = json.filter((booking) => booking.workerEntity.id == e);
                
                if (filteredBookings.length > 0) {
                    filteredBookings.map((value) => {
                        const customerName = value.customerEntity ? value.customerEntity.username : "null";
                        const event = {
                            title: `customer: ${customerName}`,
                            start: moment(value.startTime).toDate(),
                            end: moment(value.endTime).toDate(),
                            resource: {
                                bookingId: value.bookingId
                            }
                        }
                        allBookings.push(event);
                        
                        setBookings([...allBookings])
                    })
                }
                else {
                    setBookings([])
                }
                
            })
        })
    }

    const handleSelectSlot = async({start, end}) => {
        if (window.confirm(`Add booking for ${currentWorker.firstName} on ${start.toString().substring(0,15)}`)) {
            
            const data = {
                startTime: moment(start).format().substring(0,19),
                endTime: moment(end).format().substring(0,19),
                workerId: currentWorker.id
            }

            await fetch(`http://localhost:8080/api/v1/admin/booking`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    handleBookingsChange(currentWorker.id);
                }
            })
        }
    }

    const handleDelete = async(event) => {
        if (window.confirm("Would you like to remove this booking?")) {
            // remove this booking entity from the database
            await fetch(`http://localhost:8080/api/v1/admin/booking/${event.resource.bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                if (response.ok) {
                    // remove from calendar
                    setBookings(bookings.filter((booking) => (booking.resource.bookingId != event.resource.bookingId)));
                }
            })
        }
    }

    return (
        <div id="admin-bookings">
            <Calendar
                id="admin-calendar"
                localizer={localizer}
                events={bookings}
                style={{ height: 400, width: 750}}
                defaultView={'work_week'}
                views={['work_week', 'day', 'agenda']}
                selectable={'ignoreEvents'}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleDelete}
            />
            <select onChange={(e) => handleBookingsChange(e.target.value)}>
                {Object.entries(workers).map(([key, value]) => {
                    return <option value={value.id} label={value.username}/>
                })}
            </select>
        </div>
    )
}

export default AdminBookings;