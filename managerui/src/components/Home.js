import { useRef, useState, useEffect, useContext } from 'react';
import logo from '../images/logo.png';
import {Link, Navigate} from 'react-router-dom';
import axios from '../api/axios';

const EVENTLIST_URL = 'api/users/getEvents';
const DELETE_URL = 'api/users/deleteEvent';
const EDITEVENT_URL = 'api/users/editEventById';

const Home = () => {
    const [events, setEvents] = useState([]);
    const fetchEvents = async()=>{
        try {
            const response = await axios.get(EVENTLIST_URL,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // TODO: remove console.logs before deployment
            //console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setEvents(response.data);
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
    useEffect(()=>{
        fetchEvents()
    },[])


    // const tasks = [
    //     {title:"Go to the gym", description:"GO to the gym"},
    //     {title:"Walk the dog", description:"GO to the gym"},
    //     {title:"Do homework" , description:"GO to the gym"},
    //     {title:"Go for a run", description:"GO to the gym"},
    //     {title:"Start heading to work", description:"GO to the gym"}
    // ];
    const [mood,setMood] = useState(false);
    const moodInt = () =>{
        setMood(true);
    }

    const handleEdit = async (e, eventId) => {
        try {
            const response = await axios.patch(EDITEVENT_URL,
                JSON.stringify({eventId}),
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
    const handleDelete = async (e, eventId) => {
        

        try {
            const response = await axios.delete(DELETE_URL,
                JSON.stringify({eventId}),
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

    const listItems = events.map((event,index) =>
        <li key ={index} className='list-item'>
            <button onClick={e=>handleEdit(e,event._id)}>edit</button>
            <div className='list-item-details'>
                <div className='list-item-title'>
                    {event.title}
                </div>
            </div>
            <button onClick={e => handleDelete(e, event._id)}>delete</button>

        </li>
    )
    const handleAPI = async (e) =>{
        try {
            const response = await axios.get('/api/users/test',
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
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

    return(
        <div className='home'>
            <button onClick={handleAPI}>Click</button>
            <div className='title-context'>
                <img className='logo' src={logo} />
                <h1 className='title'>Gator Manager</h1>
            </div>
            <div className="addEvent-button-container">
                <Link className='addEvent-button' to="/AddEvent"> Add Event</Link>
            </div>

            <div className='list'>
                {listItems}
            </div>
            {mood?(<p>Thanks for the input!</p>) : (
                <div>
            <p className='mood-title'>How are you feeling today?</p>
            <div className='moodTracker'>
                <a onClick={moodInt} className='emoji'>😁</a>
                <a onClick={moodInt} className='emoji'>🙂</a>
                <a onClick={moodInt} className='emoji'>😐</a>
                <a onClick={moodInt} className='emoji'>🙁</a>
                <a onClick={moodInt} className='emoji'>☹️</a>
            </div>
            </div>
            )}
        </div>
    )
}
    
export default Home