import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../css/pages/bookingPage.css';
import { Card } from 'react-bootstrap';

const AdminBookings = () => {
    const localizer = momentLocalizer(moment);
    const calendarStyle = {
        height: 515,
        margin: '20px 0px'
    }

    const [bookings, setBookings] = useState([]);
    const [workers, setWorkers] = useState([]);
    const [currentWorker, setCurrentWorker] = useState(null);
    const [hoursFetched, setHoursFetched] = useState(false);
    
    useEffect(() => {
        var allWorkers = []
        const fetchData = async() => {
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(async(json) => {
                    Object.entries(json).map(([key, value]) => {
                        allWorkers.push(value);
                    })
                    
                    fetchWorkerHours();
                })
            })
        }

        const fetchWorkerHours = () => {
            allWorkers.forEach(async(value) => {
                await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers/${value.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(async(json) => {
                        value.workHours = json;
                        setWorkers([...allWorkers]);
                    })
                })
            })
        }
        
        fetchData();
    }, [])
    
    const customEventProp = () => {
        return {
            style: {
                backgroundColor: '#227FE8',
                fontSize: 'x-small',
                color: 'white'
            }
        }
    }

    useEffect(() => {
        if (currentWorker !== undefined && currentWorker !== null) {
            setHoursFetched(true);
        }
    }, [currentWorker])

    useEffect(() => {
        if (workers.length > 0 && workers[0].workHours !== undefined) {
            handleBookingsChange(workers[0].id);
            setCurrentWorker(workers[0]);
        }
    }, [workers])

    const customSlotProp = (date) => {
        var availability = false;
        
        currentWorker.workHours.forEach((value)  => {
            if ((moment(value.startTime).toDate() <= date) && (moment(value.endTime).toDate() >= date)) {
                availability = true;
            }
        })
        
        if (availability) {
            return {
                style: {
                    backgroundColor: '#ECF0F1'
                }
            }
        }
    }

    const handleBookingsChange = async(e) => {
        var allBookings = [];
        setCurrentWorker(workers.find((worker) => worker.id == e));
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/bookings`, {
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

            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/booking`, {
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
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/booking/${event.resource.bookingId}`, {
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
        <div>
            <Card.Header>Create Bookings</Card.Header>
            <div id="admin-bookings">
                <span id="workerTag" >Worker:</span>
                
                <select onChange={(e) => handleBookingsChange(e.target.value)} id="adminWorkerSelection">
                    {Object.entries(workers).map(([key, value]) => {
                        return <option value={value.id} label={value.username}/>
                    })}
                </select>
                {hoursFetched ? <Calendar
                    localizer={localizer}
                    events={bookings}
                    style={calendarStyle}
                    defaultView={'week'}
                    views={['week', 'day', 'agenda']}
                    selectable={'ignoreEvents'}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleDelete}
                    eventPropGetter={customEventProp}
                    slotPropGetter={customSlotProp}
                /> : null}
                
            </div>
        </div>
    )
}

export default AdminBookings;