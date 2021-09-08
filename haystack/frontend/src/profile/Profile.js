import React, { useEffect, useState } from 'react'
import UserStore from '../stores/UserStore';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import SubmitButton from '../SubmitButton';

class Profile extends React.Component {
    constructor(props) {
        super(props);
    }

    async getAbout() {
        try {
            let res = await fetch('/getAbout', {
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.bio = result.bio;
                UserStore.birthday = result.birthday;
                UserStore.location = result.location;
                UserStore.phone = result.phone;
                UserStore.msg = result.msg;
            } else if (result && result.success === false) {
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
        }
    }

    render() {
        return (
            <div className='profile'>
                {UserStore.firstName} {UserStore.lastName}
                <Link to="/profile/about">
                    <SubmitButton
                        text='About'
                        disabled={false}
                        onClick={ () => this.getAbout() }
                    />
                </Link>
                <Link to="/profile">
                    <SubmitButton
                        text='Photos'
                        disabled={false}
                        onClick={ () => console.log('') }
                    />
                </Link>
                <Link to="/profile">
                    <SubmitButton
                        text='Friends'
                        disabled={false}
                        onClick={ () => console.log('') }
                    />
                </Link>
                <label>
                    <input type="text" name="How are you feeling today?" />
                </label>
            </div>
        )
    }
}

export default Profile;