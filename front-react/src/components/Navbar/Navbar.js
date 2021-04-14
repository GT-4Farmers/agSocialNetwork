import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import './Navbar.css';
import Logo from './logo_noName.png';

function Navbar() {
	const [click, setClick] = useState(false);
	const [button, setButton] = useState(true);
  
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  // function to remove on mobile
  const showButton = () => {
    if(window.innerWidth <= 960) {
      setButton(false)
    } else {
      setButton(true)
    }
  };

  // hide signup button after initial
  useEffect(() => {
    showButton()
  }, [])

  window.addEventListener('resize',  showButton);


	return (
		<div>
			<nav className="navbar">
				<div className="navbar-container">
					<Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
						<img alt='logo' src={Logo}/> HAYSTACK
					</Link>
					<div className='menu-icon' onClick={handleClick}>
						{/* if click, X, otherwise hamburger */}
						<i className={click ? 'fas fa-times' : 'fas fa-bars'} />
					</div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/profile' className='nav-links' onClick={closeMobileMenu}>
                Profile
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/forums' className='nav-links' onClick={closeMobileMenu}>
                Forums
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/settings' className='nav-links' onClick={closeMobileMenu}>
                Settings
              </Link>
            </li>
            <li className='nav-item'>
              <Link to='/sign-up' className='nav-links-mobile' onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </li>
          </ul>
          {button && <Button buttonStyle='bts--outline'>SIGN UP</Button>}
				</div>
			</nav>
		</div>
	)
}

export default Navbar

