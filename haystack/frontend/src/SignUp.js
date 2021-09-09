import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import Logo from './logo_noName.png';
import './Login.css';

class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
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
            firstName: '',
            lastName: '',
            email: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doSignUp() {
        if (!this.state.firstName) {
            return;
        }
        if (!this.state.lastName) {
            return;
        }
        if (!this.state.email) {
            return;
        }
        if (!this.state.password) {
            return;
        }

        this.setState({
            buttonDisabled: true
        })

        try {
            let res = await fetch('/signUp', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                    email: this.state.email,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.isNewUser = false;
                UserStore.email = result.email;
                UserStore.firstName = result.firstName;
                UserStore.lastName = result.lastName;
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
            <header>
                <img 
                    alt='Haystack Logo' 
                    src={Logo}
                />
                <h1>HAYSTACK</h1>
            </header>
            <div className="signUp">
                <h2>Sign Up</h2>

                <div className="loginBox">
                    <InputField
                        type='text'
                        placeholder='First Name'
                        value={this.state.firstName ? this.state.firstName : '' }
                        onChange={ (val) => this.setInputValue('firstName', val) }
                    />

                    <InputField
                        type='text'
                        placeholder='Last Name'
                        value={this.state.lastName ? this.state.lastName : '' }
                        onChange={ (val) => this.setInputValue('lastName', val) }
                    />

                    <InputField
                        type='text'
                        placeholder='Email'
                        value={this.state.email ? this.state.email : '' }
                        onChange={ (val) => this.setInputValue('email', val) }
                    />

                    <InputField
                        type={this.state.hidden ? 'password' : 'text'}
                        placeholder='Password'
                        value={this.state.password ? this.state.password : '' }
                        onChange={ (val) => this.setInputValue('password', val) }
                    />

                    { <SubmitButton
                        text='Show/Hide'
                        disabled={this.state.buttonDisabled}
                        onClick={ () => this.toggleShow() }
                    /> }

                    <SubmitButton
                        text='Submit'
                        disabled={this.state.buttonDisabled}
                        onClick={ () => this.doSignUp() }
                    />
                    
                    <a href={window.location.protocol + "//" + window.location.host}>
                        <SubmitButton
                            text='Cancel'
                            disabled={this.state.buttonDisabled}
                            onClick={ () => UserStore.isNewUser = false }
                        />
                    </a>
                </div>
            </div>
            </>
        )
    }
}

export default SignUp;