import React from 'react'
import UserStore from '../stores/UserStore';
import SubmitButton from '../SubmitButton';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import Profile from './Profile';

class About extends React.Component {
    constructor(props) {
        super(props)
    }

    render () {
        return(
            <div className='profile'>
                <h2>About</h2>
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
                    Phone: {UserStore.phone}
                </li>
                <Link to="/profile/editabout">
                    <SubmitButton
                        text='Edit'
                        disabled={false}
                        onClick={ () => console.log('') }
                    />
                </Link>
            </div>
        )
    }
}

export default About;
