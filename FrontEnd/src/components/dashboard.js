import React from 'react';

import '../css/dashboard.css';
import { useHistory } from 'react-router-dom';

const Dashboard = ({userDetails}) => {
    const userType = userDetails.userType;
    let history = useHistory();

    const handleTabClick = (e => {
        if (window.location.pathname !== "/" + e.target.id) {
            history.push("/" + e.target.id, userDetails);
        }
    })

    // Tried to break the returns into separate methods like customerButtons, workerButtons, but didn't work
    const renderButtons = () => {
        switch(userType) {
            case 'customer':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" id="home" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="profile" value="Profile" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="booking" value="Book Appointment" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="history" value="Booking History" onClick={handleTabClick}/>
                    </React.Fragment>
                );
            
            case 'worker':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" id="home" value="Home" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="profile" value="Profile" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="availability" value="Weekly Availability" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="history" value="Booking History" onClick={handleTabClick}/>
                    </React.Fragment>
                );

            case 'admin':
                return (
                    <React.Fragment>
                        <input className="dashboardButton" type="button" id="home" value="Workers" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="businesshours" value="Business Hours" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="history" value="Booking History" onClick={handleTabClick}/>
                        <input className="dashboardButton" type="button" id="createbookings" value="Create Bookings" onClick={handleTabClick}/>
                    </React.Fragment>
                );

            default:
                return;
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