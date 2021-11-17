import { useEffect, useState, useContext, useRef } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';

function Forums() {
  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { profileDummy, setProfileDummy } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const { tags, setTags } = useContext(AuthContext);
  const ref = useRef(null);

  const [name, setName] = useState("");
  const [friendUuid, setFriendUuid] = useState([]);
  const [friendName, setFriendName] = useState([]);

  // States for tags and tag popups
  const [displayedTags, setDisplayedTags] = useState([]);
  const [tagFilter, setTagFilter] = useState(null);
  const [filterArray, setFilterArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [tagFilterPost, setTagFilterPost] = useState(null);
  const [filterArrayPost, setFilterArrayPost] = useState([]);

  // post states
  const [postContent, setPostContent] = useState('');
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
  const [commentContent, setCommentContent] = useState('');
  const [comments, setComments] = useState(new Map());

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    let temp = {};
    let tempPhotos = [];
    let newTempPhotos = [];
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/login");
      setName(`${res.data.firstName} ${res.data.lastName}`);

      const tagRes = await Axios.post("http://localhost:3001/forums/getTags", {
        filter: tagFilter
      });
      setDisplayedTags(tagRes.data.tags);

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

      tempPhotos = resThree.data.images;
      let dif = 0;
      for (let p = 0; p < tempPhotos.length; p++) {
        if (p > 0) {
          if (tempPhotos[p] === newTempPhotos[p-1-dif]) {
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
    console.log("tagFilter: ", tagFilter);
    console.log("filterArray: ", filterArray);
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

  const handleCommentContent = (postIDToComment) => {
    // will users be allowed to post image without text?
    if (commentContent === "") {
      alert("Please write a comment!");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/home/createComment"
        const res = await Axios.post(url, {
          postID: postIDToComment,
          content: commentContent
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
  
  // Popup for sorting
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }

  const Popup = props => {
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </div>
      </div>
    );
  };

  // Popup for creating discussion
  const togglePopupPost = () => {
    setIsOpenPost(!isOpenPost);
  }

  const PopupPost = props => {
    return (
      <div className="popup-box">
        <div className="box">
          <span className="close-icon" onClick={props.handleClose}>x</span>
          {props.content}
        </div>
      </div>
    );
  };

  // Toggle tags for sorting
  const toggleTag = (tagValue) => {
    console.log("tagValue: ", tagValue);
    if (filterArray.includes(tagValue)) {
      let index = filterArray.indexOf(tagValue);
      filterArray.splice(index, 1);
    } else {
      filterArray.push(tagValue);
    }
    console.log("tagFilter in tag function: ", tagFilter);
  }

  // Update tag filter for sorting
  const updateFilter = () => {
    console.log("updating")
    setTagFilter(filterArray);
    setNetwork(network + 1);
  }

  // Clear filter for sorting
  const clearFilter = () => {
    console.log("clearing");
    setFilterArray([]);
  }

  // Toggle tags for creating discussion
  const toggleTagPost = (tagValuePost) => {
    console.log("tagValue: ", tagValuePost);
    if (filterArrayPost.includes(tagValuePost)) {
      let index = filterArrayPost.indexOf(tagValuePost);
      filterArrayPost.splice(index, 1);
    } else {
      filterArrayPost.push(tagValuePost);
    }
    console.log("tagFilter in tag function: ", tagFilterPost);
  }

  // Update tag filter for creating discussion
  const updateFilterPost = () => {
    console.log("updating")
    setTagFilterPost(filterArrayPost);
    setNetwork(network + 1);
  }

  const handlePostContent = () => {
    // will users be allowed to post image without text?
    if (postContent === "") {
      alert("Please title what you want to discuss.");
    } else if (!tagFilterPost) {
      alert("Please select at least one tag.");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/forums/createDiscussion"
        const res = await Axios.post(url, {
          content: postContent,
          tags: tagFilterPost
        }).then((response) => {
          // console.log(response)
          return response;
        });
        if (!res.data.success) {
          alert(res.data.msg);
        }
      }
      fetchData();
    }
    setPostContent("");
    setFilterArrayPost([]);
    setTagFilterPost(null);

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

  return (
    <>
      <div className="content">
        <h2>Forums</h2>
        <p>Forum posts displayed here.</p>

        <button onClick={togglePopup}>Sort Discussions By Tag</button>

        {isOpen && <Popup
          content={<>
          <div className="tags">
            <p>Select tags to sort by:</p>
            {tags.map((val, key) => {
              return (
                <button className="tagButton" key={key} onClick={() => toggleTag(val)}>
                  {val}
                </button>
              )
            })}
          </div>
          <div className="greyBox">
            <button onClick = {() => updateFilter()}>
              Confirm
            </button>
            <button onClick = {() => clearFilter()}>
              Clear Filter
            </button>
          </div>
          </>}
          handleClose={togglePopup}
        />}

        {tagFilter && tagFilter.length > 0 ?
          <div className="greyBox">
            <p>
              Filtering by: {tagFilter.map((val, key) => {
                return (
                  <h3 className="inline-flex">{val}</h3>
                )
              })}
            </p>
          </div> :
        null}

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

          {/* JSX for popups for discussion creation */}
          {isOpenPost && <PopupPost
            content={<>
            <div className="tags">
              <p>Please select up to three tags:</p>
              {tags.map((val, key) => {
                return (
                  <button className="tagButton" key={key} onClick={() => toggleTagPost(val)}>
                    {val}
                  </button>
                )
              })}
            </div>
            <div className="greyBox">
              <button onClick = {() => updateFilterPost()}>
                Confirm
              </button>
            </div>
            </>}
            handleClose={togglePopupPost}
          />}

          {tagFilterPost && tagFilterPost.length > 0 ?
            <div className="greyBox">
              <p>
                {tagFilterPost.map((val, key) => {
                  return (
                    <h3 className="inline-flex">{val}</h3>
                  )
                })}
              </p>
            </div> :
          null}

          <button onClick={handlePostContent}>Create</button>

          <button onClick = {togglePopupPost}>Tag</button>
        </div>

        <div className="posts">
          {(!(posts === undefined)) ?
            ((!(friendName === undefined))) ?
              posts.map((val, key) => {

                return (
                  <div className="greyBox" key={key}>

                    {/* Show author of each post */}
                    <Link className="link" to={`/${authors[key]}`}>
                      {friendName[friendUuid.indexOf(authors[key])] ?
                        friendName[friendUuid.indexOf(authors[key])] : name}
                    </Link>

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

                    <div className="postTs"> {ts[key]} </div>

                    <div className="postContent">
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
                    </div>

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
                        <img src={images[key]} alt="Could not display image" />
                      </div> : null
                    }

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
                            <div>
                              <Link className="link" to={`/${key.cCreatedBy}`}>
                                {friendName[friendUuid.indexOf(key.cCreatedBy)] ?
                                friendName[friendUuid.indexOf(key.cCreatedBy)] : name}
                              </Link>
                              
                              <div className="commentTs"> {key.cCreatedAt} </div>
                              
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
                        value={commentContent ? commentContent : ""}
                        onChange={(e) => { setCommentContent(e.target.value) }}
                      />
                      <button onClick={() => handleCommentContent(postIDs[key])}>Comment</button>
                    </div>

                  </div>
                )
              }) :
              <div className="greyBox">
                No discussions yet
              </div> : null}
        </div>
      </div>
    </>
  )
}

export default Forums