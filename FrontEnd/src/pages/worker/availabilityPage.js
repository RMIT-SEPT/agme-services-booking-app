import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../../css/pages/availabilityPage.css'

const AvailabilityPage = () => {
    const [availability, setAvailability] = useState([]);

    const localizer = momentLocalizer(moment);
    const calendarStyle = {
        height: 752,
        margin: '20px 10px'
    }

    useEffect(() => {
        const fetchData = async() => {
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
            })
        }
        fetchData();
    }, [])

    const addAvailabilityRequest = async(data) => {
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(data)
        }).then(() => {
            return;
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
            // Make a post request, adding this availability and add this to availability state.
            addAvailabilityRequest(newEvent)
            setAvailability([...availability, {start: event.start, end: event.end}]);
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
                views={['week', 'work_week', 'day']}
                selectable={true}
                onSelectSlot={handleSelection}
                onSelectEvent={handleDelete}
            />
        </div>
    )
}

export default AvailabilityPage;