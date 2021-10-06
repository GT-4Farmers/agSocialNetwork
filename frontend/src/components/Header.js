import React, { useContext, useState, useEffect } from 'react';
import { withRouter, Link } from "react-router-dom";
import '../App.css';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import AuthContext from '../states/AuthContext';

function Header(props) {

  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [uuid, setUuid] = useState("");
  let {uid} = useParams();
  useEffect(() => {
    let unmounted = false;

    Axios.get("http://localhost:3001/profile")
    .then(res => {
        if (!unmounted) {
            setUuid(res.data.uuid);
        }
    })

    return () => { unmounted = true };
  });
  uid = uuid;

  function renderNav() {
    if ( (!(props.location.pathname === '/' || (props.location.pathname === '/register')) && isLoggedIn) ) {
      uid = uuid;
      return (
        <>
        <div>
          <nav>
            <ul>
              <li>
                <Link to='/home'>Home</Link>
              </li>
              <li>
                <Link to={`/${uid}`}>Profile</Link>
              </li>
              <li>
                <Link to='/searchUser'>Search User</Link>
              </li>
              {/* <li>
                <Link to='/profile'>Profile</Link>
              </li> */}
            </ul>
          </nav>
        </div>
        <div>
          <button onClick={() => handleLogout()}>Logout</button>
        </div>
        </>
      )
    }
  }

  const history = useHistory();

  const logout = () => {
    Axios.post('http://localhost:3001/logout')
      .then((response) => {
        if (response && response.data.success) {
          history.push("/");
        }
      })
  };

  function handleLogout() {
    logout();
    props.history.push('/');
  }

  return (
    <div className="registration">
      {renderNav()}
    </div>
  )
}
export default withRouter(Header);