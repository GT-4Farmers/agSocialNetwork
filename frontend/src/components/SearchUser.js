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
    async function fetchData() {
      const res = await Axios.post("/searchUser", {
        userToSearch: userToSearch
      })
      if (res.data.success) {
        setFoundUser(res.data.users[0]);
        setFoundUserIds(res.data.uniqueIds[0])
      }
    }
    fetchData();

    // unmount cleanup
    return () => {
      setFoundUser([]);
      setFoundUserIds([]);
    }

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
    <div className="content">
      <div>
        <h2>Search User</h2>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search for a User"
          value={userToSearch}
          onChange={handleChange}
        />
      </div>
      <div className="searchResults">
        {(!(foundUser.length === 0)) ? foundUser.map((val, key) => {
          return(
            <Link className="link" key={key} to={foundUserIds[key] ? foundUserIds[key] : `/`}>
              {val}
            </Link>
          )
        }) : <p>No user found with that name</p>}
      </div>
    </div>
  )
}

export default SearchUser
