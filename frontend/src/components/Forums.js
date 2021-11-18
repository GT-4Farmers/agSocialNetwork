import { useEffect, useState, useContext, useRef } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Forums() {
  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const { user, setUser } = useContext(AuthContext);
  const { tags, setTags } = useContext(AuthContext);
  const ref = useRef(null);

  const [name, setName] = useState("");

  // States for tags and tag popups
  const [displayedTags, setDisplayedTags] = useState([]);
  const [tagFilter, setTagFilter] = useState(null);
  const [filterArray, setFilterArray] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenPost, setIsOpenPost] = useState(false);
  const [tagFilterPost, setTagFilterPost] = useState(null);
  const [filterArrayPost, setFilterArrayPost] = useState([]);

  // post states
  const [discussionContent, setDiscussionContent] = useState('');
  const [discussions, setDiscussions] = useState([]);
  const [ts, setTs] = useState([]);
  const [discussionIDs, setDiscussionIDs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [authorNames, setAuthorsNames] = useState([]);
  const [openDD, setOpenDD] = useState([]);
  const [showEdit, setShowEdit] = useState([]);

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/login");
      setName(`${res.data.firstName} ${res.data.lastName}`);

      const tagRes = await Axios.post("http://localhost:3001/forums/getTags", {
        filter: tagFilter
      });
      setDisplayedTags(tagRes.data.tags);

      const resThree = await Axios.post("http://localhost:3001/forums/getDiscussions", {
        displayedTags: tagRes.data.tags
      });
      setAuthors(resThree.data.authors);
      setDiscussions(resThree.data.discussions);
      setTs(resThree.data.timestamps);
      setDiscussionIDs(resThree.data.discussionIDs);
      setAuthorsNames(resThree.data.authorNames);
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

  // TODO: MODIFY THIS TO DELETE DISCUSSIONS AND NOT POSTS
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

  // TODO: MODIFY THIS TO EDIT DISCUSSIONS AND NOT POSTS
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
    let newDiscussions = [...discussions];
    newDiscussions[key] = e.target.value;
    setDiscussions(newDiscussions);
  }

  const handleDiscardChanges = (key) => {
    async function fetchData() {
      const res = await Axios.post("http://localhost:3001/forums/getDiscussions", {
        displayedTags: displayedTags
      });
      setDiscussions(res.data.discussions);
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

  const handleDiscussionContent = () => {
    // will users be allowed to post image without text?
    if (discussionContent === "") {
      alert("Please title what you want to discuss.");
    } else if (!tagFilterPost) {
      alert("Please select at least one tag.");
    } else if (tagFilterPost.length > 3) {
      alert("Too many tags selected.");
    } else {
      async function fetchData() {
        let url = "http://localhost:3001/forums/createDiscussion"
        const res = await Axios.post(url, {
          content: discussionContent,
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
      setDiscussionContent("");
      setFilterArrayPost([]);
      setTagFilterPost(null);
    }

    // prevents keys getting mixed if posting while editing
    setShowEdit([]);
    setOpenDD([]);

    setNetwork(network + 1);
  }

  return (
    <>
      <div className="content">
        <h2>Forum</h2>
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
            value={discussionContent ? discussionContent : ""}
            onChange={(e) => { setDiscussionContent(e.target.value) }}
          />

          {/* JSX for popups for discussion creation */}
          {isOpenPost && <PopupPost
            content={<>
            <div className="tags">
              <p>Please select one to three tags for your discussion:</p>
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

          <button onClick={handleDiscussionContent}>Create</button>

          <button onClick = {togglePopupPost}>Tag</button>
        </div>

        <div className="posts">
          {(!(discussions === undefined)) ?
            discussions.map((val, key) => {

              return (
                <div className="greyBox" key={key}>

                  <h2>
                    {val}
                  </h2>

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
                            onClick={() => handleDeletePost(discussionIDs[key])}>
                            Delete
                          </button>
                        </div>
                      }

                    </div>
                  } */}

                  <div className="postTs"> {ts[key]} </div>

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
                        onClick={() => { handleEditPost(discussionIDs[key], discussions[key], key) }}>
                        Save Changes
                      </button>
                    }

                    {showEdit[key] && (!friendName[friendUuid.indexOf(authors[key])]) &&
                      <button
                        onClick={() => { handleDiscardChanges(key) }}>
                        Discard Changes
                      </button>}
                  </div> */}
                </div>
              )
            }) :
            <div className="greyBox">
              No discussions yet
            </div>}
        </div>
      </div>
    </>
  )
}

export default Forums