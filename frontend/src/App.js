import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route, useParams } from 'react-router-dom';
import Axios from 'axios';

import AuthContext from './states/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Profile from './components/Profile';
import About from './components/About';
import Friends from './components/Friends';
import SearchUser from './components/SearchUser';
import './App.css';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  Axios.defaults.withCredentials = true;
  
  useEffect(() => {
    let unmounted = false;

    Axios.get("http://localhost:3001/login")
    .then((res) => {
        if (!unmounted) {
          setIsLoggedIn(res.data.success);
        }
    })

    return () => { unmounted = true };
  });

  return (
    <Router>
      <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser}}>
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/searchUser" component={SearchUser} />
          <Route path="/register" component={Register} />
          <Route path="/:uid/friends" component={Friends} />
          <Route path="/:uid/about" component={About} />
          <Route path="/:uid" component={Profile} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  )

}

export default App
