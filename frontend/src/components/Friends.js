import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router';
import '../App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Friends() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    const [friendList, setFriendList] = useState([])
    let profileRoute = (window.location.pathname).substring(1)
    var pathArray = profileRoute.split('/');
    profileRoute = (pathArray[0]);
    console.log(profileRoute)

    useEffect(() => {
        let unmounted = false;

        Axios.post("http://localhost:3001/profile/friends", {
            profileRoute: profileRoute
        })
        .then(res => {
            if (!unmounted) {
                if (res.data.success) {
                    setFriendList(res.data.friendsList[0]);
                }
            }
        })
        return () => { unmounted = true };
    }, [friendList]);
    console.log("same",friendList)

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    const handleFriendClicked = (friendUrl) => {
        history.push(`/${friendUrl}`)
    }

    return (
        <div className="App">
            <div>
                <h1> Friends </h1>
            </div>
            <div className="registration">
                {(!(friendList.length === 0)) ? friendList.map((val, key) => {
                return(
                    <button key={key} onClick={handleFriendClicked(friendList[key])}>
                        {/* <button onClick={handleFriendClicked(friendList[key])}> */}
                            {val}
                        {/* </button> */}
                    </button>
                )
            }) : <div>User has no friends... :(</div> }
            </div>
        </div>
    )
}

export default Friends; 
