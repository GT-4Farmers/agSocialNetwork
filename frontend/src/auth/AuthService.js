import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Axios from 'axios';

function AuthService() {
    let history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        Axios.get("/login")
        .then(res => {
            setIsLoggedIn(res.data.success);
        })
        
        return () => {
            setIsLoggedIn(false);
        };
    });

    if (!isLoggedIn) {
        return (
            <button className="center" onClick={() => history.push("/")}>Not logged in?</button>
        )
    } else {
        return (
            <></>
        )
    }
}

export default AuthService
