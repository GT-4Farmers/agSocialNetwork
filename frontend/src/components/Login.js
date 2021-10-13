import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios'
import '../css/App.css';
import '../css/Login.css';
import AuthContext from '../states/AuthContext';
import logo from './logo.png';

function Login(props) {

    let history = useHistory();

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const {user, setUser} = useContext(AuthContext);
    const { areNotifications, setAreNotifications } = useContext(AuthContext);

    const [state, setState] = useState({
        email: "",
        password: ""
    })
    
    const [hidden, setHidden] = useState(true);
    
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }
    
    const toggleShow = () => {
        setHidden(!hidden)
    }
    
    const login = () => {
        Axios.post('http://localhost:3001/login', {
            email: state.email,
            password: state.password
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                setIsLoggedIn(true);
                setUser(response.data.uuid);
                setAreNotifications(false);
                history.push("/home");
            }
        })
    };
    
    const handleHistory = () => {
        history.push("/register");
    }

    return (
        <div>
            <header>
                <img alt='Haystack Logo' src={logo} />
                <h1>HAYSTACK</h1>
            </header>
            <h2 className="loginText">Login</h2>
            <div className="column">
                <div className="loginBox">
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={state.email ? state.email : ""}
                        onChange={handleChange} />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Password"
                        id="password"
                        value={state.password ? state.password : ""}
                        onChange={handleChange} />
                    <button onClick={toggleShow} id="showhide">Show/Hide</button>
                </div>

                <button className="loginButton" onClick={login}>Login</button>

                <button className="loginButton" onClick={handleHistory}>Create New Account</button>
            </div>
        </div>
    )
}

export default Login
