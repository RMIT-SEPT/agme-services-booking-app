import React, { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import moment from 'moment';
import Paper from '@material-ui/core/Paper'
import '../../css/pages/workerList.css';
import PersonIcon from '@material-ui/icons/Person';

const Worker = ({worker, localizer}) => {
    const id = worker.details.id;
    const username = worker.details.username;
    const firstName = worker.details.firstName;
    const lastName = worker.details.lastName;
    const role = worker.details.role;

    const availability = worker.availability;

    const [allEvents, setAllEvents] = useState([]);

    // Calendar attributes
    const calendarStyle = {
        backgroundColor: "white",
        height: 300,
        margin: '10px 0px'
    }

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
        var events = [];
        Object.entries(availability).map(([key, value]) => {
            let newEvent = {
                title: `ID: ${value.entryId}`,
                start: new Date(moment(value.startTime).utc().format()),
                end: new Date(moment(value.endTime).utc().format())
            }
            events.push(newEvent);
        })
        setAllEvents(events);
    }, [availability])

    const handleRemove = async() => {
        const fullName = `${firstName} ${lastName}`;
        if (window.confirm(`Are you sure you want to remove worker ${fullName}?`)) {
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                if (response.ok) {
                    window.alert(`Successfully removed worker ${fullName}. Please refresh to see changes.`);
                } else {
                    window.alert(`Failed to remove worker ${fullName}. Please try again.`);
                }
            })
        }
    }

    return(
        <Paper id="workerContainer">
            <p className="workerDetails">
            <PersonIcon style={{fontSize:"40px"}} className="personIcon"/>
                {firstName} {lastName} (ID: {id}, {username}, {role})
                <input className="removeBtn" type="button" value="Remove" onClick={handleRemove}/>
            </p>
            <Calendar 
                localizer={localizer}
                events={allEvents}
                defaultView={'week'}
                views={['week']}
                style={calendarStyle}
                toolbar={false}
                eventPropGetter={customEventProp}
            />
        </Paper>
    )
}

export default Worker;