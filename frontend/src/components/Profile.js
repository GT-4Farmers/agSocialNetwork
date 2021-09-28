import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';

function Profile() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    
    const [uuid, setUuid] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profileRoute, setProfileRoute] = useState((window.location.pathname).substring(1))
    let {uid} = useParams()
    

    useEffect(() => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile", {
            profileRoute: profileRoute
        })
        .then(res => {
            if (!unmounted) {
                setUuid(res.data.uuid);
                setEmail(res.data.email);
                setFirstName(res.data.firstName);
                setLastName(res.data.lastName);
            }
        })

        return () => { unmounted = true };
    }, []);
    uid = uuid

    const handleAbout = () => {
        history.push(`/${uid}/about`);
    }

    const handleFriends = () => {
        history.push(`/${uid}/friends`);
    }

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return (
    <div className="App">
        <h1>Profile</h1>
        <h2>{firstName} {lastName}</h2>
        
        <div>
            <button onClick={handleAbout}>About</button>
        </div>
        {/* <div>
            <button onClick={handlePhotos}>Photos</button>
        </div>*/}
        <div>
            <button onClick={handleFriends}>Friends</button>
        </div>
    </div>
    )
}

export default Profile;