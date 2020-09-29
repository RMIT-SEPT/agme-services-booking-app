import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';
import FilterAmount from '../components/filterAmount.js';
import SearchBox from '../components/searchBox.js';
import moment from 'moment';

const HomeAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);
    const [showAmount, setShowAmount] = useState(appointments.length);
    const [searchFilter, setSearchFilter] = useState(null);
    const [filteredAppointments, setFilteredAppointments] = useState([]);

    const debug = () => {
        let tempAppointments = [];
        // Outer loop (i.e. all appointments, which is an array)
        Object.entries(appointments).map(([outerKey, outerValue]) => {

            // Inner loop (i.e. per appointment, which is a JSON)
            // Each 'innerKey' will be the keys for the JSON, e.g. bookingId, startTime, endTime, etc.
            // InnerValue is not working for some reason, so using longhand appointments[outerKey][innerKey] to get the value instead.
            Object.keys(appointments[outerKey]).forEach((innerKey, innerValue) => {
                // console.log(`key: ${innerKey}, value: ${appointments[outerKey][innerKey]}`);

                // If it's a time, convert it to human readable (e.g. Wednesday, September 30th) and see if searchFilter matches.
                // If I include an OR here with endTime, then this if statement triggers twice on the same appointment, which should not be the case.
                if (innerKey === 'startTime') {
                    console.log(`moment: ${moment(appointments[outerKey][innerKey]).format("dddd, MMMM Do")}`);
                    if (moment(appointments[outerKey][innerKey]).format("dddd, MMMM Do").includes(searchFilter)) {
                        tempAppointments.push(appointments[outerKey]);
                    }
                }
            })
        })

        console.log(JSON.stringify(tempAppointments, null, 2));
    }

    const handleNewFilter = (newFilter) => {
        let tempAppointments = [];

        // Outer loop (i.e. all appointments, which is an array)
        Object.entries(appointments).map(([outerKey, outerValue]) => {

            // Inner loop (i.e. per appointment, which is a JSON)
            // Each 'innerKey' will be the keys for the JSON, e.g. bookingId, startTime, endTime, etc.
            // InnerValue is not working for some reason, so using longhand appointments[outerKey][innerKey] to get the value instead.
            Object.keys(appointments[outerKey]).forEach((innerKey, innerValue) => {
                // console.log(`key: ${innerKey}, value: ${appointments[outerKey][innerKey]}`);

                // If bookingId, then its just a number, and check if equal.
                if (innerKey === 'bookingId') {
                    console.log(`Apts: ${String(appointments[outerKey][innerKey])} and newFilter: ${String(newFilter)}`)
                    if (String(appointments[outerKey][innerKey]).startsWith(String(newFilter))) {
                        tempAppointments.push(appointments[outerKey]);
                    }
                }
                // If it's a time, convert it to human readable (e.g. Wednesday, September 30th) and see if searchFilter matches.
                // If I include an OR here with endTime, then this if statement triggers twice on the same appointment, which should not be the case.
                else if (innerKey === 'startTime') {
                    if (moment(appointments[outerKey][innerKey]).format("dddd, MMMM Do").includes(newFilter)) {
                        tempAppointments.push(appointments[outerKey]);
                    }
                }
            })
        })

        setSearchFilter(newFilter);
        setFilteredAppointments(tempAppointments);
    }

    useEffect(() => {
        const fetchData = async() => {

            if (userType === 'customer') {
                await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/view`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                        setShowAmount(array.length);
                    })
                });
            } else if (userType === 'worker') {

                await fetch(process.env.REACT_APP_API_URL + `/api/v1/worker/bookings`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        setAppointments(array);
                        setShowAmount(array.length);
                    })
                });
            }
        }
        fetchData();
    }, []);

    return(
        <div id="appointmentsContainer">
            <button onClick={debug}>
                debug
            </button>
            <SearchBox handleNewFilter={handleNewFilter}/>
            <h1> Your Appointments 
                <FilterAmount maxAmount={appointments.length} setShowAmount={setShowAmount}/>
            </h1>
            {searchFilter === null ? 
            Object.entries(appointments.slice(0, showAmount)).map(([key, value]) => {
                return <Appointment key={key} details={value} userType={userType}/>
            }) 
            :
            Object.entries(filteredAppointments.slice(0, showAmount)).map(([key, value]) => {
                return <Appointment key={key} details={value} userType={userType}/>
            })}
        </div>
    )
}

export default HomeAppointments;