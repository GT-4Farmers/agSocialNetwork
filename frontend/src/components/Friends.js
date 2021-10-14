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
        Axios.post("/profile/friends", {
            profileRoute: profileRoute
        }).then(res => {
            if (res.data.success) {
                setFriendListRoutes(res.data.friendsList[0]);

                Axios.post("/profile/friends/friendslist", {
                    friendsUuids: res.data.friendsList[0]
                }).then(resTwo => {
                    if (resTwo.data.success) {
                        setFriendList(resTwo.data.friendsList[0]);
                    }
                })
            }
        });

        // unmount cleanup
        return () => { 
            setFriendListRoutes([]);
            setFriendList([]);
        };
    }, []);

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return (
        <div className="content">
            <div>
                <h2> Friends </h2>
            </div>
            <div>
                <button onClick={() => {history.goBack()}}>Back</button>
            </div>
            <div className="block">
            {(!(friendList.length === 0)) ? friendList.map((val, key) => {
                return(
                    <div className="greyBox">
                        <Link className="link" key={key} to={`/${friendListRoutes[key]}`}>
                            {val}
                        </Link>
                    </div>
                )
            }) : <div>User has no friends... :(</div>}
            </div>
        </div>
    )
}

export default Friends; 
