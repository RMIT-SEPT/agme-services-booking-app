import React from 'react';

import '../css/dashboard.css';

const Dashboard = (userJSON) => {
    const userType = userJSON.userDetails.userType

    // Tried to break the returns into separate methods like customerButtons, workerButtons, but didn't work
    const renderButtons = () => {
        switch(userType) {
            case 'customer':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" value="Home"/>
                        <input className="dashboardButton" type="button" value="Personal Details"/>
                        <input className="dashboardButton" type="button" value="Book Appointment"/>
                        <input className="dashboardButton" type="button" value="Booking History"/>
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