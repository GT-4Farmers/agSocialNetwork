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

        Axios.post("/profile", {
            profileRoute: profileRoute
        }).then(res => {
            setUuid(res.data.uuid);
            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
        })
        checkButton();

        return () => {
            setUuid("");
            setEmail("");
            setFirstName("");
            setLastName("");
            setIsFriend(false);
            setIsProfileOwner(false);
            setIsPending('');
            setReversePending('');
        }
    }, []);

    useEffect(() => {
        Axios.post("/profile/getTextPosts", {
            profileRoute: profileRoute
        }).then(resTwo => {
            setPosts(resTwo.data.posts);
            setTs(resTwo.data.timestamps);
            setPostIDs(resTwo.data.postIDs);
        })

        // unmount cleanup
        return () => {
            setPosts([]);
            setTs([]);
            setPostIDs([]);
        }
    }, [profileDummy, network]);

    const checkButton = () => {
        Axios.post("/profile/uuidIsUserOrFriend", {
            profileRoute: profileRoute
        }).then(res => {
            setIsFriend(res.data.isFriend);
            setIsProfileOwner(res.data.isUser);
            setIsPending(res.data.isPending);
            setReversePending(res.data.reversePending);
        });
    }

    const handleFriendRequest = () => {
        Axios.post("/profile/friends/friendRequest", {
            profileRoute: uid,
            mode: 'request'
        }).then(res => {
            setIsPending(true);
        });
    }


    const handleAccept = (route) => {
        Axios.post("/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'accept'
        }).then(res => {
            setInteractFR(true);
        })
    }

    const handleReject = (route) => {
        Axios.post("/profile/friends/friendRequest", {
            profileRoute: route,
            mode: 'reject'
        }).then(res => {
            setInteractFR(true);
        })
    }

    const ReversePendingNotif = () =>
        <div className="greyBox">
            <p className="inline">{firstName} {lastName} has sent you a friend request.</p>
            <button onClick = {() => {handleReject(uid)}}>Reject</button>
            <button onClick = {() => {handleAccept(uid)}}>Accept</button>
        </div>

    const FRSent = () => <button onClick={handleFriendRequest}>Friend Request Sent</button>;
    const SendFR = () => <button onClick={handleFriendRequest}>Send Friend Request</button>;

    const handlePostContent = () => {
        if (postContent === "") {
            alert("I said HOW ARE YOU FEELING TODAY?");
        } else {
            Axios.post('/profile/createTextPost', {
                content: postContent
            }).then(res => {
                if (!res.data.success) {
                    alert(res.data.msg);
                }
            })
        }
        setPostContent("");
        setNetwork(network + 1);
    }

    const handleDeletePost = (deletedPost) => {
        Axios.post('/profile/deleteTextPost', {
            deletedPostID: deletedPost
        }).then(res => {
            if (!res.data.success) {
                alert(res.data.msg);
            }
            setNetwork(network + 1);
        })
    }

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return (
        <div className="content">
            <div className="greyBox">
                <h2>{firstName} {lastName}</h2>
            </div>

            {/* <h3>This is a user's bio.</h3> */}

            <div className="">
                <button onClick={() => history.push(`/${uuid}/about`)}>About</button>
                {/* <button onClick={handlePhotos}>Photos</button> */}
                <button>Photos</button>
                <button onClick={() => history.push(`/${uuid}/friends`)}>Friends</button>
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
                    onChange={(e) => {setPostContent(e.target.value)}}
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