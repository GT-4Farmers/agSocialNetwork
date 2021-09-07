import React, { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import SubmitButton from './SubmitButton';
import Logo from './logo_noName.png';
import './Navbar.css';
import UserStore from './stores/UserStore';
import './App.css';
import App from './App';
import Login from './Login';

class Navbar extends React.Component {
  app = new App()

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
        // <Router>
        //   <Redirect from='/*' to='/login' />
        //   <Route path='/login' component={Login} />
        // </Router>
      }
    }
    
    catch(e) {
      console.log(e)
    }
  }

  render() {
    return (
      <>
      <div>
        <nav className="navbar">
          <div className="navbar-container">
            <Link to="/" className="navbar-logo" >
              <img alt='logo' src={Logo}/>
              <div className='home-name'>HAYSTACK</div>
            </Link>
            <Link to="/profile" className="nav-links" >
              <div>
                <i class="fas fa-user"></i>
                Profile
              </div>
            </Link>
            <Link to="/forums" className="nav-links" >
              <div>
                <i class="fas fa-comments"></i>
                Forums
              </div>
            </Link>
            <Link to="/settings" className="nav-links" >
              <div>
              <i class="fas fa-cog"></i>
                Settings
              </div>
            </Link>
            <div className='btn-gap'>
              <a href={window.location.protocol + "//" + window.location.host}>
                <SubmitButton 
                text={'Log out'}
                disabled={false}
                onClick={ () => this.doLogout() }
                />
              </a>
            </div>
          </div>
        </nav>
      </div>
      </>
    );
  }

}

export default Navbar
