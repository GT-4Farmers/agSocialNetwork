import React from 'react';
import { observer } from 'mobx-react'
import UserStore from './stores/UserStore';
import Login from './Login';
import SubmitButton from './SubmitButton';
import './App.css';

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
    if (UserStore.loading) {
      return (
        <div className="app">
          <div className='container'>
            Loading...
          </div>
        </div>
      )
    } else {
      if (UserStore.isLoggedIn) {
        return (
          <div className="app">
            <div className='container'>
              Welcome {UserStore.email}

              <SubmitButton
                text={'Log out'}
                disabled={false}
                onClick={ () => this.doLogout() }
              />
            </div>
          </div>
        );
      }
    }

    return (
      <div className="app">
        <div className='container'>
          <Login />
         </div>
      </div>
    );
  }
}

export default observer(App);
