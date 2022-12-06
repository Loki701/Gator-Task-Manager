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
    const [messageScore, setMessageScore] = useState(null)
    const navigate = useNavigate();
    const messages = [
        "Make sure you've reached out to someone you trust if you need emotional support. If you or a friend needs serious support, call 1-800-662-HELP (4357)  to talk to the Substance Abuse and Mental Health Services Administration.",
        "If you are experiencing a pattern of anxiety or sadness, you may want to check out the UF CWC. The CWC (https://counseling.ufl.edu/) has great resources to support students' mental health. Visit their website to book therapy or attend open sessions.",
        "Seems like you need a boost. Consider taking care of your mental health by stretching, eating a healthy snack, or spending time with friends today.",
        "Glad you are feeling great."
    ]

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
    const moodInt = (e, score) =>{
        if(score > 3){
            setMessageScore(4)
        }else{
            setMessageScore(score)
        }
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
        {mood?(<p className='message-report' >{messages[messageScore-1]}</p>) : (
            <div className='home-footer'>
                <p className='mood-title'>How are you feeling today?</p>
            
                <div className='moodTracker'>
                    <a onClick={(e) =>{moodInt(e,5)}} className='emoji'>😁</a>
                    <a onClick={(e) =>{moodInt(e,4)}} className='emoji'>🙂</a>
                    <a onClick={(e) =>{moodInt(e,3)}} className='emoji'>😐</a>
                    <a onClick={(e) =>{moodInt(e,2)}} className='emoji'>🙁</a>
                    <a onClick={(e) =>{moodInt(e,1)}} className='emoji'>☹️</a>
                </div>
            </div>
            )}
        </>
    )
}
    
export default Home