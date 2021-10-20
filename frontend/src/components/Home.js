import { useEffect, useState, useContext, useRef } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";
import { FaTractor } from 'react-icons/fa';

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

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
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
      setImages(resThree.data.images);
      setPostIDs(resThree.data.postIDs);
      setLikeCounts(resThree.data.likeCounts);
      setLiked(resThree.data.liked);
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
        <p>Hey {name}! :-D</p>
        <p>Dashboard displayed here.</p>

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