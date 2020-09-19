import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

const AdminBusinessHours = () => {
    const localizer = momentLocalizer(moment);

    const [businessHours, setBusinessHours] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            await fetch(`http://localhost:8080/api/v1/admin/businesshours`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }).then(response => {
                response.json().then((json) => {
                    json.map((value) => {
                        const event = {
                            title: "Business Time",
                            start: moment(value.startTime).toDate(),
                            end: moment(value.endTime).toDate(),
                            resource: {
                                bookingId: value.bhEntryId
                            }
                        }
                        setBusinessHours([...businessHours, event])
                    });
                })
            })
        }

        fetchData();
    }, []);


    return(
        <div id="admin-business-hours">
            <Calendar
                localizer={localizer}
                events={businessHours}
                style={{ height: 400, width: 750}}
                defaultView={'work_week'}
                views={['work_week', 'day']}
                selectable={'ignoreEvents'}
                //onSelectSlot={handleSelectSlot}
            />

        </div>
    )
}

export default AdminBusinessHours;