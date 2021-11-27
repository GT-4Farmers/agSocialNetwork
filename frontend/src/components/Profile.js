import { useState, useEffect, useContext, useRef } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';
import defaultProfilePic from './defaultProfilePic.jpg';

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
  const [postImages, setPostImages] = useState([]);
  const [profilePicture, setProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [ts, setTs] = useState([]);
  const [postIDs, setPostIDs] = useState([]);
  const [images, setImages] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(new Map());

  const [name, setName] = useState("");
  const [friendUuid, setFriendUuid] = useState([]);
  const [friendName, setFriendName] = useState([]);

  const [likeCounts, setLikeCounts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [openDD, setOpenDD] = useState([]);
  const [showEdit, setShowEdit] = useState([]);

  // network state
  const [network, setNetwork] = useState(0);

  // UseEffect that grabs all of the necessary information for the Profile component.
  useEffect(() => {
    // When coming from another person's profile, reset all states
    if (uuid !== uid) {
      setFirstName("");
      setLastName("");
      setPosts([]);
      setTs([]);
      setPostIDs([]);
      setImages([]);
    }
    let temp = {};
    let tempPhotos = [];
    let newTempPhotos = [];

    // Grabs the uuid of the user whose profile is being viewed
    let profileRoute = (window.location.pathname).substring(1)
    var pathArray = profileRoute.split('/');
    profileRoute = (pathArray[0]);

    // Fetches relevent profile data for the profile page being viewed
    //////////////////////////////////////////////////////////////////
    ////////////////////// THIS AXIOS CALL ///////////////////////////
    // HERE IS WHERE profileController.js IS BEING CALLED ////////////
    //////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////
    async function fetchData() {
      const res = await Axios.post("http://localhost:3001/profile", {
        profileRoute: profileRoute
      });
      setUuid(res.data.uuid);
      setEmail(res.data.email);
      setFirstName(res.data.firstName);
      setLastName(res.data.lastName);

      // Fetches the profile picture of the profile being viewed
      const resFour = await Axios.post("http://localhost:3001/profile/about", {
        profileRoute: profileRoute
      })
      setProfilePicture(resFour.data.profilePicture);

      // Fetches the name of the user whose profile is being viewed
      const userNameRes = await Axios.get("http://localhost:3001/profile");
      setName(`${userNameRes.data.firstName} ${userNameRes.data.lastName}`);

      // Fetches all of the friends of the user whose profile is being viewed
      const resThree = await Axios.get("http://localhost:3001/home/friends");
      setFriendUuid(resThree.data.friendUuid);
      setFriendName(resThree.data.friendName);

      // Fetches all of the post information that will be displayed on the user's profile
      const resTwo = await Axios.post("http://localhost:3001/profile/getPosts", {
        profileRoute: profileRoute
      });
      setPosts(resTwo.data.posts);
      setTs(resTwo.data.timestamps);
      setPostIDs(resTwo.data.postIDs);
      setLikeCounts(resTwo.data.likeCounts);
      setLiked(resTwo.data.liked);
      temp = new Map(JSON.parse(resTwo.data.comments));
      setComments(temp);

      // Adjusts images array to account for multiple returns from sql
      tempPhotos = resTwo.data.images;
      let dif = 0;
      for (let p = 0; p < tempPhotos.length; p++) {
        if (p > 0) {
          if (JSON.stringify(tempPhotos[p]) === JSON.stringify((newTempPhotos[p-1-dif]))) {
            dif++;
          } else {
            newTempPhotos[p-dif] = tempPhotos[p];
          }
        } else {
          newTempPhotos[p] = tempPhotos[p];
        }
      }
      setImages(newTempPhotos);
    }

    // Event listener to close dropdown menu when clicking outside
    document.addEventListener('click', handleClickOutside);

    checkButton();
    fetchData();

    return () => {
      // unmount event listener
      document.removeEventListener('click', handleClickOutside);
    };
  }, [profileDummy, network]);

  // Will close dropdown menu when clicking outside of the dropdown menu
  const handleClickOutside = (e) => {
    if (ref.current && !e.target.classList.contains('dropdown')) {
      // close dropdown
      setOpenDD([]);
    }
  };

  // Runs a check to see if the user viewing the profile is friends with user whose
  // profile is being viewed
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

  // Handles sending a friend request to the user whose profile is being viewed
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

  // Handles accepting the friend request from the user whose profile is being viewed
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

  // Handles rejecting the friend request from the user whose profile is being viewed
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

  // Handles displaying friend request information depending on the status of the friend request
  const ReversePendingNotif = () =>
    <div className="greyBox">
      <p className="inline">{firstName} {lastName} has sent you a friend request.</p>
      <button onClick={() => { handleReject(uid) }}>Reject</button>
      <button onClick={() => { handleAccept(uid) }}>Accept</button>
    </div>

  const FRSent = () => <button onClick={handleFriendRequest}>Friend Request Sent</button>;
  const SendFR = () => <button onClick={handleFriendRequest}>Send Friend Request</button>;

  // Takes the inputted text and possible attached images and creates a post with that information
  const handlePostContent = () => {
    if (postContent === "") {
      alert("I said HOW ARE YOU FEELING TODAY?");
    } else {
      async function fetchData() {
        let image_names = ""
        let image_locs = ""
        if (postImages.length > 0) {
          let formData = new FormData();
          // Loops through attached images and uploads each one to S3 image bucket
          for (const image of postImages) formData.append("images", image);
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
        }
        // Makes call to create the post with the content and image information
        //////////////////////////////////////////////////////////////////
        ////////////////////// THIS AXIOS CALL ///////////////////////////
        // HERE IS WHERE createPostController.js IS BEING CALLED /////////
        //////////////////////////////////////////////////////////////////
        //////////////////////////////////////////////////////////////////
        let url = "http://localhost:3001/profile/createPost/"
        const res = await Axios.post(url, {
          content: postContent,
          image_names: image_names,
          image_locs: image_locs
        }).then((response) => {
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

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

  // Handles creating a comment for a post
  const handleCommentContent = (postIDToComment) => {
    if (commentContent === "") {
      alert("Please write a comment!");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/home/createComment"
        const res = await Axios.post(url, {
          postID: postIDToComment,
          content: commentContent,
          isDiscussion: 0
        }).then((response) => {
          return response;
        });
        if (!res.data.success) {
          alert(res.data.msg);
        }
      }
      fetchData();
    }
    setCommentContent("");

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

  // Handles deleting a post
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

  // Updates the like count of a post
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

  // Handles opening the edit dropdown menu for a post
  const handleDropdown = (key) => {
    let newOpenDD = [...openDD];
    newOpenDD[key] = (!newOpenDD[key]);
    setOpenDD(newOpenDD);
  }

  // Handles editing a posts text
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

  // Saves the changes for editing a post
  const handleEdit = (e, key) => {
    let newPosts = [...posts];
    newPosts[key] = e.target.value;
    setPosts(newPosts);
  }

  // Discards the changes made while editing a post
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

  // Runs a check to see if the user is still logged in to Haystack
  if (!isLoggedIn) {
    return (
      <AuthService />
    )
  }

  // JSX code for how the webpage will be rendered
  return (
    // Defines upper portion of profile including users name, profile picture, profile tabs, and posting interface
    <div className="content">
      <div className="profileHeader">
        <img className="profilePic" src={profilePicture ? profilePicture : defaultProfilePic} alt="Could not display image" />
        <div>
          <div className="greyBox"><h2>{firstName} {lastName}</h2></div>
          <div className="row">
            <button onClick={() => history.push(`/${uuid}/about`)}>About</button>
            <button onClick={() => history.push(`/${uuid}/photos`)}>Photos</button>
            <button onClick={() => history.push(`/${uuid}/friends`)}>Friends</button>
            <br></br>
            {(interactFR || isProfileOwner || isFriend) ? null : isPending ? <FRSent /> : reversePending ? <ReversePendingNotif /> : <SendFR />}
          </div>
        </div>
      </div>

      {/* Checks if on logged in users profile or not to determine if posting interface should be displayed */}
      {isProfileOwner ?
      <div className="greyBox">
        <input className="postInput"
          type="text"
          autoComplete="off"
          maxLength="500"
          id="post"
          placeholder="How are you feeling today?"
          value={postContent ? postContent : ""}
          onChange={(e) => { setPostContent(e.target.value) }}
        />

        {/* Image Input of Posting Interface */}
        <div className="imageInput">
          <input 
            type="file"
            accept="image/*"
            multiple="multiple"
            id="post_img"
            onChange={(e) => { setPostImages(e.target.files) }}
          />
        </div>

        {/* Post Button of Posting Interface */}
        <button onClick={handlePostContent}>Post</button>
      </div> : null}

      {/* Loops through all of the fetched posts made by the user and constructs posts from that information */}
      <div className="posts">
        {(!(posts === undefined)) &&
          (!(posts.length === 0)) ?
          posts.map((val, key) => {

            return (
              <div className="greyBox" key={key}>
                <div className="flexContainer">
                  {/* Renders name of the author of post (in the case of profile.js, the profile owner) */}
                  <Link className="postName" to={`/${uuid}`}>
                    {firstName} {lastName}
                  </Link>

                  {/* Renders the edit post dropdown menu if the logged in user's profile is being viewed */}
                  {isProfileOwner &&
                    <div className="dropdownContainer" ref={ref}>
                      {(!(showEdit[key])) &&
                        <button
                          className="dropdown"
                          onClick={() => handleDropdown(key)}>
                          ⋮
                        </button>
                      }

                      {openDD[key] &&
                        <div className="dropdownOptions">
                          <button
                            id="edit"
                            className="dropdownButton"
                            onClick={() => showEditOptions(key)}>
                            Edit
                          </button>
                          <button
                            id="delete"
                            className="dropdownButton"
                            onClick={() => handleDeletePost(postIDs[key])}>
                            Delete
                          </button>
                        </div>
                      }
                    </div>
                  }
                </div>

                {/* Renders the timestamp of each post */}
                <div className="postTs">{ts[key]}</div>

                {/* Renders the text content of the post */}
                <div className="postContent">
                  {(!(showEdit[key])) && val}
                  {showEdit[key] && isProfileOwner &&
                    <input
                      type="text"
                      id="content"
                      autoComplete="off"
                      value={val ? val : ""}
                      onChange={(e) => handleEdit(e, key)}
                    />
                  }

                  {/* Edit post menu for users editing their own profiles posts */}
                  <div>
                    {showEdit[key] && isProfileOwner &&
                      <button
                        onClick={() => { handleEditPost(postIDs[key], posts[key], key) }}>
                        Save Changes
                      </button>}
                    {showEdit[key] && isProfileOwner &&
                      <button onClick={() => { handleDiscardChanges(key) }}>
                        Discard Changes
                      </button>}
                  </div>    

                  {/* Renders Image(s) of the post */}
                  {images[key] &&
                    <div className="postImage">
                      {images[key].map((x) => {return(<img src={x} key={key} alt="Could not display image"/>)})}
                    </div>
                  }
                </div>

                {/* Renders the like count as well as the like tractor graphic for each post */}
                <div className="likes">
                  {likeCounts === undefined ? null :
                    <button
                      className="tractor"
                      onClick={() => { updateLikeCount(postIDs[key], uuid) }}>
                      <FaTractor color={liked[key]} />
                    </button>}
                  {likeCounts[key]}
                </div>

                {/* Loops through all of the comments for each post and maps relevent information to each comment */}
                <div className="comments">
                    {!comments.has(postIDs[key]) ? null :
                      comments.get(postIDs[key]).map((val, key => {

                        return (
                          <div className="postContent">

                            {/* Renders the name of the author for each comment */}
                            <Link className="link" to={`/${key.cCreatedBy}` } onClick={() => {setProfileDummy(profileDummy+1)}}>
                              {friendName[friendUuid.indexOf(key.cCreatedBy)] ?
                              friendName[friendUuid.indexOf(key.cCreatedBy)] : name}
                            </Link>

                            {/* Renders the timestamp of each comment */}
                            <div className="commentTs"> {key.cCreatedAt} </div>

                            {/* Renders the text content of each comment */}
                            <div className="commentContent"> {key.cContent}</div>
                          </div>
                        )
                      }))
                    }
                  </div>
                <div>
                  {/* Renders the commenting input interface for each post */}
                  <input className="commentInput"
                    type="text"
                    autoComplete="off"
                    maxLength="500"
                    id="comment"
                    placeholder="Write a comment."
                    value={commentContent ? commentContent : ""}
                    onChange={(e) => { setCommentContent(e.target.value) }}
                  />
                  <button onClick={() => handleCommentContent(postIDs[key])}>Comment</button>
                </div>
              </div>
            )
          }) :
          // If no posts have been made by the user yet, display "No posts yet"
          <div className="greyBox">
            No posts yet
          </div>
        }
      </div>

    </div>
  )
}

export default Profile;