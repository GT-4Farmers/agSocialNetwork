import React from 'react';
import { observer } from 'mobx-react'
import UserStore from './stores/UserStore';
import Login from './Login';
import './App.css';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Profile from './Profile';
import Navbar from './Navbar';
import Home from './Home';
import Forums from './Forums';
import Settings from './Settings';

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

  async doLogin() {
    if (!this.state.email) {
        return;
    }
    if (!this.state.password) {
        return;
    }

    this.setState({
        buttonDisabled: true
    })

    try {
        let res = await fetch('/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        });

        let result = await res.json();
        if (result && result.success) {
            UserStore.isLoggedIn = true;
            UserStore.email = result.email;
        } else if (result && result.success === false) {
            this.resetForm();
            alert(result.msg);
        }
    }

    catch(e) {
        console.log(e);
        this.resetForm();
    }
  }

  async doLogout() {
    try {
      let res = await fetch('/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.email = '';
      }
    }
    
    catch(e) {
      console.log(e)
    }
  }

  render() {
    // UserStore.isLoggedIn = true;

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
    } else if (!(UserStore.isLoggedIn)) {
      return (
        // <Router className="login">
        //   <Route path='/' component={Login} />
        // </Router>
        <div className="login">
          <Login />
        </div>
      );
    }

    // return (
      
    // );
  }
}

export default observer(App);
