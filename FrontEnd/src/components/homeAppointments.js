import React, { useState, useEffect } from 'react';
import '../css/appointment.css';

import Appointment from './appointment.js';
import FilterAmount from '../components/filterAmount.js';
import SearchBox from '../components/searchBox.js';
import moment from 'moment';
import Card from 'react-bootstrap/Card';

const HomeAppointments = () => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    const userType = userDetails.userType;

    const [appointments, setAppointments] = useState([]);
    const [showAmount, setShowAmount] = useState(appointments.length);

    // Filter related variables
    const [idFilter, setIdFilter] = useState(null);
    const [dateFilter, setDateFilter] = useState(null);
    const [workerFilter, setWorkerFilter] = useState(null);
    const [customerFilter, setCustomerFilter] = useState(null);
    const [filteredAppointments, setFilteredAppointments] = useState(appointments);

    // useEffect which will call the first time the page loads (and thats it)
    useEffect(() => {
        displayBookings();
    }, []);

    const displayBookings = async() => {
        if (userType === 'customer') {
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/customer/view`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(array => {
                    setAppointments(array);
                    setFilteredAppointments(array);
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
                    setFilteredAppointments(array);
                    setShowAmount(array.length);
                })
            });
        }
    }

    const setNewFilter = (filter, value) => {
        setFilteredAppointments([]);
        switch (filter) {
            case("ID"):
                setIdFilter(value);
                break;

            case("Date"):
                setDateFilter(value);
                break;

            case("Worker"):
                setWorkerFilter(value);
                break;

            case("Customer"):
                setCustomerFilter(value);
                break;
        }
    }

    // useEffect which has dependency on the filters (everytime a filter changes, execute this)
    useEffect(() => {
        let tempAppointments = [];
        if (idFilter === null && dateFilter === null && workerFilter === null && customerFilter === null) {
            setFilteredAppointments(appointments);
            return;
        }

        // Outer loop, each iteration is a new appointment, and 'outerKey' is just the index starting from 0.
        // For each filter, check if its true. If all are true, add that appointment to the tempAppointments.
        Object.entries(appointments).map(([outerKey, outerValue]) => {
            // if bookingId matches
            let idFilterMatches = idFilter === null ? true : false;
            if (String(appointments[outerKey]['bookingId']).startsWith(String(idFilter))) {
                idFilterMatches = true;
            }

            // Date
            let dateFilterMatches = dateFilter === null ? true : false;
            if (moment(appointments[outerKey]['startTime']).format("dddd, MMMM Do").includes(dateFilter)) {
                dateFilterMatches = true;
            }

            // Worker, iterate through each key for the worker object and just check if its similar.
            let workerFilterMatches = workerFilter === null ? true : false;
            if (appointments[outerKey]['workerEntity'] !== null) {
                Object.entries(appointments[outerKey]['workerEntity']).map(([workerEntityKey, workerEntityValue]) => {
                    if (String(workerEntityValue).includes(String(workerFilter))) {
                        workerFilterMatches = true;
                        return;
                    }
                })
            }

            // Iterate through the key/values of the customerEntity, and if any match the customerFilter, set the bool to true.
            let customerFilterMatches = customerFilter === null ? true : false;
            if (appointments[outerKey]['customerEntity'] !== null) {
                Object.entries(appointments[outerKey]['customerEntity']).map(([customerEntityKey, customerEntityValue]) => {
                    if (customerEntityKey === 'address' || customerEntityKey === 'phoneNumber') { return; }
                    if (String(customerEntityValue).includes(String(customerFilter))) {
                        customerFilterMatches = true
                        return;
                    }
                })
            }

            if (idFilterMatches && dateFilterMatches && workerFilterMatches && customerFilterMatches) {
                tempAppointments.push(appointments[outerKey]);
            }
        })

        setFilteredAppointments(tempAppointments);
    }, [idFilter, dateFilter, workerFilter, customerFilter])

    return(
        <div id="appointmentsContainer">
            <Card.Header> Your Appointments 
                <FilterAmount maxAmount={appointments.length} setShowAmount={setShowAmount}/>
            </Card.Header>

            <div id="appointmentsContainerBody">
                <SearchBox setNewFilter={setNewFilter}/>
                <div className={userType !== "customer"? "holdsAllAppointmentsDivAsWorkerAdmin" : "holdsAllAppointmentsDivAsCustomer"}>
                    {Object.entries(filteredAppointments.slice(0, showAmount)).map(([key, value]) => {
                        return <Appointment details={value} userType={userType} futureApp={true} displayBookings={displayBookings}/>
                    })}
                </div>
            </div>
        </div>
    )
}

export default HomeAppointments;