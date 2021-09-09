import React from 'react';
import InputField from '../InputField';
import SubmitButton from '../SubmitButton';
import UserStore from '../stores/UserStore';
import { Link, BrowserRouter as Router, Redirect, Route} from 'react-router-dom';
import { useAsObservableSource } from 'mobx-react-lite';

class EditAbout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: '',
            birthday: '',
            location: '',
            phone: '',
            buttonDisabled: false
        }
        this.state = {
            hidden: true
        };
        this.toggleShow = this.toggleShow.bind(this);
    }

    toggleShow() {
        this.setState({ hidden: !this.state.hidden });
    }

    setInputValue(property, val) {
        val = val.trim();
        if (val.length > 45) {
            return;
        }
        this.setState({
            [property]: val
        })
    }

    resetForm() {
        this.setState({
            bio: '',
            birthday: '',
            location: '',
            phone: '',
            buttonDisabled: false
        })
    }

    async editAbout() {
        var newBio = this.state.bio;
        var newBirthday = this.state.birthday;
        var newLocation = this.state.location;
        var newPhone = this.state.phone;
        if (!this.state.bio) {
            newBio = UserStore.bio;
        }
        if (!this.state.birthday) {
            newBirthday = UserStore.birthday;
        }
        if (!this.state.location) {
            newLocation = UserStore.location;
        }
        if (!this.state.phone) {
            newPhone = UserStore.phone;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('/editAbout', {
                method: 'put',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    bio: newBio,
                    birthday: newBirthday,
                    location: newLocation,
                    phone: newPhone
                })
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.bio = newBio;
                UserStore.birthday = newBirthday;
                UserStore.location = newLocation;
                UserStore.phone = newPhone;
            } else if (result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
        }

        catch(e) {
            console.log(e);
            this.resetForm();
        }
    }

    render() {
        return (
            <>
            {/* <Navbar /> */}
            <div className="profile">
                About
                <InputField
                    type='text'
                    placeholder='Bio'
                    value={this.state.bio ? this.state.bio : '' }
                    onChange={ (val) => this.setInputValue('bio', val) }
                />

                <InputField
                    type='text'
                    placeholder='Birthday'
                    value={this.state.birthday ? this.state.birthday : '' }
                    onChange={ (val) => this.setInputValue('birthday', val) }
                />

                <InputField
                    type='text'
                    placeholder='Location'
                    value={this.state.location ? this.state.location : '' }
                    onChange={ (val) => this.setInputValue('location', val) }
                />

                <InputField
                    type='text'
                    placeholder='Phone'
                    value={this.state.phone ? this.state.phone : '' }
                    onChange={ (val) => this.setInputValue('phone', val) }
                />

                <Link to="/profile">
                    <SubmitButton
                        text='Submit'
                        disabled={this.state.buttonDisabled}
                        onClick={ () => this.editAbout() }
                    />
                </Link>
                
                <Link to="/profile">
                    <SubmitButton
                        text='Cancel'
                        disabled={false}
                        onClick={ () => console.log('') }
                    />
                </Link>
            </div>
            </>
        )
    }
}

export default EditAbout;