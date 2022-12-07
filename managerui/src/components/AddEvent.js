import { useRef, useState, useEffect, useContext } from 'react';
import logo from '../images/logo.png';
//import Time from 'react-time'
import { Navigate, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
const ADDEVENT_URL = '/api/users/addEvent';
const AddEvent = () => {
    const toDay = new Date().toISOString().substring(0, 10);
    const toTime = new Date().toISOString().substring(12, 16);
    const [title, setTitle] = useState('');
    const [titleFocus, setTitleFocus] = useState(false);
    const [description, setDesc] = useState('');
    const [descriptionFocus, setDescriptionFocus] = useState(false);
    const [date, setDate] = useState(toDay);
    const [dateFocus, setDateFocus] = useState(false);
    const [time, setTime] = useState();
    const [timeFocus, setTimeFocus] = useState(false);
    const [offset, setOffset] = useState(0);
    const [offsetFocus, setOffsetFocus] = useState(false);
    const navigate = useNavigate();

   
    const handleSubmit = async (e) => {
        try {
            const response = await axios.post(ADDEVENT_URL,
            JSON.stringify({ title, date, time, offset}),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // TODO: remove console.logs before deployment
            //console.log(JSON.stringify(response?.data));
            navigate('/Home')
            //console.log(JSON.stringify(response))
    
        } catch (err) {
            if (!err?.response) {
                console.log('No Server Response');
            } else if (err.response?.status === 409) {
                console.log('Username Taken');
            } else {
                console.log('Registration Failed')
            }
        }
    }
    const handleCancel = () =>{
        navigate('/Home')
    }
    return(
        <div className="AddEventContext">
            
            <div className='title-context'>
                <img className='logo' src={logo} />
                <h1 className='title'>Gator Manager</h1>
            </div>
            <div className='home' onSubmit={handleSubmit}>
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
            <label htmlFor="Date">Date:</label>
            <input
                type="date"
                id="date"
                autoComplete="off"
                onChange={(e) => setDate(e.target.value)}
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
                <button className='addevent-button' onClick={handleSubmit}>Add</button>
                <button className='addevent-button' onClick={handleCancel}>Cancel</button>
            </div>
            </div>
        </div>
    );
}

export default AddEvent;