import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';

function About() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

    const history = useHistory();
    let {uid} = useParams()
    const [uuid, setUuid] = useState(uid)
    const [email, setEmail] = useState("");
    const [bio, setBio] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [showElement, setShowText] = useState(false);
    const [isProfileOwner, setIsProfileOwner] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const onClick = () => setShowText(!showElement);

    useEffect(() => {
        Axios.post("http://localhost:3001/profile/about", {
            profileRoute: uuid
        })
        .then(res => {
            setEmail(res.data.email)
            setBio(res.data.bio);
            setBirthdate(res.data.birthdate);
            setLocation(res.data.location);
            setPhone(res.data.phone);
        })
    }, []);

    useEffect(() => {
        Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
            profileRoute: uuid
        })
        .then(res => {
            if (res.data.success) {
                setIsProfileOwner(res.data.isUser)
                setIsFriend(res.data.isFriend)
            } else {
                alert(res.data.msg)
            }
        })
    }, [])

    const editBio = () => {
        Axios.put('http://localhost:3001/profile/about/bio', {
            bio: bio
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                alert('Bio updated successfully')
                console.log(response.data.success);
            }
        })
    };

    const editBirthdate = () => {
        Axios.put('http://localhost:3001/profile/about/birthdate', {
            birthdate: birthdate
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                alert('Birthday updated successfully')
                console.log(response.data.success);
            }
        })
    };

    const editLocation = () => {
        Axios.put('http://localhost:3001/profile/about/location', {
            location: location
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                alert('Location updated successfully')
                console.log(response.data.success);
            }
        })
    };

    const editPhone = () => {
        Axios.put('http://localhost:3001/profile/about/phone', {
            phone: phone
        }).then((response) => {
            if (!response.data.success) {
                alert(response.data.msg);
            } else {
                alert('Phone updated successfully')
                console.log(response.data.success);
            }
        })
    };

    const handleBioChange = (e) => {
        setBio(e.target.value)
    }

    const handleBirthdateChange = (e) => {
        setBirthdate(e.target.value)
    }

    const handleLocationChange = (e) => {
        setLocation(e.target.value)
    }

    const handlePhoneChange = (e) => {
        setPhone(e.target.value)
    }

    const handleBack = () => {
        history.goBack();
    }

    const BioButton = () => <button id="bioBtn" onClick={editBio}>Save</button>;
    const BirthdayButton = () => <button id="birthdayBtn" onClick={editBirthdate}>Save</button>;
    const LocationButton = () => <button id="locationBtn" onClick={editLocation}>Save</button>;
    const PhoneButton = () => <button id="phoneBtn" onClick={editPhone}>Save</button>;

    let value = !showElement ? "Edit About" : "Done";

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }


    return ( //Bio is visible to all, other fields visible to profile owner/friends only, editing is only for the profile owner
    <div className="content">
        <h2>About</h2>
        <ul>
            <li>Bio: {showElement ? null : bio}
                {showElement && isProfileOwner ? <input
                    type="text"
                    id="bio"
                    value={bio ? bio : ""}
                    onChange={handleBioChange}
                /> : null}
                {showElement && isProfileOwner ? <BioButton /> : null}
            </li>
            {isProfileOwner || isFriend ?
            <li>Birthday: {showElement ? null : birthdate}
                {showElement && isProfileOwner ? <input
                    type="text"
                    id="birthdate"
                    value={birthdate ? birthdate : ""}
                    onChange={handleBirthdateChange}
                /> : null}
                {showElement && isProfileOwner ? <BirthdayButton /> : null}
            </li> : null}
            {isProfileOwner || isFriend ?
            <li>Location: {showElement ? null : location}
                {showElement && isProfileOwner ? <input
                    type="text"
                    id="location"
                    value={location ? location : ""}
                    onChange={handleLocationChange}
                /> : null}
                {showElement ? <LocationButton /> : null}
            </li> : null}
            {isProfileOwner || isFriend ?
            <li>Phone: {showElement ? null : phone}
                {showElement&& isProfileOwner ? <input
                    type="text"
                    id="phone"
                    value={phone ? phone : ""}
                    onChange={handlePhoneChange}
                /> : null}
                {showElement && isProfileOwner ? <PhoneButton /> : null}
            </li> : null}
        </ul>
        <div>
            {isProfileOwner ? <button onClick={onClick}>{value}</button> : null}
        </div>
        <div>
            <button onClick={handleBack}>Back</button>
        </div>
    </div>);
}

export default About