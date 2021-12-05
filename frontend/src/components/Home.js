import { useEffect, useState, useContext, useRef } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';
import defaultProfilePic from './defaultProfilePic.jpg';

function Home() {
  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { profileDummy, setProfileDummy } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const ref = useRef(null);

  const [name, setName] = useState("");
  const [friendUuid, setFriendUuid] = useState([]);
  const [friendName, setFriendName] = useState([]);

  // post states
  const [posts, setPosts] = useState([]);
  const [ts, setTs] = useState([]);
  const [images, setImages] = useState([]);
  const [postIDs, setPostIDs] = useState([]);
  const [authors, setAuthors] = useState([]);
  // const [likers, setLikers] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [openDD, setOpenDD] = useState([]);
  const [showEdit, setShowEdit] = useState([]);
  const [commentContent, setCommentContent] = useState([]);
  const [comments, setComments] = useState(new Map());
  const [profilePictures, setProfilePictures] = useState([]);

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    let temp = {};
    let tempPhotos = [];
    let newTempPhotos = [];
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/login");
      setName(`${res.data.firstName} ${res.data.lastName}`);

      const resTwo = await Axios.get("http://localhost:3001/home/friends");
      setFriendUuid(resTwo.data.friendUuid);
      setFriendName(resTwo.data.friendName);

      const resThree = await Axios.post("http://localhost:3001/home", {
        friendUuid: resTwo.data.friendUuid
      });
      setAuthors(resThree.data.authors);
      setPosts(resThree.data.posts);
      setTs(resThree.data.timestamps);
      setPostIDs(resThree.data.postIDs);
      setLikeCounts(resThree.data.likeCounts);
      setLiked(resThree.data.liked);
      temp = new Map(JSON.parse(resThree.data.comments));
      setComments(temp);
      setProfilePictures(resThree.data.profilePictures);

      tempPhotos = resThree.data.images;
      setImages(tempPhotos);
      
      // const profPicRes = await Axios.post("http://localhost:3001/home/getProfilePictures", {
      //   friendUuid = resTwo.data.friendUuid
      // });
      // setProfilePictures(profPicRes.data.pics);
    }
    fetchData();

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [network]);

  const handleClickOutside = (e) => {
    if (ref.current && !e.target.classList.contains('dropdown')) {
      // close dropdown
      setOpenDD([]);
    }
  };

  const handleCommentContent = (postIDToComment, key) => {
    // will users be allowed to post image without text?
    if (commentContent[key] === "") {
      alert("Please write a comment!");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/home/createComment"
        const res = await Axios.post(url, {
          postID: postIDToComment,
          content: commentContent[key],
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
    setCommentContent([]);

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

  const handleComment = (content, key) => {
    let newComment = [...commentContent];
    newComment[key] = content;
    setCommentContent(newComment);
  }

  const handleDeletePost = (deletedPost) => {
    async function fetchData() {
      const res = await Axios.post('http://localhost:3001/profile/deleteTextPost', {
        deletedPostID: deletedPost
      });
      if (!res.data.success) {
        alert(res.data.msg);
      }
    }
    fetchData();

    setShowEdit([]);
    setOpenDD([]);

    // rerender
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
      setNetwork(network + 1);
    }
    fetchData();

    showEditOptions(key);
    setOpenDD([]);
    setNetwork(network + 1);
  }

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
      const res = await Axios.post("http://localhost:3001/home", {
        friendUuid: friendUuid
      });
      setPosts(res.data.posts);
    }
    fetchData();

    showEditOptions(key);
    setOpenDD([]);
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
    <>
      <div className="content">
        <h2>Home</h2>
        <div className="posts">
          {(!(posts === undefined)) ?
            ((!(friendName === undefined))) ?
              posts.map((val, key) => {

                return (
                  <div className="greyBox" key={key}>
                   
                    <div className="flexContainer">

                      {/* Show author of each post */}
                      <div className="rowCenteredLeft">
                        <img className="profilePicPost" src={profilePictures[key] ? profilePictures[key] : defaultProfilePic} alt="Could not display image" />
                        <Link className="postName" to={`/${authors[key]}`}>
                          {friendName[friendUuid.indexOf(authors[key])] ?
                            friendName[friendUuid.indexOf(authors[key])] : name}
                        </Link>
                      </div>

                      {/* Show Dropdown if owner of post */}
                      {(!friendName[friendUuid.indexOf(authors[key])]) &&
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
                    

                    <div className="postTs"> {ts[key]} </div>

                    <div className="postContent">
                      {(!(showEdit[key])) && val}

                      {showEdit[key] && (!friendName[friendUuid.indexOf(authors[key])]) &&
                        <input
                          type="text"
                          id="content"
                          maxLength="500"
                          autoComplete="off"
                          value={val ? val : ""}
                          onChange={(e) => handleEdit(e, key)}
                        />
                      }

                    <div>
                      {showEdit[key] && (!friendName[friendUuid.indexOf(authors[key])]) &&
                        <button
                          onClick={() => { handleEditPost(postIDs[key], posts[key], key) }}>
                          Save Changes
                        </button>
                      }

                      {showEdit[key] && (!friendName[friendUuid.indexOf(authors[key])]) &&
                        <button
                          onClick={() => { handleDiscardChanges(key) }}>
                          Discard Changes
                        </button>}
                    </div>

                    {images[key] ?
                      <div className="postImage">
                        {images[key].map((x) => {return(<img src={x} key={key} alt="Could not display image"/>)})}
                      </div> : null
                    }
                    </div>

                    <div className="likes">
                      {likeCounts === undefined ? null :
                        <button
                          className="tractor"
                          onClick={() => { updateLikeCount(postIDs[key], authors[key]) }}>
                          <FaTractor color={liked[key]} />
                        </button>}
                      {likeCounts[key]}
                    </div>


                    <div className="comments">
                      {!comments.has(postIDs[key]) ? null :
                        comments.get(postIDs[key]).map((val, key => {

                          return (
                            <div className="postContent">
                              <Link className="link" to={`/${key.cCreatedBy}`}>
                                {friendName[friendUuid.indexOf(key.cCreatedBy)] ?
                                friendName[friendUuid.indexOf(key.cCreatedBy)] : name}
                              </Link>
                              {/* {(!friendName[friendUuid.indexOf(key.cCreatedBy)]) &&
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
                              } */}
                              <div className="commentTs"> {key.cCreatedAt} </div>
                              {/* <div className="postContent">
                                {(!(showEdit[key])) && val}

                                {showEdit[key] && (!friendName[friendUuid.indexOf(key.cCreatedBy)]) &&
                                  <input
                                    type="text"
                                    id="content"
                                    autoComplete="off"
                                    value={val ? val : ""}
                                    onChange={(e) => handleEdit(e, key)}
                                  />
                                }
                              </div>

                              <div>
                                {showEdit[key] && (!friendName[friendUuid.indexOf(key.cCreatedBy)]) &&
                                  <button
                                    onClick={() => { handleEditPost(postIDs[key], posts[key], key) }}>
                                    Save Changes
                                  </button>
                                }

                                {showEdit[key] && (!friendName[friendUuid.indexOf(key.cCreatedBy)]) &&
                                  <button
                                    onClick={() => { handleDiscardChanges(key) }}>
                                    Discard Changes
                                  </button>}
                              </div> */}
                              <div className="commentContent"> {key.cContent}</div>
                            </div>
                          )
                        }))
                      }
                    </div>
                    <div>
                      <input className="commentInput"
                        type="text"
                        autoComplete="off"
                        maxLength="500"
                        id="comment"
                        placeholder="Write a comment."
                        value={commentContent[key] ? commentContent[key] : ""}
                        onChange={(e) => handleComment(e.target.value, key)}
                      />
                      <button onClick={() => handleCommentContent(postIDs[key], key)}>Comment</button>
                    </div>

                  </div>
                )
              }) :
              <div className="greyBox">
                No posts yet
              </div> : null}
        </div>
      </div>
    </>
  )
}

export default Home