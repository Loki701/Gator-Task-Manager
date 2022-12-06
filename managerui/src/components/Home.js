import { useRef, useState, useEffect, useContext } from 'react';
import logo from '../images/logo.png';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import axios from '../api/axios';
import Event from './Event';

const EVENTLIST_URL = 'api/users/getEvents';
const DELETE_URL = 'api/users/deleteEvent';
const EDITEVENT_URL = 'api/users/editEventById';

const Home = () => {
    const [events, setEvents] = useState([]);
    const [listStatus, setListStatus] = useState(false);
    const navigate = useNavigate();

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


    const [mood,setMood] = useState(false);
    const moodInt = () =>{
        setMood(true);
    }

    const listItems = events.map((event,index) =>
        <div key={index}>
            <Event event={event} index={index}/>
        </div>
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
        <>
        <div className='home'>
            <div className='header-container'>
            <div className='title-context'>
                <img className='logo' src={logo} />
                <h1 className='title'>Gator Manager</h1>
            </div>
                <Link to= '/' className='logout' >Logout</Link>
            </div>
            <div className="addEvent-button-container">
                <button onClick={(e)=>{navigate('/AddEvent')}} className='addevent-button'>AddEvent</button>
            </div>

            <div className='list-container'>
                {listItems}
            </div>

            
        </div>
        {mood?(<p>Thanks for the input!</p>) : (
            <div className='home-footer'>
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
        </>
    )
}
    
export default Home