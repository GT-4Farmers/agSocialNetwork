import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Notifications() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [incomingRequestsRoutes, setIncomingRequestsRoutes] = useState([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let unmounted = false;

        Axios.get("http://localhost:3001/profile/friends/incomingRequests")
        .then(res => {
            if (!unmounted) {
                if (res) {
                    setIncomingRequests(res.data.incomingRequests[0]);
                    setIncomingRequestsRoutes(res.data.incomingRequestsRoutes[0]);
                    setCounter(incomingRequests.length);
                } 
            }
        })
        return () => { unmounted = true };
    }, [counter]);

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    const handleAccept = (route) => {
        Axios.post("http://localhost:3001/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'accept'
        }).then(res => {
            setCounter(counter-1);
        })
    }

    const handleReject = (route) => {
        Axios.post("http://localhost:3001/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'reject'
        }).then(res => {
            setCounter(counter-1);
        })
    }

    return (
        <div className="content">
            <div>
                <h2>Notifications</h2>
            </div>
            <div className="registration">
            {(!(incomingRequests.length === 0)) ? incomingRequests.map((val, key) => {
                let requester = <Link key={key} to={`/${incomingRequestsRoutes[key]}`}>{val}</Link>

                let acceptBtn = <button className onClick = {() => {handleAccept(incomingRequestsRoutes[key])}}>Accept</button>
                let rejectBtn = <button onClick = {() => {handleReject(incomingRequestsRoutes[key])}}>Reject</button>
                return(
                    <div className="greyBox">
                        {requester} 
                        <p className="inline"> has sent you a friend request.</p>
                        {acceptBtn} 
                        {rejectBtn}
                    </div>
                )
            }) : <p>No notifications</p> }
            </div>
        </div>
    )
}

export default Notifications; 
