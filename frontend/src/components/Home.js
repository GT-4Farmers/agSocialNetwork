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
    Axios.get("http://localhost:3001/login").then((res) => {
      if (res) {
        setName(`${res.data.firstName} ${res.data.lastName}`);
      }
    });

    Axios.get("http://localhost:3001/home/friends").then((res) => {
      if (res) {
        setFriendUuid(res.data.friendUuid);
        setFriendName(res.data.friendName);
      }
    })
  }, []);

  useEffect(() => {
    Axios.post("http://localhost:3001/home/", {
      friendUuid: friendUuid
    }).then((res) => {
      setAuthors(res.data.authors); // imagine moving this line down 3 times and dashboard crashing
      setPosts(res.data.posts);
      setTs(res.data.timestamps);
      setPostIDs(res.data.postIDs);
      let pIDS = res.data.postIDs;
      let lArray = [];
      let countArray = [];
      for (const p in pIDS) {
        Axios.post("/home/likes/getLikes", {
          postID: pIDS[p]
        })
        .then(res => {
          lArray.push(res.data.likers);
          countArray.push(res.data.count);
        })
      }
      setLikers(lArray);
      setCounts(countArray);
    })
  }, [friendUuid, profileDummy, network]);

  const handleDeletePost = (deletedPost) => {
    Axios.post('http://localhost:3001/profile/deleteTextPost', {
        deletedPostID: deletedPost
    }).then((response) => {
        if (!response.data.success) {
            alert(response.data.msg);
        } else {
            console.log(response.data.msg);
        }
    })
    setNetwork(network + 1);
  }

  const handleLike = (likePID) => {
    Axios.post('/home/likes', {
        postID: likePID,
        uuid: user,
        mode: "like"
      });
    setNetwork(network + 1);
  }

  const handleDislike = (dislikePID) => {
    Axios.post('/home/likes', {
        postID: dislikePID,
        uuid: user,
        mode: "dislike"
      });
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
        {(!(posts === undefined)) ? (!(posts.length === 0) && (!(friendName.length === 0))) ? 
        
        posts.map((val, key) => {
        
        return(
            
            <div className="greyBox" key={key}>
                <Link className="link" to={`/${authors[key]}`}>
                  {friendName[friendUuid.indexOf(authors[key])] ? friendName[friendUuid.indexOf(authors[key])] : name}
                </Link>
                
                {(!(authors[key] === user)) ? null : <button onClick={() => {handleDeletePost(postIDs[key])}}>X</button>}
                <div className="postTs">{ts[key]}</div>
                <div className="postContent">{val}</div>
                <div className="likes">
                {likers[key] === undefined ? null : <button className="tractor" onClick={() => {!likers[key].includes(user) ? handleLike(postIDs[key]) : handleDislike(postIDs[key])}}>{ likers[key].includes(user) ? <FaTractor color="green"/> : <FaTractor />}</button>} {counts[key]}
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