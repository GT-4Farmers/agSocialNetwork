import { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';

function Home() {
  let history = useHistory();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [email, setEmail] = useState("");

  useEffect(() => {
    let unmounted = false;
    Axios.get("http://localhost:3001/login")
    .then((res) => {
      if (res && !unmounted) {
        setEmail(res.data.email);
      }
    })
    return () => { unmounted = true };
  }, []);

  if (!isLoggedIn) {
    return (
      <AuthService />
    )
  }

  return (
    <div className="content">
      <h2>Home</h2>
      <p>Hey {email}!</p>
      <p>Dashboard displayed here.</p>


    </div>
  )
}

export default Home