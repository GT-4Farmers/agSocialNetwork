import React from 'react'
import UserStore from '../stores/UserStore';
import SubmitButton from '../SubmitButton';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import Profile from './Profile';

class About extends React.Component {
    constructor(props) {
        super(props)
    }

    async editBio() {
        let newBio = prompt("Bio", "Insert bio here");
        if (!newBio) {
            return;
        }
        try {
            let res = await fetch('/editBio', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bio: newBio
                })
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.bio = newBio;
                alert('User bio has been updated.');
            } else if (result && result.success === false) {
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
        }
    }

    async editBirthday() {
        let newBirthday = prompt("Birthday", "Insert birthday here");
        if (!newBirthday) {
            return;
        }
        try {
            let res = await fetch('/editBirthday', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    birthday: newBirthday
                })
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.birthday = newBirthday;
                alert('User birthday has been updated.');
            } else if (result && result.success === false) {
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
        }
    }

    async editLocation() {
        let newLocation = prompt("Location", "Insert location here");
        if (!newLocation) {
            return;
        }
        try {
            let res = await fetch('/editLocation', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    location: newLocation
                })
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.location = newLocation;
                alert('User location has been updated.');
            } else if (result && result.success === false) {
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
        }
    }

    async editPhone() {
        let newPhone = prompt("Phone", "Insert phone number here");
        if (!newPhone) {
            return;
        }
        try {
            let res = await fetch('/editPhone', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: newPhone
                })
            });
            let result = await res.json();
            if (result && result.success) {
                UserStore.phone = newPhone;
                alert('User phone number has been updated.');
            } else if (result && result.success === false) {
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
        }
    }

    render () {
        return(
            <div className='profile'>
                <h2>About</h2>
                <li>
                    Bio: {UserStore.bio}
                    <SubmitButton
                        text='Edit'
                        disabled={false}
                        onClick={ () => this.editBio() }
                    />
                </li>
                <li>
                    Birthday: {UserStore.birthday}
                    <SubmitButton
                        text='Edit'
                        disabled={false}
                        onClick={ () => this.editBirthday() }
                    />
                </li>
                <li>
                    Location: {UserStore.location}
                    <SubmitButton
                        text='Edit'
                        disabled={false}
                        onClick={ () => this.editLocation() }
                    />
                </li>
                <li>
                    Phone: {UserStore.phone}
                    <SubmitButton
                        text='Edit'
                        disabled={false}
                        onClick={ () => this.editPhone() }
                    />
                </li>
            </div>
        )
    }
}

export default About;
