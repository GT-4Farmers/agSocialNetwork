import React, { useState, useRef, useEffect } from 'react';
import Users from './Users'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import '../../App.css';
import '../Button/Button.css';

const LOCAL_STORAGE = 'userList'

export default function SignUp() {
  const [users, setUsername] = useState([])
  const userNameRef = useRef()
  const passwordRef = useRef()
  const firstNameRef = useRef()
  const lastNameRef = useRef()

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE, JSON.stringify(users))
  }, [users])

  function handleFormSubmit(e) {
    const name = userNameRef.current.value
    const password = passwordRef.current.value
    
    if (name === '') return //handle error
    console.log("Username: " + name) // access to name so we can add it to database
    setUsername(currUser => {
      return [{name: name, auth: false}]
    })

    if (password === '') return //handle error
    console.log("Password: " + password) // access to password so we can add it to database
    setUsername(currUser => {
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
          <Users users={users} />
          <li className='sign-item-a'>
            First Name*
          </li>
          <li className='sign-item-b'>
            <input ref={firstNameRef} type="text" />
          </li>
          <li className='sign-item-a'>
            Last Name*
          </li>
          <li className='sign-item-b'>
            <input ref={lastNameRef} type="text" />
          </li>
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
            >Sign Up</button>
          </li>
        </div>
      </sign>
    </>
  );
  
}