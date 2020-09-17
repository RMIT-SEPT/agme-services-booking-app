import React, { useState, useEffect } from 'react';
import '../../css/pages/workerList.css';

import Worker from './worker.js';

const WorkerList = () => {
    const [workers, setWorkers] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            await fetch(`http://localhost:8080/api/v1/admin/workers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then(array => {
                    setWorkers(array);
                })
            })
        }
        fetchData();
    }, []);

    return(
        <div id="workerListContainer">
            <h1> Worker List </h1>
            {Object.entries(workers).map(([key, value]) => {
                return <Worker details={value}/>
            })}
        </div>
    )
}

export default WorkerList;