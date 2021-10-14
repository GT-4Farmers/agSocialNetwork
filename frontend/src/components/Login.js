import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios'
import '../css/App.css';
import '../css/Login.css';
import AuthContext from '../states/AuthContext';
import logo from './logo.png';

function Login() {

    let history = useHistory();

    const { setIsLoggedIn } = useContext(AuthContext);
    const { setUser} = useContext(AuthContext);
    const { areNotifications, setAreNotifications } = useContext(AuthContext);
    const [hidden, setHidden] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const login = () => {
        async function fetchData() {
            const res = await Axios.post('http://localhost:3001/login', {
                email: email,
                password: password
            });
            if (!res.data.success) {
                alert(res.data.msg);
            } else {
                setIsLoggedIn(true);
                setUser(res.data.uuid);
                setAreNotifications(false);
                history.push("/home");
            }   
        }
        fetchData();
    };

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
                        value={email ? email : ""}
                        onChange={(e) => {setEmail(e.target.value)}} />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Password"
                        value={password ? password : ""}
                        onChange={(e) => {setPassword(e.target.value)}} />
                    <button onClick={() => {setHidden(!hidden)}} id="showhide">Show/Hide</button>
                </div>

                <button className="loginButton" onClick={login}>Login</button>

                <button className="loginButton" onClick={() => {history.push("/register")}}>Create New Account</button>
            </div>
        </div>
    )
}

export default Login
