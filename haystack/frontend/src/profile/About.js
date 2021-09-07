import React from 'react'
import UserStore from '../stores/UserStore';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import Profile from './Profile';

export default function About() {
    return (
        <div className='profile'>
            <h2>About</h2>
            <h3>{UserStore.msg}</h3>
            <li>
                Bio: {UserStore.bio}
            </li>
            <li>
                Birthday: {UserStore.birthday}
            </li>
            <li>
                Location: {UserStore.location}
            </li>
            <li>
                Contact Info:
            </li>
            <ul>
                <li>
                    Email: {UserStore.email}
                </li>
                <li>
                    Phone: {UserStore.phone}
                </li>
            </ul>
        </div>
    )
}
