import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Card from 'react-bootstrap/Card';

const AdminBusinessHours = () => {
    const localizer = momentLocalizer(moment);
    const calendarStyle = {
        height: 533,
        margin: '20px 10px'
    }

    const [businessHours, setBusinessHours] = useState([]);

    useEffect(() => {
        displayEvents();
    }, []);

    const customEventProp = () => {
        return {
            style: {
                backgroundColor: '#227FE8',
                fontSize: 'small',
                color: 'white'
            }
        }
    }

    const displayEvents = async() => {
        var allEvents = [];
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/businesshours`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            response.json().then((json) => {
                json.map((value) => {
                    const event = {
                        title: "Business Hours",
                        start: moment(value.startTime).toDate(),
                        end: moment(value.endTime).toDate(),
                        resource: {
                            id: value.bhEntryId
                        }
                    }
                    allEvents.push(event)
                    setBusinessHours([...allEvents])
                });
            })
        })
    }

    const handleSelectSlot = async({start, end}) => {
        if (window.confirm(`Add business hours on ${start.toString().substring(0,15)}`)) {
            const data = {
                startTime: moment(start).format().substring(0,19),
                endTime: moment(end).format().substring(0,19)
            }

            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/businesshours`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(data)
            }).then(response => {
                if (response.ok) {
                    displayEvents();
                }
                else response.json().then(json => {
                    alert(`Error: ${json.message}`);
                })
            })
        }
    }

    const handleSelectEvent = async(event) =>{
        if (window.confirm("Are you sure you want to remove these business hours?")) {
            // remove this booking entity from the database
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/businesshours/${event.resource.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then((response) => {
                if (response.ok) {
                    // remove from calendar
                    setBusinessHours(businessHours.filter((item) => (item.resource.id != event.resource.id)));
                }
                else response.json().then(json => {
                    alert(`Error: ${json.message}`);
                })
            })
        }
    }

    return(
        <div>
            <Card.Header>Business Hours</Card.Header>
            <div id="admin-business-hours">
                <Calendar
                    localizer={localizer}
                    events={businessHours}
                    style={calendarStyle}
                    defaultView={'week'}
                    views={['week', 'day', 'agenda']}
                    selectable={'ignoreEvents'}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                />
            </div>
        </div>
    )
}

export default AdminBusinessHours;