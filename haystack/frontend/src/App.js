import React from 'react';
import { observer } from 'mobx-react'
import UserStore from './stores/UserStore';
import Login from './Login';
import './App.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Profile from './Profile';
import Navbar from './Navbar';
import Home from './Home';
import Forums from './Forums';
import Settings from './Settings';
import SignUp from './SignUp';

class App extends React.Component {
  async componentDidMount() {
    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.email = result.email;
        UserStore.firstName = result.firstName;
        UserStore.lastName = result.lastName;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    }
    
    catch(e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  }

  render() {
     //UserStore.isLoggedIn = true;

    if (UserStore.loading) {
      return (
        <div className="app">
          <div className='container'>
            Loading...
          </div>
        </div>
      )
    } else if (UserStore.isLoggedIn) {
        return (
          <>
            <div className="app">
              <div className='container'>
                <Router>
                  <Navbar />
                    <Switch>
                      <Route path='/' exact component={Home} />
                      <Route path='/profile' component={Profile} />
                      <Route path='/forums' component={Forums} />
                      <Route path='/settings' component={Settings} />
                    </Switch>
                </Router>
              </div>
            </div>
          </>
        );
    } else if (UserStore.isNewUser) {
      return (
        <div className = "login">
          <Router>
            <Redirect from='/login' to='/signup' />
            <Route path='/signup' component={SignUp} />
          </Router>
        </div>
        // <div className = "login">
        //   <SignUp />
        // </div>
      );
    } else if (!(UserStore.isLoggedIn)) {
      return (
        <div className= "login">
          <Router>
            <Redirect from='/' to='/login' />
            <Route path='/login' component={Login} />
          </Router>
        </div>
        // <div className="login">
        //   <Login />
        // </div>
      );
    }
  }
}

export default observer(App);
