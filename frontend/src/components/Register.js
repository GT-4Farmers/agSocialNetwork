import React, { useState } from 'react'
import Axios from 'axios'
import '../css/App.css';
import '../css/Login.css';
import { useHistory } from 'react-router';
import uuid from 'react-uuid';
import logo from './logo.png';

function Register() {
    let uniqueID = uuid();
    const history = useHistory();

    const [firstNameReg, setFirstNameReg] = useState(null);
    const [lastNameReg, setLastNameReg] = useState(null);
    const [emailReg, setEmailReg] = useState(null);
    const [passwordReg, setPasswordReg] = useState("");
    const [confirmPasswordReg, setConfirmPasswordReg] = useState("");
    
    const [hidden, setHidden] = useState(true);
    
    const register = () => {
        Axios.post('/register', {
            uuid: uniqueID,
            firstName: firstNameReg,
            lastName: lastNameReg,
            email: emailReg,
            password: passwordReg,
            confirmPassword: confirmPasswordReg
        }).then(res => {
            if (!res.data.success) {
                alert(res.data.msg);
            } else {
                history.push('/');
            }
        });
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (passwordReg === confirmPasswordReg) {
            register();
        } else {
            alert("Passwords do not match");
        }
    }

    return (
        <div className="App">
            <header>
                <img alt='Haystack Logo' src={logo}/>
                <h1>HAYSTACK</h1>
            </header>
            <h2 className="loginText">Sign Up</h2>
            <div className = "column">
                <div className="loginBox">
                    <input
                        type="text"
                        placeholder="First Name"
                        value={firstNameReg ? firstNameReg : ""}
                        onChange={(e) => {setFirstNameReg(e.target.value)}}
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        value={lastNameReg ? lastNameReg : ""}
                        onChange={(e) => {setLastNameReg(e.target.value)}}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={emailReg ? emailReg : ""}
                        onChange={(e) => {setEmailReg(e.target.value)}}
                    />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Password"
                        value={passwordReg ? passwordReg : ""}
                        onChange={(e) => {setPasswordReg(e.target.value)}}
                    />
                    <input
                        type={hidden ? "password" : "text"}
                        placeholder="Confirm Password"
                        value={confirmPasswordReg ? confirmPasswordReg : ""}
                        onChange={(e) => {setConfirmPasswordReg(e.target.value)}}
                    />
                    <button onClick={() => {setHidden(!hidden)}} id="showhide">Show/Hide</button>
                </div>
                <button className="loginButton" onClick={handleRegister}>Sign Up</button>

                <div>
                    <span>Already have an account? </span>
                    <a id="logIn" onClick={() => {history.push("/")}}>Login here</a>
                </div>
            </div>
        </div>
    )
}

export default Register
