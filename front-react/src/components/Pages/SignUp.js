import React, { useState, useRef, useEffect } from 'react';
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
    const firstName = firstNameRef.current.value
    const lastName = lastNameRef.current.value
    const name = userNameRef.current.value
    const password = passwordRef.current.value

    if (firstName === '') return //handle error
    console.log("First Name: " + firstName) // access to password so we can add it to database
    setUsername(currUser => {
      return [{firstName: firstName, id: 1}]
    })

    if (lastName === '') return //handle error
    console.log("Last Name: " + lastName) // access to password so we can add it to database
    setUsername(currUser => {
      return [{lastName: lastName, id: 1}]
    })
    
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
    firstNameRef.current.value = null
    lastNameRef.current.value = null
    userNameRef.current.value = null
    passwordRef.current.value = null
  }

  return (
    <>
      <sign className='sign-up'>
        <div className='container'>
          <div className='sign-up'>
              <h1>Sign Up</h1>
          </div>
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