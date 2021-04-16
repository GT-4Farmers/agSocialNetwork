import React, { useState, useRef, useEffect } from 'react';
import '../../App.css';
import '../Button/Button.css';
import { Link } from 'react-router-dom';

const LOCAL_STORAGE = 'userList'

export default function Login() {
  const [loginUser, setLoginUser] = useState([])
  const userNameRef = useRef()
  const passwordRef = useRef()

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(loginUser))
  }, [loginUser])

  function handleFormSubmit(e) {
    const name = userNameRef.current.value
    const password = passwordRef.current.value
    
    if (name === '') return //handle error
    console.log("Username: " + name) // access to name so we can add it to database
    setLoginUser(currUser => {
      return [{name: name, auth: false}]
    })

    if (password === '') return //handle error
    console.log("Password: " + password) // access to password so we can add it to database
    setLoginUser(currUser => {
      return [{password: password, auth: false}]
    })

    // reset values
    userNameRef.current.value = null
    passwordRef.current.value = null
  }

  return (
    <>
      <sign className='sign-up'>
        <div className='container'>
            <div className='login'>
                <h1>Log In</h1>
            </div>
          {/* <LoginUser loginUser={loginUser} /> */}
          <li className='sign-item-a'>
            Email*
          </li>
          <li className='sign-item-b'>
            <input ref={userNameRef} type="text" />
          </li>
          <li className='sign-item-a'>
            Password*
          </li>
          <li className='sign-item-b'>
            <input ref={passwordRef} type="text" />
          </li>
          <li className='sign-item'>
            <button
            className={`btn btn--outline-su btn--medium`}
            onClick={handleFormSubmit}
            >Log In</button>
          </li>
          <li className='label'>
            <Link to='/sign-up'>
                Don't have an account yet?
            </Link>
          </li>
        </div>
      </sign>
    </>
  );
  
}