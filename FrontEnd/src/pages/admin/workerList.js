import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import '../../css/pages/workerList.css';

import Worker from './worker.js';

const WorkerList = ({userDetails}) => {
    const userType = userDetails.userType;

    const [workersData, setWorkersData] = useState([]);
    const localizer = momentLocalizer(moment);

    useEffect(() => {
        var allWorkers = [];

        const getAllWorkerHours = (array) => {
            // For each worker object, need to make a fetch to get that worker's hours. Key is index, Value is the worker object itself.
            Object.entries(array).map(async([key, value]) => {
                let individualWorkerDetails = {
                    id: value.id,
                    details: value
                }
                let response = await fetch(`http://localhost:8080/api/v1/admin/workers/${value.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }).then(response => {
                    response.json().then(array => {
                        individualWorkerDetails['availability'] = array;
                        allWorkers.push(individualWorkerDetails);
                        console.log("finshed a worker");
                    })
                })
            })
        }

        const fetchData = async() => {

            await fetch(`http://localhost:8080/api/v1/admin/workers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            }).then(response => {
                // Array holds all worker objects, each with format {id=..., firstName=..., lastName=..., username=..., role=...}
                response.json().then(async(array) => {
                    console.log(JSON.stringify(array,null,2))
                    const workersArray = [];

                    let i = 0;
                    const requests = Object.entries(array).map(async ([key, value]) => {
                        i++;
                        let individualWorkerDetails = {
                            id: value.id,
                            details: value
                        }
                        let response = await fetch(`http://localhost:8080/api/v1/admin/workers/${value.id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then(response => {
                            response.json().then(array => {
                                individualWorkerDetails['availability'] = array;
                                console.log(JSON.stringify(individualWorkerDetails,null,2))
                                allWorkers.push(individualWorkerDetails);
                                workersArray.push(individualWorkerDetails);
                            })
                        })
                    })

                    Promise.all(requests).then(() => {
                        setWorkersData(workersArray);
                        console.log(`workers ARray: ${JSON.stringify(workersArray,null,2)}`)
                        console.log(i);

                    })
                })
            })
        }

        fetchData();
    }, []);

    return(
        <div id="workerListContainer">
            <h1> Workers </h1>
            {Object.entries(workersData).map(([key, value]) => {
                return <Worker details={value.details} localizer={localizer}/>
            })}
        </div>
    )
}

export default WorkerList;