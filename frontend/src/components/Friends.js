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
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/friends", {
                profileRoute: profileRoute
            })
            if (res.data.success) {
                setFriendListRoutes(res.data.friendsListRoute[0]);
                setFriendList(res.data.friendsList[0]);
            }
        }
        fetchData();

        // unmount cleanup
        // return () => { 
        //     setFriendListRoutes([]);
        //     setFriendList([]);
        // };
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
