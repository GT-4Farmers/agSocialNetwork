import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import { Link } from 'react-router-dom';
import Logo from './logo_noName.png';
import './Login.css';
// import Navbar from './Navbar';

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            email: '',
            password: '',
            buttonDisabled: false
        })
    }

    async doLogin() {
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
            let res = await fetch('/login', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                })
            });

            let result = await res.json();
            if (result && result.success) {
                UserStore.isLoggedIn = true;
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
            <h2>Login</h2>
            <div className="loginBox">
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

                <SubmitButton 
                    text='Show/Hide'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.toggleShow() }
                />
        
                <SubmitButton
                    text='Login'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => this.doLogin() }
                />
            </div>
            <div className="signUp">
                <h3>Don't have an account?</h3>
                <SubmitButton
                    text='Sign Up'
                    disabled={this.state.buttonDisabled}
                    onClick={ () => UserStore.isNewUser = true }
                />
            </div>
            </>
        )
    }
}

export default Login;
