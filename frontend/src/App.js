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
import Notifications from './components/Notifications';
import './css/App.css';

function App() {
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");
  const [profileDummy, setProfileDummy] = useState(0);
  const [areNotifications, setAreNotifications] = useState(false);

  Axios.defaults.withCredentials = true;
  
  useEffect(() => {
    async function fetchData() {
      const res = await Axios.get("http://localhost:3001/login");
      setIsLoggedIn(res.data.success);
      setUser(res.data.uuid);
    }

    // return () => {};
  });

  return (
    <Router>
      <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn, user, setUser, profileDummy, setProfileDummy, areNotifications, setAreNotifications}}>
        <Header />
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/searchUser" component={SearchUser} />
          <Route path="/register" component={Register} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/:uid/friends" component={Friends} />
          <Route path="/:uid/about" component={About} />
          <Route path="/:uid" component={Profile} />
        </Switch>
      </AuthContext.Provider>
    </Router>
  )

}

export default App
