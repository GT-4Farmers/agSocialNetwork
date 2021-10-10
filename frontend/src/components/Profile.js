import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';

function Profile() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    let { uid } = useParams()
    const [uuid, setUuid] = useState(uid);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFriend, setIsFriend] = useState(false);
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [isPending, setIsPending] = useState('');

    useEffect(() => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile", {
            profileRoute: uuid
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

    useEffect(() => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
            profileRoute: uuid
        })
            .then(res => {
                if (!unmounted) {
                    setIsFriend(res.data.isFriend);
                    setIsProfileOwner(res.data.isUser);
                    // setIsPending(res.data.isPending);
                }
            })

        return () => { unmounted = true };
    }, [isPending]);

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

    const handleFriendRequest = () => {
        Axios.post("http://localhost:3001/profile/friends/friendRequest", {
            profileRoute: uid,
            mode: 'request'
        })
        pendingHandler();
    }

    const pendingHandler = () => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
            profileRoute: uuid
        })
        .then(res => {
            if (!unmounted) {
                setIsPending(res.data.isPending);
            }
        })

        return () => { unmounted = true };
    }

    return (
        <div className="content">
            <div className="greyBox">
                <h2>{firstName} {lastName}</h2>
            </div>
            <h3>This is a user's bio.</h3>

            <div className="">
                <button onClick={handleAbout}>About</button>
                {/* <button onClick={handlePhotos}>Photos</button> */}
                <button>Photos</button>
                <button onClick={handleFriends}>Friends</button>
                {(isProfileOwner || isFriend) ? null : <button onClick={handleFriendRequest}> {isPending ? "Friend Request Sent" : "Send Friend Request"} </button>}
            </div>

            <p>User posts displayed here</p>
        </div>
    )
}

export default Profile;