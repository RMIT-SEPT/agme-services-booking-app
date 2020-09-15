import React, { useState, useEffect } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';

import '../../css/pages/workerList.css';

import Worker from './worker.js';

const WorkerList = ({userDetails}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [workersData, setWorkersData] = useState([]);
    const localizer = momentLocalizer(moment);

    // Related to the new worker form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [addWorkerResponse, setAddWorkerResponse] = useState(null);

    // Modal related variables / functions
    var subtitle;
    const customStyles = {
        content : {
            top: '50%',
            left: '15%',
            right: 'auto',
            bottom: 'auto',
            textAlign: 'center',
            transform: 'translate(-50%, -50%)',
            color: 'black'
        }
    };
    const setModalStatus = (booleanVal) => {
        setModalIsOpen(booleanVal);
    }
    const closeModal = () => {
        setAddWorkerResponse('');
        setModalIsOpen(false);
    }

    useEffect(() => {
        var allWorkers = [];

        const fetchData = async() => {
            const requests = [];

            await fetch(`http://localhost:8080/api/v1/admin/workers`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }

            }).then(response => {
                // Array holds all worker objects, each with format {id=..., firstName=..., lastName=..., username=..., role=...}
                response.json().then(async(array) => {
                    
                    // Each key is index, and each value is the worker object. Hence, details: value is details: {id=..., firstName=..., etc.}
                    Object.entries(array).map(async([key, value]) => {
                        let individualWorkerDetails = {
                            id: value.id,
                            details: value
                        }
                        await fetch(`http://localhost:8080/api/v1/admin/workers/${value.id}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            }
                        }).then(response => { 
                            response.json().then(array => {
                                individualWorkerDetails['availability'] = array;
                                allWorkers.push(individualWorkerDetails);
                                setWorkersData([...allWorkers]);
                            })
                        })
                    })
                })
            })
        }

        fetchData();
    }, []);

    const addWorkerAPI = async () => {
        const newWorkerDetails = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            password: password,
            role: role
        }
        console.log(`sending:\n ${JSON.stringify(newWorkerDetails)}`)
        await fetch(`http://localhost:8080/api/v1/admin/workers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newWorkerDetails)
        }).then(response => {
            if (response.ok) {
                setAddWorkerResponse('Successfully added worker. Refresh to see changes.');
            } else {
                setAddWorkerResponse('Failed to add worker. Please try again.')
            }
            console.log(response.status)
        })
    }

    const addWorkerModal = () => {
        return (
            <span>
                <button className="addBtn" onClick={() => setModalStatus(true)}>Add Worker</button>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                >
      
                <h2 ref={_subtitle => (subtitle = _subtitle)}>Enter new worker details</h2>
                <div id="newWorkerFormArea">
                    <form id="newWorkerForm">
                        <input name="firstName" type="text" placeholder=" First Name" onChange={(e) => setFirstName(e.target.value)}/>
                        <input name="lastName" type="text" placeholder=" Last Name" onChange={(e) => setLastName(e.target.value)}/>
                        <input name="username" type="text" placeholder=" Username" onChange={(e) => setUsername(e.target.value)}/>
                        <input name="password" type="password" placeholder=" Password" onChange={(e) => setPassword(e.target.value)}/>
                        <input name="role" type="text" placeholder=" Role" onChange={(e) => setRole(e.target.value)}/>
                        <input id="submitNewWorkerBtn" type="button" value="Add New Worker" onClick={addWorkerAPI}/>
                    </form>
                    <p>{addWorkerResponse}</p>
                </div>
                <button id="closeModalBtn" onClick={closeModal}>Close Form</button>
                </Modal>
            </span>
        );
    }

    return(
        <div id="workerListContainer">
            <h1> Workers 
                {addWorkerModal()}
            </h1>
            {Object.entries(workersData).map(([key, value]) => {
                return <Worker key={key} worker={value} localizer={localizer}/>
            })}
        </div>
    )
}

export default WorkerList;