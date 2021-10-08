import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function SearchUser() {

  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [userToSearch, setUserToSearch] = useState("");

  const [foundUser, setFoundUser] = useState([]);
  const [foundUserIds, setFoundUserIds] = useState([]);

  useEffect(() => {
    let unmounted = false;

    Axios.post("http://localhost:3001/searchUser", {
      userToSearch: userToSearch
    })
    .then(res => {
        if (!unmounted) {
          if (res.data.success) {
            setFoundUser(res.data.users[0]);
            setFoundUserIds(res.data.uniqueIds[0])
          }
        }
      })
      
    return () => { unmounted = true };
  }, [userToSearch]);

  const handleChange = (e) => {
    if (e.target.value === "") {
      setFoundUser([]);
      setFoundUserIds([]);
    }
    setUserToSearch(e.target.value);
  }
  
  if (!isLoggedIn) {
    return (
      <AuthService />
    )
  }

  return (
    <div className="App">
      <div>
        <h1> Search User </h1>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search for a User"
          value={userToSearch}
          onChange={handleChange}
        />
      </div>
      <div className="registration">
        {(!(foundUser.length === 0)) ? foundUser.map((val, key) => {
          return(
            <Link key={key} to={foundUserIds[key]}>
              {val}
            </Link>
          )
        }) : <div>No user found with that name</div> }
      </div>
    </div>
  )
}

export default SearchUser