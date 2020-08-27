import React, { useState, useCallback } from 'react';

import '../css/dashboard.css';

const Dashboard = ({userDetails, onTabClick}) => {
    const userType = userDetails.userType

    const handleTabClick = useCallback(e => {
        onTabClick(e.target.value)
    }, [onTabClick])

    // Tried to break the returns into separate methods like customerButtons, workerButtons, but didn't work
    const renderButtons = () => {
        switch(userType) {
            case 'customer':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Personal Details" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Book Appointment" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" value="Booking History" onClick={handleTabClick}/>
                    </React.Fragment>
                );
            
            case 'worker':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home"/>
                        <input className="dashboardButton" type="button" value="Personal Details"/>
                        <input className="dashboardButton" type="button" value="Weekly Availability"/>
                    </React.Fragment>
                );

            case 'admin':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home"/>
                        <input className="dashboardButton" type="button" value="Worker List"/>
                        <input className="dashboardButton" type="button" value="Past Bookings"/>
                        <input className="dashboardButton" type="button" value="New Bookings"/>
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