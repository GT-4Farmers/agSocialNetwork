import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Profile() {
    // login, routing, user states
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { profileDummy, setProfileDummy } = useContext(AuthContext);
    const history = useHistory();
    let { uid } = useParams();
    let profileRoute = (window.location.pathname).substring(1)
    var pathArray = profileRoute.split('/');
    profileRoute = (pathArray[0]);
    const [uuid, setUuid] = useState(profileRoute);

    // info states
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // friend request states
    const [isFriend, setIsFriend] = useState(false);
    const [isProfileOwner, setIsProfileOwner] = useState(false);
    const [interactFR, setInteractFR] = useState(false);
    const [isPending, setIsPending] = useState('');
    const [reversePending, setReversePending] = useState('');

    // post states
    const [postContent, setPostContent] = useState('');
    const [posts, setPosts] = useState([]);
    const [ts, setTs] = useState([]);
    const [postIDs, setPostIDs] = useState([]);

    // network state
    const [network, setNetwork] = useState(0);

    useEffect(() => {
        let profileRoute = (window.location.pathname).substring(1)
        var pathArray = profileRoute.split('/');
        profileRoute = (pathArray[0]);

        setUuid(profileRoute);
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
        checkButton();
        return () => { unmounted = true };
    }, [profileDummy]);

    const checkButton = () => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
            profileRoute: profileRoute
        })
            .then(res => {
                if (!unmounted) {
                    setIsFriend(res.data.isFriend);
                    setIsProfileOwner(res.data.isUser);
                    setIsPending(res.data.isPending);
                    setReversePending(res.data.reversePending);
                }
            })
        return () => { unmounted = true };
        
    }

    useEffect(() => {
        let unmounted = false;
        Axios.post("http://localhost:3001/profile/getTextPosts", {
            profileRoute: profileRoute
        })
        .then(res => {
            if (!unmounted) {
                setPosts(res.data.posts);
                setTs(res.data.timestamps);
                setPostIDs(res.data.postIDs);
            }
        })
        return () => { unmounted = true };
    }, [profileDummy, network]);

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
        handlePending();
    }

    const handlePending = () => {
        setIsPending(true);
    }

    const handleAccept = (route) => {
        Axios.post("http://localhost:3001/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'accept'
        }).then(
            setInteractFR(true)
        )
    }

    const handleReject = (route) => {
        Axios.post("http://localhost:3001/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'reject'
        }).then(
            setInteractFR(true)
        )
    }

    const ReversePendingNotif = () =>
        <div className="greyBox">
            <p className="inline">{firstName} {lastName} has sent you a friend request.</p>
            <button onClick = {() => {handleAccept(uid)}}>Accept</button>
            <button onClick = {() => {handleReject(uid)}}>Reject</button>
        </div>

    const FRSent = () => <button onClick={handleFriendRequest}>Friend Request Sent</button>;
    const SendFR = () => <button onClick={handleFriendRequest}>Send Friend Request</button>;

    const handlePostChange = (e) => {
        setPostContent(e.target.value);
    }

    const handlePostContent = () => {
        // if empty post
        if (postContent === "") {
            alert("I said HOW ARE YOU FEELING TODAY?");

        // otherwise
        } else {
            Axios.post('http://localhost:3001/profile/createTextPost', {
            content: postContent
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                console.log(response.data.msg);
            }
        })
        setPostContent("");
        setNetwork(network + 1);
        }
    }

    const handleDeletePost = (deletedPost) => {
        Axios.post('http://localhost:3001/profile/deleteTextPost', {
            deletedPostID: deletedPost
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                console.log(response.data.msg);
            }
        })
        setNetwork(network + 1);
    }

    return (
        <div className="content">
            <div className="greyBox">
                <h2>{firstName} {lastName}</h2>
            </div>

            {/* <h3>This is a user's bio.</h3> */}

            <div className="">
                <button onClick={handleAbout}>About</button>
                {/* <button onClick={handlePhotos}>Photos</button> */}
                <button>Photos</button>
                <button onClick={handleFriends}>Friends</button>
                <br></br>
                {(interactFR || isProfileOwner || isFriend) ? null : isPending ? <FRSent /> : reversePending ? <ReversePendingNotif /> : <SendFR />}
            </div>

            {isProfileOwner ? <div className="greyBox">
                <input className="postInput"
                    type="text"
                    autoComplete="off"
                    id="post"
                    placeholder="How are you feeling today?"
                    value={postContent ? postContent : ""}
                    onChange={handlePostChange}
                />
                <button onClick={handlePostContent}>Post</button>
                </div> : null}

            <div className="posts">
                {(!(posts === undefined)) ? (!(posts.length === 0)) ? posts.map((val, key) => {
                // const { createdAt, content } = val;
                return(
                    <div className="greyBox" key={key}>
                        <Link className="link" to={`/${uuid}`}>
                            {firstName} {lastName}
                        </Link>
                        {!isProfileOwner ? null : <button onClick={() => {handleDeletePost(postIDs[key])}}>X</button>}
                        <div className="postTs">{ts[key]}</div>
                        <div className="postContent">{val}</div>
                    </div>
                )}) :
                    <div className="greyBox">
                        No posts yet
                    </div> : null }
            </div>

        </div>
    )
}

export default Profile;