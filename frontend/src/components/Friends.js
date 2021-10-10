import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Friends() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    const [friendList, setFriendList] = useState([])
    const [friendListRoutes, setFriendListRoutes] = useState([])
    let profileRoute = (window.location.pathname).substring(1)
    var pathArray = profileRoute.split('/');
    profileRoute = (pathArray[0]);

    useEffect(() => {
        let unmounted = false;
        let friendsListVar = []
        let friendsListNames = []

        Axios.post("http://localhost:3001/profile/friends", {
            profileRoute: profileRoute
        })
        .then(res => {
            if (!unmounted) {
                if (res.data.success) {
                    friendsListVar = res.data.friendsList[0];
                    setFriendListRoutes(friendsListVar);
                    Axios.post("http://localhost:3001/profile/friends/friendslist", {
                        friendsUuids: friendsListVar
                    })
                    .then(res => {
                        if (!unmounted) {
                            if (res.data.success) {
                                friendsListNames = res.data.friendsList[0];
                                setFriendList(friendsListNames);
                            }
                        }
                    })
                }
            }
        })
        return () => { unmounted = true };
    }, []);

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    const handleBack = () => {
        history.goBack();
    }

    return (

        <div className="content">
            <div>
                <h2> Friends </h2>
            </div>
            <div>
                <button onClick={handleBack}>Back</button>
            </div>
            <div className="searchResults">
            {(!(friendList.length === 0)) ? friendList.map((val, key) => {
                return(
                    <Link key={key} to={`/${friendListRoutes[key]}`} className="link">
                        {val}
                    </Link>
                )
            }) : <div>User has no friends... :(</div>}
            </div>
        </div>
    )
}

export default Friends; 
