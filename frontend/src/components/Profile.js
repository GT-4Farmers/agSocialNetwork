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
    const [postImages, setPostImages] = useState([])
    const [posts, setPosts] = useState([]);
    const [ts, setTs] = useState([]);
    const [postIDs, setPostIDs] = useState([]);
    const [images, setImages] = useState([]);

    const [likeCounts, setLikeCounts] = useState([]);
    const [liked, setLiked] = useState([]);

    // network state
    const [network, setNetwork] = useState(0);

    useEffect(() => {
        if (uuid !== uid) {
            setFirstName("");
            setLastName("");
            setPosts([]);
            setTs([]);
            setPostIDs([]);
            setImages([]);
        }

        let profileRoute = (window.location.pathname).substring(1)
        var pathArray = profileRoute.split('/');
        profileRoute = (pathArray[0]);

        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile", {
                profileRoute: profileRoute
            });
            setUuid(res.data.uuid);
            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
        
            const resTwo = await Axios.post("http://localhost:3001/profile/getPosts", {
                profileRoute: profileRoute
            });
            setPosts(resTwo.data.posts);
            setTs(resTwo.data.timestamps);
            setPostIDs(resTwo.data.postIDs);
            setImages(resTwo.data.images);
            setLikeCounts(resTwo.data.likeCounts);
            setLiked(resTwo.data.liked);

            console.log(resTwo.data.liked);
            console.log(resTwo.data.images)

            // let lArray = [];
            // let countArray = [];
            // for (const p in resTwo.data.postIDs) {
            //     let resFour = await Axios.post("http://localhost:3001/home/likes/getLikes", {
            //         postID: resTwo.data.postIDs[p]
            //     });
            //     lArray.push(resFour.data.likers);
            //     countArray.push(resFour.data.count);
            // }
            // setLikers(lArray);
            // setCounts(countArray);

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
                let image_names = []
                let image_locs = []
                console.log(postImages)
                if (postImages.length > 0) {
                    let formData = new FormData();
                    for (const image of postImages) formData.append("images", image);
                    console.log(formData)
                    let url = "http://localhost:3001/profile/imageUpload/"
                    const res = await Axios.post(url, formData, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    }).then((response) => {
                        return response;
                        });
                    if (!res.data.success) {
                        alert(res.data.msg);
                    } else {
                        image_names = res.data.image_names
                        image_locs = res.data.image_locs
                    }
                    console.log(res)
                }
                let url = "http://localhost:3001/profile/createPost/"
                const res = await Axios.post(url, {
                    content: postContent,
                    image_names: image_names,
                    image_locs: image_locs
                }).then((response) => {
                    console.log(response)
                    return response;
                    });
                if (!res.data.success) {
                    alert(res.data.msg);
                }
            }
            fetchData();
             
        }
        setPostContent("");
        setPostImages([])
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

    const updateLikeCount = (postID, postOwner) => {
        async function fetchData() {
            const res = await Axios.post('http://localhost:3001/home/updateLikeCount', {
            postID: postID,
            postOwner: postOwner
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
                <input className="imageInput"
                    type="file"
                    accept="image/*"
                    id="post_img"
                    multiple="multiple"
                    placeholder="Upload Image"
                    onChange={(e) => {setPostImages(e.target.files)}}
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
                        {images[key] ? 
                        <div className="postImage">
                            {images[key].map((x) => {return(<img src={x} key={key} alt="Could not display image"/>)})}
                        </div>
                        : null}
                        <div className="likes">
                            {likeCounts === undefined ? null : <button className="tractor" onClick={() => {updateLikeCount(postIDs[key], uuid)}}><FaTractor color={liked[key]}/></button>} {likeCounts[key]}
                        </div>
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