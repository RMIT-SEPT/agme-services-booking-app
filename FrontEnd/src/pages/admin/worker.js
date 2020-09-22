import React, { useEffect } from 'react';
import { Calendar } from 'react-big-calendar';
import moment from 'moment';
import '../../css/pages/workerList.css';

const Worker = ({worker, localizer}) => {
    const id = worker.details.id;
    const username = worker.details.username;
    const firstName = worker.details.firstName;
    const lastName = worker.details.lastName;
    const role = worker.details.role;

    const availability = worker.availability;

    const allEvents = [];

    // Calendar attributes
    const calendarStyle = {
        height: 300,
        margin: '20px 10px'
    }

    useEffect(() => {
        // Availability is almost correct so modify it and change events to be new values.
        Object.entries(availability).map(([key, value]) => {
            let newEvent = {
                title: `ID: ${value.entryId}`,
                start: new Date(moment(value.startTime).utc().format()),
                end: new Date(moment(value.endTime).utc().format())
            }
            allEvents.push(newEvent)
        })
    })

    const handleRemove = async() => {
        const fullName = `${firstName} ${lastName}`;
        if (window.confirm(`Are you sure you want to remove worker ${fullName}?`)) {
            await fetch(process.env.REACT_APP_API_URL + '/api/v1/admin/workers/${id}', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                if (response.ok) {
                    window.alert(`Successfully removed worker ${fullName}.`);
                } else {
                    window.alert(`Failed to remove worker ${fullName}. Please try again.`);
                }
            })
        }
    }

    return(
        <div id="workerContainer">
            <p className="workerDetails">
                {firstName} {lastName} 
                <input className="removeBtn" type="button" value="Remove" onClick={handleRemove}/>
                <span className="idAndRole">ID: {id}</span>
            </p>
            <p className="workerDetails">{username} <span className="idAndRole">{role}</span></p>
            <Calendar 
                localizer={localizer}
                events={allEvents}
                defaultView={'week'}
                views={['week']}
                style={calendarStyle}
                toolbar={false}
            />
        </div>
    )
}

export default Worker;