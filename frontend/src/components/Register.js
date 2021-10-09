import React, { useState } from 'react'
import Axios from 'axios'
import '../css/App.css';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';
import logo from './logo.png';

function Register() {
    let uniqueID = uuid();

    const history = useHistory();
    const handleHistory = () => {
        history.push("/");
    }

    const [state, setState] = useState({
        firstNameReg: null,
        lastNameReg: null,
        emailReg: null,
        passwordReg: "",
        confirmPasswordReg: ""
    })
    
    const [hidden, setHidden] = useState(true);
    
    const register = () => {
        
        Axios.post('http://localhost:3001/register', {
            uuid: uniqueID,
            firstName: state.firstNameReg,
            lastName: state.lastNameReg,
            email: state.emailReg,
            password: state.passwordReg,
            confirmPassword: state.confirmPasswordReg
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                redirectToHome();
            }
        })
    };

    const redirectToHome = () => {
        history.push('/');
    }

    const toggleShow = () => {
        setHidden(!hidden)
    }

    const handleRegister = (e) => {
        e.preventDefault();
        if (state.passwordReg === state.confirmPasswordReg) {
            register();
        } else {
            alert("Passwords do not match");
        }
    }
    
    const handleChange = (e) => {
        const { id, value } = e.target
        setState(prevState => ({
            ...prevState,
            [id] : value
        }))
    }

    return (
        <div className="App">
            <header>
                <img alt='Haystack Logo' src={logo}/>
                <h1>HAYSTACK</h1>
            </header>
            <h2>Sign Up</h2>
            <div className = "column">
                <div className="loginBox">
                    <input
                        type="text"
                        placeholder="First Name"
                        id="firstNameReg"
                        value={state.firstNameReg ? state.firstNameReg : ""}
                        onChange={handleChange}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        id="lastNameReg"
                        value={state.lastNameReg ? state.lastNameReg : ""}
                        onChange={handleChange}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        id="emailReg"
                        value={state.emailReg ? state.emailReg : ""}
                        onChange={handleChange}
                    />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Password"
                        id="passwordReg"
                        value={state.passwordReg ? state.passwordReg : ""}
                        onChange={handleChange}
                    />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Confirm Password"
                        id="confirmPasswordReg"
                        value={state.confirmPasswordReg ? state.confirmPasswordReg : ""}
                        onChange={handleChange}
                    />
                    <button onClick={toggleShow} id="showhide">Show/Hide</button>
                </div>
                <button onClick={handleRegister}>Sign Up</button>

                <div>
                    <span>Already have an account? </span>
                    <a id="logIn" onClick={handleHistory}>Login here</a>
                </div>
            </div>
        </div>
    )
}

export default Register
