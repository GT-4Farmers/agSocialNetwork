import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import AuthService from '../auth/AuthService';

function Settings() {

    let history = useHistory();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [privacy, setPrivacy] = useState("0");

    useEffect(() => {
        async function fetchData() {
        const res = await Axios.get("http://localhost:3001/settings/getPrivacy")
            if (res.data.success) {
                setPrivacy(res.data.isPrivate);
            }
            console.log(res.data.isPrivate)
        }
        fetchData();

    }, [privacy]);

    const handleUpdateEmail = (newE) => {
        if (newE.length < 1) {
            alert("Please enter a valid email address");
        } else {
            const res = Axios.post("http://localhost:3001/settings/updateCredentials", {
                input: newE,
                credential: "email"
            })
            setNewEmail("");
            setEditEmail(!editEmail);
            alert("Email Updated Successfully")
        }
    }

    const handleUpdatePassword = (newP) => {
        const res = Axios.post("http://localhost:3001/settings/updateCredentials", {
            input: newP,
            credential: "password"
        })
        setNewPassword("");
        setEditPassword(!editPassword);
        alert("Password Updated Successfully")
    }

    const updatePrivacy = () => {
        const res = Axios.post("http://localhost:3001/settings/updatePrivacy", {
            isPrivate: privacy
        })
        alert("Privacy Settings Updated Successfully")
    }

    const handlePrivateChange = () => {
        setPrivacy("1");
      };
    
      const handlePublicChange = () => {
        setPrivacy("0");
      };

    const RadioButton = ({ label, value, onChange }) => {
        return (
            <div className="RadioButtonContainer">
                <div>
                    <input type="radio" checked={value} onChange={onChange} />
                </div>
                <div className="RadioButtonLabel"> 
                    {label}
                </div>
            </div>
        );
    };
  
    if (!isLoggedIn) {
        return (
        <AuthService />
        )
    }

    return (
        <div className="content">
            <div>
                <h2>Settings</h2>
            </div>
            <div>
                <h1 style={{paddingTop: "1em", paddingBottom: "1em"}}>Update email or password</h1>
            </div>
            <div style={{paddingBottom: "1em"}}>
                <button onClick={() => {setEditEmail(!editEmail)}} >Update Email</button>
            </div>
            {editEmail ? 
                <div className="greyBox">
                    <input
                    type="text"
                    id="content"
                    maxLength="45"
                    autoComplete="off"
                    value={newEmail ? newEmail : ""}
                    onChange={(e) => {setNewEmail(e.target.value)}}
                    />
                    <button onClick={() => {handleUpdateEmail(newEmail)}}>Save Changes</button>
                </div> : 
            null}
            <div style={{paddingBottom: "1em"}}>
                <button onClick={() => {setEditPassword(!editPassword)}}>Update Password</button>
            </div>
            {editPassword ? 
                <div className="greyBox">
                    <input
                    type="text"
                    id="content"
                    maxLength="45"
                    autoComplete="off"
                    value={newPassword ? newPassword : ""}
                    onChange={(e) => {setNewPassword(e.target.value)}}
                    />
                    <button onClick={() => {handleUpdatePassword(newPassword)}}>Save Changes</button>
                </div> : 
            null}

            <div>
                <h1 style={{paddingTop: "2em", paddingBottom: "1em"}}>Profile Visibility</h1>
                <div style={{paddingBottom: "1em"}}>
                    <RadioButton
                        label="Private"
                        value={privacy === "1"}
                        onChange={handlePrivateChange}
                    />
                    <RadioButton
                        label="Public"
                        value={privacy === "0"}
                        onChange={handlePublicChange}
                    />
                </div>
                <button onClick={() => {updatePrivacy()}}>Save Changes</button>
            </div>
        </div>
    )
}

export default Settings
