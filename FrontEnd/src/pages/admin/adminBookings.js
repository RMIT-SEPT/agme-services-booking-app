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
                    
                    //console.log(workers)
                    Object.entries(json).map(([key, value]) => {
                        allWorkers.push(value);
                        setWorkers([...allWorkers])
                    })

                    if (allWorkers.length > 0) {
                        handleBookingsChange(allWorkers[0].id);
                    }
                    
                })
            })
        }
        
        fetchData();
    }, [])

    const handleBookingsChange = async(e) => {
        
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
                        setBookings([...bookings, event])
                    })
                }
                else {
                    setBookings([])
                }
            })
        })
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
                
                
            />
            <select onChange={(e) => handleBookingsChange(e.target.value)}>
                {Object.entries(workers).map(([key, value]) => {
                    //console.log(value)
                    return <option value={value.id} label={value.username}/>
                })}
            </select>
        </div>
    )
}

export default AdminBookings;