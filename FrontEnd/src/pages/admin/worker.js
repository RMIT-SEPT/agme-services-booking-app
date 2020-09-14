import React from 'react';
import {Calendar} from 'react-big-calendar';
import '../../css/pages/workerList.css';

const Worker = ({details, localizer}) => {
    const id = details.id;
    const username = details.username;
    const firstName = details.firstName;
    const lastName = details.lastName;
    const role = details.role;

    const availability = details.availability;

    // Calendar attributes
    const calendarStyle = {
        height: 300,
        margin: '20px 10px'
    }

    return(
        <div id="workerContainer">
            <p>{firstName} {lastName} <span>ID: {id}</span></p>
            <p>{username} <span>{role}</span></p>
            <Calendar 
                localizer={localizer}
                events={[]}
                defaultView={'week'}
                views={['week']}
                style={calendarStyle}
                toolbar={false}
            />
        </div>
    )
}

export default Worker;