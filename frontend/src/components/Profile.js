import { useState, useEffect, useContext, useRef } from 'react';
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
    const ref = useRef(null);

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
    const [postImage, setPostImage] = useState('')
    const [posts, setPosts] = useState([]);
    const [ts, setTs] = useState([]);
    const [postIDs, setPostIDs] = useState([]);
    const [images, setImages] = useState([]);

    const [likeCounts, setLikeCounts] = useState([]);
    const [liked, setLiked] = useState([]);
    const [openDD, setOpenDD] = useState([]);
    const [showEdit, setShowEdit] = useState([]);

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
            
            // setDropdown(dropdown.from({length: resTwo.data.posts.length}, (v, i) => i));

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
        document.addEventListener('click', handleClickOutside);

        checkButton();
        fetchData();

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [profileDummy, network]);

    const handleClickOutside = (e) => {
        // console.log(e.target.classList);
        if (ref.current && !e.target.classList.contains('dropdown')) {
            // close dropdown
            setOpenDD([]);
        }
    };

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
                let image_name = ""
                let image_loc = ""
                console.log(postImage)
                if (postImage) {
                    let formData = new FormData();
                    formData.append("image", postImage);
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
                        image_name = res.data.image_name
                        image_loc = res.data.image_loc
                    }
                    // console.log(res)
                }
                let url = "http://localhost:3001/profile/createPost/"
                const res = await Axios.post(url, {
                    content: postContent,
                    image_name: image_name,
                    image_loc: image_loc
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
        setPostImage("")

        // prevents keys getting mixed if posting while editing
        setShowEdit([]);
        setOpenDD([]);

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
        }
        fetchData();

        setShowEdit([]);
        setOpenDD([]);

        setNetwork(network + 1);
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

    const handleDropdown = (key) => {
        let newOpenDD = [...openDD];
        newOpenDD[key] = (!newOpenDD[key]);
        setOpenDD(newOpenDD);
    }

    const handleEditPost = (editedPost, content, key) => {
        async function fetchData() {
            const res = await Axios.put('http://localhost:3001/profile/editTextPost', {
                editedPostID: editedPost,
                content: content
            })
            if (!res.data.success) {
                alert(res.data.msg);
            }
        }
        fetchData();
        
        showEditOptions(key);
        setOpenDD([]);
        setNetwork(network + 1);
    }

    // after clicking on Edit
    const showEditOptions = (key) => {
        let newShowEdit = [...showEdit];
        newShowEdit[key] = (!newShowEdit[key]);
        setShowEdit(newShowEdit);
        handleDropdown(key);
    }

    const handleEdit = (e, key) => {
        let newPosts = [...posts];
        newPosts[key] = e.target.value;
        setPosts(newPosts);
    }

    const handleDiscardChanges = (key) => {
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/getTextPosts", {
                profileRoute: profileRoute
            });
            setPosts(res.data.posts);
        }
        fetchData();

        showEditOptions(key);
        setOpenDD([]);
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
                    placeholder="Upload Image"
                    onChange={(e) => {setPostImage(e.target.files[0])}}
                />
                <button onClick={handlePostContent}>Post</button>
                </div> : null}

            <div className="posts">
                {(!(posts === undefined)) && (!(posts.length === 0)) ? posts.map((val, key) => {
                // const { createdAt, content } = val;
                return(
                    <div className="greyBox" key={key}>
                        <Link className="link" to={`/${uuid}`}>
                            {firstName} {lastName}
                        </Link>

                        {isProfileOwner &&
                        <div className="dropdownContainer" ref={ref}>
                            {(!(showEdit[key])) && <button className="dropdown" onClick={() => handleDropdown(key)}>⋮</button>}
                            {openDD[key] && <div className="dropdownOptions">
                                <button id="edit" className="dropdownButton" onClick={() => showEditOptions(key)}>Edit</button>
                                <button id="delete" className="dropdownButton" onClick={() => handleDeletePost(postIDs[key])}>Delete</button>
                            </div>}
                        </div>}
                        
                        <div className="postTs">{ts[key]}</div>
                        <div className="postContent">
                            {(!(showEdit[key])) && val}
                            {showEdit[key] && isProfileOwner && <input
                                type="text"
                                id="content"
                                autoComplete="off"
                                value={val ? val : ""}
                                onChange={(e) => handleEdit(e, key)}
                                />}
                        </div>
                        <div>
                            {showEdit[key] && isProfileOwner && <button onClick={() => {handleEditPost(postIDs[key], posts[key], key)}}>Save Changes</button>}
                            {showEdit[key] && isProfileOwner && <button onClick={() => {handleDiscardChanges(key)}}>Discard Changes</button>}
                        </div>
                        {images[key] ? 
                        <div className="postImage">
                            <img src={images[key]} alt="Could not display image"/>
                        </div>
                        : null}


                        <div className="likes">
                            {likeCounts === undefined ? null : <button className="tractor" onClick={() => {updateLikeCount(postIDs[key], uuid)}}><FaTractor color={liked[key]}/></button>} {likeCounts[key]}
                        </div>
                    </div>
                )}) :
                    <div className="greyBox">
                        No posts yet
                    </div>}
            </div>

        </div>
    )
}

export default Profile;