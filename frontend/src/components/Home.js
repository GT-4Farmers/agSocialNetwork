import { useEffect, useState, useContext } from 'react';
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

  const [name, setName] = useState("");
  const [friendUuid, setFriendUuid] = useState([]);
  const [friendName, setFriendName] = useState([]);
  
  // post states
  const [posts, setPosts] = useState([]);
  const [ts, setTs] = useState([]);
  const [postIDs, setPostIDs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [likers, setLikers] = useState([]);
  const [counts, setCounts] = useState([]);

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
        // set to resTwo.data.friendUuid instead of friendUuid
        // since this is encapsulated within the same fetchData function
        // and friendUuid isn't updated by the team it reaches this request
        friendUuid: resTwo.data.friendUuid
      });
      setAuthors(resThree.data.authors);
      setPosts(resThree.data.posts);
      setTs(resThree.data.timestamps);
      setPostIDs(resThree.data.postIDs);

      let pIDS = resThree.data.postIDs;
      let lArray = [];
      let countArray = [];
      for (const p in pIDS) {
        let resFour = await Axios.post("http://localhost:3001/home/likes/getLikes", {
          postID: pIDS[p]
        });
        lArray.push(resFour.data.likers);
        countArray.push(resFour.data.count);
      }
      setLikers(lArray);
      setCounts(countArray);
    }
    fetchData();

    // unmount cleanup
    return () => {
      setName("");
      setFriendUuid([]);
      setFriendName([]);
      setAuthors([]);
      setPosts([]);
      setTs([]);
      setPostIDs([]);
    }
  }, [network]);

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
    setNetwork(network + 1);
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
    <>
      <div className="content">
        <h2>Home</h2>
        <p>Hey {name}! :-D</p>
        <p>Dashboard displayed here.</p>
        <div className="posts">
        {(!(posts === undefined)) ? ((!(friendName === undefined))) ? posts.map((val, key) => {
          return(
            <div className="greyBox" key={key}>
              <Link className="link" to={`/${authors[key]}`}>
                {friendName[friendUuid.indexOf(authors[key])] ? friendName[friendUuid.indexOf(authors[key])] : name}
              </Link>
              {(!(authors[key] === user)) ? null : <button onClick={() => {handleDeletePost(postIDs[key])}}>X</button>}
              <div className="postTs">{ts[key]}</div>
              <div className="postContent">{val}</div>
              <div className="likes">
                {likers[0] === undefined ? null : <button className="tractor" onClick={() => {!likers[key].includes(user) ? handleLike(postIDs[key]) : handleDislike(postIDs[key])}}>{ likers[key].includes(user) ? <FaTractor color="green"/> : <FaTractor />}</button>} {counts[key]}
              </div>
            </div>
          )}) :
            <div className="greyBox">
              No posts yet
            </div> : null }
        </div>
      </div>
    </>
  )
}

export default Home