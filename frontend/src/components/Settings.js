import { useContext, useEffect, useState } from 'react';
import Axios from 'axios';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Settings() {

    let history = useHistory();
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const [editEmail, setEditEmail] = useState(false);
    const [editPassword, setEditPassword] = useState(false);

    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');

//   useEffect(() => {
//     async function fetchData() {
//       const res = await Axios.post("http://localhost:3001/searchUser", {
//         userToSearch: userToSearch
//       })
//       if (res.data.success) {
//         setFoundUser(res.data.users[0]);
//         setFoundUserIds(res.data.uniqueIds[0])
//       }
//     }
//     fetchData();

//   }, [userToSearch]);

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
                <h1>Update email or password</h1>
            </div>
            <div>
                <button onClick={() => {setEditEmail(!editEmail)}}>Update Email</button>
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
            <div>
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
                <h1>Profile Visibility</h1>
            </div>

            <div>
                <h1>Language and Region</h1>
            </div>
        </div>
    )
}

export default Settings
