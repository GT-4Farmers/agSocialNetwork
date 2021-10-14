import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import Axios from 'axios';

function AuthService() {
    let history = useHistory();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    Axios.defaults.withCredentials = true;

    useEffect(() => {
        async function fetchData() {
            const res = await Axios.get("/login");
            setIsLoggedIn(res.data.success);
        }
        fetchData()
        // return () => {
        //     setIsLoggedIn(false);
        // };
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
