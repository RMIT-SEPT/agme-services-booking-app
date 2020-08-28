import React, { useState, useCallback } from 'react';

import '../css/dashboard.css';

const Dashboard = ({userDetails, onTabClick}) => {
    const userType = userDetails.userType

    const handleTabClick = useCallback(e => {
        onTabClick(e.target.value)
    }, [onTabClick])

    function redirectBooking()
    {
        history.push('/booking', userDetails);
    }

    // Tried to break the returns into separate methods like customerButtons, workerButtons, but didn't work
    const renderButtons = () => {
        switch(userType) {
            case 'customer':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Profile" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Book Appointment" onClick={handleClick}/>
                        <input className="dashboardButton" type="button" value="Booking History" onClick={redirectBook}/>
                    </React.Fragment>
                );
            
            case 'worker':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Profile" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Weekly Availability" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Booking History" onClick={handleTabClick}/>
                    </React.Fragment>
                );

            case 'admin':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Profile" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Employees" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Booking History" onClick={handleTabClick}/>
                    </React.Fragment>
                );
        }
    }

    return(
        <div id="dashboardContainer">
            <h1> Dashboard </h1>
            {renderButtons()}
        </div>
    )
}

export default Dashboard;