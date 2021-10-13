import { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Home({fetchUrl}) {
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

  // network state
  const [network, setNetwork] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const req = await Axios.get("/login");
      setName(`${req.data.firstName} ${req.data.lastName}`);
      return req;
    }
    fetchData();
  }, [fetchUrl]);

  useEffect(() => {
    async function fetchData() {
      const req = await Axios.post("/home/", {
        friendUuid: friendUuid
      });
      setAuthors(req.data.authors);
      setPosts(req.data.posts);
      setTs(req.data.timestamps);
      setPostIDs(req.data.postIDs);
      return req;
    }
    fetchData();
  }, [fetchUrl]);

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
        { posts.map((val, key) => {
        return(
            <div className="greyBox" key={key}>
                <Link className="link" to={`/${authors[key]}`}>
                  {friendName[friendUuid.indexOf(authors[key])] ? friendName[friendUuid.indexOf(authors[key])] : name}
                </Link>
                
                {(!(authors[key] === user)) ? null : <button onClick={() => {handleDeletePost(postIDs[key])}}>X</button>}
                <div className="postTs">{ts[key]}</div>
                <div className="postContent">{val}</div>
                
            </div> )})}
        </div>
      </div>
    </>
  )
}

export default Home