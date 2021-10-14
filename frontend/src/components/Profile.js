import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';

function Profile() {
    // login, routing, user states
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const { profileDummy, setProfileDummy } = useContext(AuthContext);
    const { user, setUser } = useContext(AuthContext);
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
    const [likers, setLikers] = useState([]);
    const [counts, setCounts] = useState([]);

    // network state
    const [network, setNetwork] = useState(0);

    useEffect(() => {
        if (uuid !== uid) {
            setFirstName("");
            setLastName("");
            setPosts([]);
            setTs([]);
            setPostIDs([]);
        }

        let profileRoute = (window.location.pathname).substring(1)
        var pathArray = profileRoute.split('/');
        profileRoute = (pathArray[0]);

        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile", {
                profileRoute: profileRoute
            })
            setUuid(res.data.uuid);
            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
        
            const resTwo = await Axios.post("http://localhost:3001/profile/getTextPosts", {
                profileRoute: profileRoute
            })
            setPosts(resTwo.data.posts);
            setTs(resTwo.data.timestamps);
            setPostIDs(resTwo.data.postIDs);

            let lArray = [];
            let countArray = [];
            for (const p in resTwo.data.postIDs) {
                let resFour = await Axios.post("http://localhost:3001/home/likes/getLikes", {
                    postID: resTwo.data.postIDs[p]
                });
                lArray.push(resFour.data.likers);
                countArray.push(resFour.data.count);
            }
            setLikers(lArray);
            setCounts(countArray);
        }
        checkButton();
        fetchData();
    }, [profileDummy, network]);

    const checkButton = () => {
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
                profileRoute: profileRoute
            })
            setIsFriend(res.data.isFriend);
            setIsProfileOwner(res.data.isUser);
            setIsPending(res.data.isPending);
            setReversePending(res.data.reversePending);
        }
        fetchData();
    }

    const handleFriendRequest = () => {
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/friends/friendRequest", {
                profileRoute: uid,
                mode: 'request'
            })
            setIsPending(true);
        }
        fetchData();
    }


    const handleAccept = (route) => {
        async function fetchData() {
            const res = Axios.post("http://localhost:3001/profile/friends/friendRequest", {
                profileRoute: route,
                mode: 'accept'
            })
            setInteractFR(true);
        }
        fetchData();
    }

    const handleReject = (route) => {
        async function fetchData() {
            const res = Axios.post("http://localhost:3001/profile/friends/friendRequest", {
                profileRoute: route,
                mode: 'reject'
            })
            setInteractFR(true);
        }
        fetchData();
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
            async function fetchData() {
                const res = await Axios.post('http://localhost:3001/profile/createTextPost', {
                    content: postContent
                })
                if (!res.data.success) {
                    alert(res.data.msg);
                }
            }
            fetchData();
        }
        setPostContent("");
        setNetwork(network + 1);
    }

    const handleDeletePost = (deletedPost) => {
        async function fetchData() {
            const res = await Axios.post('http://localhost:3001/profile/deleteTextPost', {
                deletedPostID: deletedPost
            })
            if (!res.data.success) {
                alert(res.data.msg);
            }
            setNetwork(network + 1);
        }
        fetchData();
    }

    const handleLike = (likePID) => {
        async function fetchData() {
            const res = await Axios.post('http://localhost:3001/home/likes', {
                postID: likePID,
                uuid: user,
                mode: "like"
            });
        }
        fetchData();
        setNetwork(network + 1);
      }
    
    const handleDislike = (dislikePID) => {
        async function fetchData() {
            const res = await Axios.post('http://localhost:3001/home/likes', {
                postID: dislikePID,
                uuid: user,
                mode: "dislike"
            });
        }
        fetchData();
        setNetwork(network + 1);
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
                        {/* <div className="likes">
                            {likers[0] === undefined ? null : <button className="tractor" onClick={() => {!likers[key].includes(user) ? handleLike(postIDs[key]) : handleDislike(postIDs[key])}}>{ likers[key].includes(user) ? <FaTractor color="green"/> : <FaTractor />}</button>} {counts[key]}
                        </div> */}
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