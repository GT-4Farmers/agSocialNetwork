import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';

function Profile() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    let {uid} = useParams()
    const [uuid, setUuid] = useState(uid);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    useEffect(() => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile", {
            profileRoute: uid
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

    const handleAbout = () => {
        history.push(`/${uuid}/about`);
    }

    const handleFriends = () => {
        history.push(`/${uuid}/friends`);
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