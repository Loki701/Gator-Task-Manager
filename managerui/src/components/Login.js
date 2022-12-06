import { useRef, useState, useEffect} from 'react';
import logo from '../images/logo.png';
import {Link} from 'react-router-dom';
import {Navigate} from 'react-router-dom';
//import {AuthProvider} from '../context/AuthProvider'

import axios from '../api/axios';
const LOGIN_URL = '/api/auth/login';

const Login = () => {
    //const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [username, setUser] = useState('');
    const [password, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [username, password])

    
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("handling submit!")
        
        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ username, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response));
            const accessToken = response?.data?.accessToken;
            console.log()
            //setAuth({ username, password, roles, accessToken });
            if(response.data.success){
                setUser('');
                setPwd('');
                setSuccess(true);
            }
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }
    }
    


    return (
        <div className='homepage-container'>
            <div className='title-context'>
                <img className='logo' src={logo} />
                <h1 className='title'>Gator Manager</h1>
            </div>
            {success ? (
                <Navigate to="/Home"/>
            ) : (
                
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <div className='signin-content'>
                    <h1 className='signin-header'>Sign In</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={username}
                            required
                        />

                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={password}
                            required
                        />
                        <div className='context-button'>
                        <button className='singin-button' >Sign In</button>
                        </div>
                    </form>
                    <p>
                        Need an Account?<br />
                        <span className="line">
                            <Link to="/Register">Sign Up</Link>
                        </span>
                    </p>
                </section>
                
            )}
        </div>
    )
}

export default Login