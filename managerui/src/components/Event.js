import { useRef, useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const DELETE_URL = 'api/users/deleteEvent';
const EDITEVENT_URL = 'api/users/editEventById';

const Event = (props) =>{
    const [dropStatus, setDropStatus] = useState(false);
    const [edit, setEdit] = useState(false)
    const navigate = useNavigate();

    //
    const [title, setTitle] = useState('');
    const [titleFocus, setTitleFocus] = useState(false);
    const [description, setDesc] = useState('');
    const [descriptionFocus, setDescriptionFocus] = useState(false);
    const [date, setDate] = useState();
    const [dateFocus, setDateFocus] = useState(false);
    const [time, setTime] = useState();
    const [timeFocus, setTimeFocus] = useState(false);
    const [offset, setOffset] = useState(0);
    const [offsetFocus, setOffsetFocus] = useState(false);

    
    const handleEditSubmit = async (e) =>{
        let eventId = props.event._id
        try {
            const response = await axios.patch(EDITEVENT_URL,
                JSON.stringify({
                    eventId,
                    title,
                    description,
                    date,
                    time,
                    offset
                }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // TODO: remove console.logs before deployment
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
 
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 409) {
                console.log('Username Taken');
            } else {
                console.log('401')
            }
        }
    }
    const handleEditCancel = () =>{
        setEdit(false)
        setDropStatus(false)
    }



    const handleEdit = async (e, eventId) => {
        setEdit(true)

    }
    const handleEventClick = ()=>{
        setDropStatus(!dropStatus)
        setEdit(false)
    } 
    const handleDelete = async (e) => {
        let eventId = props.event._id
        try {
            const response = await axios.post(DELETE_URL,
                JSON.stringify({eventId}),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true 
            });
            // TODO: remove console.logs before deployment
            //console.log(JSON.stringify(response?.data));
            console.log(JSON.stringify(response))
            window.location.reload(false)
 
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 409) {
                console.log('Username Taken');
            } else {
                console.log('401')
            }
        }
    }
    return(
        <li key ={props.index} className='list'>
            <button onClick={handleEventClick} className='list-item-details'>
                <div className='list-item-title'>
                    {props.event.title}
                </div>
                <div className='list-item-date'>
                    {props.event.date}
                </div>
            </button>
            {edit?
            <div className='edit-form'>
                <label htmlFor="Title:">Title:</label>
            <input
                type="text"
                id="title"
                autoComplete="off"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                required
                onFocus={() => setTitleFocus(true)}
                onBlur={() => setTitleFocus(false)}
            />
            <label htmlFor="Description">Description:</label>
            <input
                type="text"
                id="description"
                autoComplete="off"
                onChange={(e) => setDesc(e.target.value)}
                value={description}
                onFocus={() => setDescriptionFocus(true)}
                onBlur={() => setDescriptionFocus(false)}
            />
            <label htmlFor="Date">Date:</label>
            <input
                type="date"
                id="date"
                autoComplete="off"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                required
                onFocus={() => setDateFocus(true)}
                onBlur={() => setDateFocus(false)}
            />
            <label htmlFor="Time">Time:</label>
            <input
                type="time"
                id="time"
                autoComplete="off"
                onChange={(e) => setTime(e.target.value)}
                value={time}
                required
                onFocus={() => setTimeFocus(true)}
                onBlur={() => setTimeFocus(false)}
            />
            <label htmlFor="Offset">Reminder:</label>
            <select
                type="range"
                id="offset"
                autoComplete="off"
                onChange={(e) => setOffset(e.target.value)}
                value={offset}
                onFocus={() => setOffsetFocus(true)}
                onBlur={() => setOffsetFocus(false)}
            >
                <option>15 m</option>
                <option>30 m</option>
                <option>45 m</option>
                <option>1 h</option>
                
            </select>
            <div className='addeventButton-container'>
                <button className='addevent-button' onClick={handleEditSubmit}>Save</button>
                <button className='addevent-button' onClick={handleEditCancel}>Cancel</button>
            </div>
            </div>:
            <div className={dropStatus?'event-dropdown-active':'event-dropdown'}>
                <div className='updatebutton-container'>
                <button className='updatebutton' onClick={e=>handleEdit(e)}>Edit</button>
                <button className='updatebutton' onClick={e => handleDelete(e)}>Delete</button>
                </div>
            </div>
            }
        </li>
    )
}

export default Event;