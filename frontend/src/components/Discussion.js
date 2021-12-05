import { useEffect, useState, useContext, useRef } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';

function Discussion() {
  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { profileDummy, setProfileDummy } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const ref = useRef(null);

  const [name, setName] = useState("");

  // post states
  const [posts, setPosts] = useState([]);
  const [ts, setTs] = useState([]);
  const [postIDs, setPostIDs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorNames, setAuthorNames] = useState([]);
  // const [likers, setLikers] = useState([]);
  const [likeCounts, setLikeCounts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [openDD, setOpenDD] = useState([]);
  const [showEdit, setShowEdit] = useState([]);
  const [postContent, setPostContent] = useState('');
  const [commentContent, setCommentContent] = useState([]);
  const [commentNames, setCommentNames] = useState(new Map());
  const [comments, setComments] = useState(new Map());
  const [title, setTitle] = useState('');
  const [mainAuthor, setMainAuthor] = useState('');
  const [mainAuthorRoute, setMainAuthorRoute] = useState('');
  const [mainTime, setMainTime] = useState(null);

  let discussionRoute = (window.location.pathname).substring(1)
  var pathArray = discussionRoute.split('/');
  discussionRoute = (pathArray[1]);

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    let temp = {};
    let temp3 = {};
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/login");
      setName(`${res.data.firstName} ${res.data.lastName}`);

      const resThree = await Axios.post("http://localhost:3001/forums/getDiscussionPage", {
        discussionID: discussionRoute
      });
      setAuthors(resThree.data.authors);
      setAuthorNames(resThree.data.authorNames);
      setPosts(resThree.data.posts);
      setTs(resThree.data.timestamps);
      setPostIDs(resThree.data.postIDs);
      setLikeCounts(resThree.data.likeCounts);
      setLiked(resThree.data.liked);
      temp = new Map(JSON.parse(resThree.data.comments));
      setComments(temp);
      setTitle(resThree.data.dContent);
      setMainAuthor(resThree.data.dCreatedBy);
      setMainAuthorRoute(resThree.data.dCreatedByRoute);
      setMainTime(resThree.data.dCreatedAt);


      const resNames = await Axios.post("http://localhost:3001/forums/getNames", {
        profileRoute: resThree.data.cAuthors
      });
      temp3 = new Map(JSON.parse(resNames.data.nameMap));
      setCommentNames(temp3);
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

  const handlePostContent = () => {
    // will users be allowed to post image without text?
    if (postContent === "") {
      alert("Please fill in what you would like to post.");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/forums/createPost"
        const res = await Axios.post(url, {
          content: postContent,
          discussionID: discussionRoute
        }).then((response) => {
          // console.log(response)
          return response;
        });
        if (!res.data.success) {
          alert(res.data.msg);
        }
      }
      fetchData();
      setPostContent("");
    }

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

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
          isDiscussion: 1
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

  //TODO: CHANGE FOR DISCUSSION USE
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
      const res = await Axios.post("http://localhost:3001/forums/getDiscussionPage", {
        discussionID: discussionRoute
      });
      setPosts(res.data.posts);
    }
    fetchData();

    showEditOptions(key);
    setOpenDD([]);
  }

  // CHANGE FOR FORUM PURPOSES
  const updateLikeCount = (postID, postOwner) => {
    async function fetchData() {
      const res = await Axios.post('http://localhost:3001/forums/updateLikeCount', {
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
        <h2>{title}</h2>
        <p className="inline">Created by </p>
          <Link npclassName="link" to={`/${mainAuthorRoute}`}>
            {mainAuthor}
          </Link>
        <div className="postTs">{mainTime}</div>

        <div className="greyBox">
          <input className="postInput"
            type="text"
            autoComplete="off"
            maxLength="500"
            id="post"
            placeholder="What do you want to talk about?"
            value={postContent ? postContent : ""}
            onChange={(e) => { setPostContent(e.target.value) }}
          />

          <button onClick={handlePostContent}>Post</button>
        </div>

        <div className="posts">
          {(!(posts.length == 0)) ?
              posts.map((val, key) => {

                return (
                  <div className="greyBox" key={key}>

                    {/* Show author of each post */}
                    <Link className="link" to={`/${authors[key]}`}>
                      {authorNames[key]}
                    </Link>

                    {/* Show Dropdown if owner of post */}
                    {/* {(!friendName[friendUuid.indexOf(authors[key])]) &&
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

                    <div className="postTs"> {ts[key]} </div>

                    <div className="postContent">
                      {val}
                    </div>

                    {/* <div className="postContent">
                      {(!(showEdit[key])) && val}

                      {showEdit[key] && (!friendName[friendUuid.indexOf(authors[key])]) &&
                        <input
                          type="text"
                          id="content"
                          autoComplete="off"
                          value={val ? val : ""}
                          onChange={(e) => handleEdit(e, key)}
                        />
                      }
                    </div> */}

                    {/* <div>
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
                    </div> */}

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
                          let route = key.cCreatedBy
                          // key.cCreatedBy = commentAuthors[i][j];
                          return (
                            <div className="postContent">
                              <Link className="link" to={`/${route}`}>
                                {commentNames.get(route)}
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
              </div>}
        </div>
      </div>
    </>
  )
}

export default Discussion