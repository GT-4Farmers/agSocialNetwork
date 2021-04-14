import React from 'react';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';

import Home from './components/Pages/Home';
import Profile from './components/Pages/Profile';
import Forums from './components/Pages/Forums';
import Settings from './components/Pages/Settings';
import SignUp from './components/Pages/SignUp';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/profile' component={Profile} />
          <Route path='/forums' component={Forums} />
          <Route path='/settings' component={Settings} />
          <Route path='/sign-up' component={SignUp} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
