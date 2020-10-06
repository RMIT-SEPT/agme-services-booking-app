import React, { useState, useEffect } from 'react';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import Card from 'react-bootstrap/Card';

import '../../css/pages/workerList.css';

import Worker from './worker.js';

const WorkerList = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [workersData, setWorkersData] = useState([]);
    const localizer = momentLocalizer(moment);

    // Related to the new worker form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');

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
        setModalIsOpen(false);
    }

    useEffect(() => {
        var allWorkers = [];

        const fetchData = async() => {
            await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers`, {
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
                        await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers/${value.id}`, {
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
        await fetch(process.env.REACT_APP_API_URL + `/api/v1/admin/workers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(newWorkerDetails)
        }).then(response => {
            if (response.ok) {
                alert('Successfully added worker. Refresh to see changes.');
            } else {
                alert('Failed to add worker. Please try again.')
            }
            console.log(response.status)
        })
    }

    const addWorkerModal = () => {
        return (
            <span>
                <button className="addBtn" onClick={() => setModalStatus(true)}>Add Worker</button>
                <div id="worker-modal">
                <Modal
                    className="modalClass"
                    overlayClassName="myOverlayClass"
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Example Modal"
                >
                <div id="newWorkerFormArea">
                <h1>Enter new worker details</h1>
                    <form id="newWorkerForm">
                        <input name="firstName" type="text" placeholder=" First Name" onChange={(e) => setFirstName(e.target.value)}/>
                        <input name="lastName" type="text" placeholder=" Last Name" onChange={(e) => setLastName(e.target.value)}/>
                        <input name="username" type="text" placeholder=" Username" onChange={(e) => setUsername(e.target.value)}/>
                        <input name="password" type="password" placeholder=" Password" onChange={(e) => setPassword(e.target.value)}/>
                        <input name="role" type="text" placeholder=" Role" onChange={(e) => setRole(e.target.value)}/>
                    </form>
                    <input id="submitNewWorkerBtn" type="button" value="Add Worker" onClick={addWorkerAPI}/>
                    <button id="closeModalBtn" onClick={closeModal}>Cancel</button>
                </div>
                </Modal>
                </div>
            </span>
        );
    }

    return(
        <div id="workerListContainer">
            <Card.Header> Workers 
                {addWorkerModal()}
            </Card.Header>
            {Object.entries(workersData).map(([key, value]) => {
                return <Worker key={key} worker={value} localizer={localizer}/>
            })}
        </div>
    )
}

export default WorkerList;