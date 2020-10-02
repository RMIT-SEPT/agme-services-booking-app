import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../../css/pages/availabilityPage.css'

const AvailabilityPage = () => {
    const [availability, setAvailability] = useState([]);

    const localizer = momentLocalizer(moment);
    const calendarStyle = {
        height: 552,
        margin: '20px 10px'
    }

    const fetchAvailabilities = async() => {
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/availability`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(response => {
            response.json().then(array => {
                let availabilityEvents = [];
                // Loop through array, where each element is a day of availability for the week.
                // Key is the index, value is the object itself (contains detail for the day).
                Object.entries(array).map(([key, value]) => {
                    const dayAvailable = {
                        title: `ID: ${value.entryId}`,
                        start: new Date(value.startTime),
                        end: new Date(value.endTime)
                    }
                    availabilityEvents.push(dayAvailable);
                });

                setAvailability(availabilityEvents);
            })
        });
    }

    useEffect(() => {
        fetchAvailabilities();
    }, [])

    // Returns a boolean, true if successful, false if failed.
    const addAvailabilityRequest = async(data, startTime, endTime) => {
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        }).then(response => {
            if (response.ok) {
                setAvailability([...availability, {start: startTime, end: endTime}]);
                fetchAvailabilities();
            } else {
                response.json().then(json => {
                    window.alert(`Failed to set availability: ${json.message}`);
                    return false;
                })
            }
        })
    }

    const removeAvailabilityRequest = async(data) => {
        const entryId = data.title.substr(data.title.indexOf(' ') + 1);
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/availability/${entryId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        }).then(() => {
            return;
        })
    }

    const handleSelection = (event) => {
        const newEvent = {
            startTime: moment(event.start).format('YYYY-MM-DD[T]HH:mm:ss[.000Z]'),
            endTime: moment(event.end).format('YYYY-MM-DD[T]HH:mm:ss[.000Z]')
        }
        const dateReadable = moment(event.start).format('MMMM Do');
        const startTimeReadable = moment(event.start).format('LT');
        const endTimeReadable = moment(event.end).format('LT');
        if (window.confirm(`Set as AVAILABLE on ${dateReadable} between ${startTimeReadable} and ${endTimeReadable}?`)) {
            // Make a post request, and if request is OK, set the availabilities (the events on the calendar).
            addAvailabilityRequest(newEvent, event.start, event.end)
        }
    }

    const handleDelete = (event) => {
        if (window.confirm("Would you like to remove this availability?")) {
            // Make a temp array and iterate over it. When you find the event to delete, save that index and splice after.
            let newAvailabilities = [...availability];
            let indexToDelete;
            for (let i = 0; i < newAvailabilities.length; i++) {
                if (newAvailabilities[i].title === event.title) {
                    indexToDelete = i;
                }
            }
            newAvailabilities.splice(indexToDelete, 1);
            removeAvailabilityRequest(event);
            setAvailability(newAvailabilities);
        }
    }

    return(
        <div id="availabilityContainer">
            <Calendar 
                localizer={localizer}
                events={availability}
                style={calendarStyle}
                defaultView={'week'}
                views={['week', 'day', 'agenda']}
                selectable={true}
                onSelectSlot={handleSelection}
                onSelectEvent={handleDelete}
            />
        </div>
    )
}

export default AvailabilityPage;