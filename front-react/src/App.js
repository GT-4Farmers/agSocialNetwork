import React, { useState } from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

// import Home from './components/Pages/Home';
import Profile from './components/Pages/Profile';
import Forums from './components/Pages/Forums';
import Settings from './components/Pages/Settings';
import SignUp from './components/Pages/SignUp';
import Login from './components/Pages/Login';
import Dashboard from './components/Pages/Dashboard';


function App() {
  // const [token, setToken] = useState();

  // if(!token) {
  //   return <Login setToken={setToken} />
  // }

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          {/* if auth, dashboard/home */}
          <Route path='/' exact component={Login} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/profile' component={Profile} />
          <Route path='/forums' component={Forums} />
          <Route path='/settings' component={Settings} />
          <Route path='/login' component={Login} />
          <Route path='/sign-up' component={SignUp} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
