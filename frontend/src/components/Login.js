import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import Axios from 'axios'
import '../App.css';
import AuthContext from '../states/AuthContext';

function Login(props) {

    let history = useHistory();

    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

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
                console.log("successful login");
                history.push("/home");
            }
        })
    };
    
    const handleHistory = () => {
        history.push("/register");
    }

    return (
        <div className = "App">
            <div className = "registration">
                <h1>Login</h1>
                <label>Email</label>
                <input
                    type="email"
                    placeholder="Email"
                    id="email"
                    value={state.email ? state.email : ""}
                    onChange={handleChange}
                />
                <label>Password</label>
                <input
                    type={hidden ? "password" : "text"}
                    placeholder="Password"
                    id="password"
                    value={state.password ? state.password : ""}
                    onChange={handleChange}
                />
                
                <button onClick={toggleShow}> Show/Hide </button>
                <button onClick={login}>Login!</button>

                <div>
                    <button onClick={handleHistory}>Create New Account</button>
                </div>
                
            </div>
        </div>
    )
}

export default Login
