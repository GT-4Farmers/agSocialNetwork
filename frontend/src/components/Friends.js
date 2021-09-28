import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router';
import '../App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';

function Friends() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // useEffect(() => {
    //     let unmounted = false;

    //     Axios.get("http://localhost:3001/profile")
    //     .then(res => {
    //         if (!unmounted) {
    //             setEmail(res.data.email)
    //             setFirstName(res.data.firstName);
    //             setLastName(res.data.lastName);
    //         }
    //     })

    //     return () => { unmounted = true };
    // }, []);

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return (
    <div className="App">
        <h1>Friends</h1>
    </div>
    )
}

export default Friends; 