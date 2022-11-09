import { useRef, useState, useEffect, useContext } from 'react';
import logo from './img/logo.png';
const Home = () => {
    const tasks = [
        {title:"Go to the gym", description:"GO to the gym"},
        {title:"Walk the dog", description:"GO to the gym"},
        {title:"Do homework" , description:"GO to the gym"},
        {title:"Go for a run", description:"GO to the gym"},
        {title:"Start heading to work", description:"GO to the gym"}
    ];
    const listItems = tasks.map((task) =>
        <li className='list-item'>
            <div className='list-item-details'>
            <div className='list-item-title'>
            {task.title}
            </div>
            </div>
        </li>
    )
    const [mood,setMood] = useState(false);
    const moodInt = () =>{
        setMood(true);
    }

    return(
        <div className='home'>
            <div className='title-context'>
                <img className='logo' src={logo} />
                <h1 className='title'>Gator Manager</h1>
            </div>
            <div class="search__container">
                <input class="search__input" type="text" placeholder="Add"/>
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