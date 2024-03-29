import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory, useParams } from 'react-router';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import defaultProfilePic from './defaultProfilePic.jpg';

function About() {
    const { isLoggedIn } = useContext(AuthContext);

    const history = useHistory();
    let {uid} = useParams();
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [bio, setBio] = useState("");
    const [birthdate, setBirthdate] = useState("");
    const [location, setLocation] = useState("");
    const [phone, setPhone] = useState("");
    const [showElement, setShowText] = useState(false);
    const [isProfileOwner, setIsProfileOwner] = useState(false)
    const [isFriend, setIsFriend] = useState(false)
    const [saveChanges, setSaveChanges] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/about", {
                profileRoute: uid
            })
            setProfilePicture(res.data.profilePicture);
            setPhone(res.data.phone);
            setEmail(res.data.email)
            setBio(res.data.bio);
            setBirthdate(res.data.birthdate);
            setLocation(res.data.location);
        }
        fetchData();
        // return () => {
        //     setEmail("")
        //     setBio("");
        //     setBirthdate("");
        //     setLocation("");
        //     setPhone("");
        // }
    }, [uid]);

    useEffect(() => {
        async function fetchMoreData() {
            const resTwo = await Axios.post("http://localhost:3001/profile/uuidIsUserOrFriend", {
                profileRoute: uid
            })
            if (resTwo.data.success) {
                setIsProfileOwner(resTwo.data.isUser)
                setIsFriend(resTwo.data.isFriend)
            } else {
                alert(resTwo.data.msg)
            }
        }
        fetchMoreData();

        // return () => {
        //     setIsProfileOwner(false);
        //     setIsFriend(false);
        // }
    }, [uid]);

    const editProfilePicture = () => {
        async function fetchData() {
            let image_loc = ""
            if (profilePicture) {
                let formData = new FormData();
                formData.append("images", profilePicture);
                let url = "http://localhost:3001/profile/imageUpload/"
                const res = await Axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    }
                }).then((response) => {
                    return response;
                });
                if (!res.data.success) {
                    alert(res.data.msg);
                } else {
                    image_loc = res.data.image_locs
                }
                // console.log(res)
            }
            const res = await Axios.put('http://localhost:3001/profile/about/profilePicture', {
                profilePicture: image_loc
            })
        }
        fetchData();
    };

    const editBio = () => {
        async function fetchData() {
            const res = await Axios.put('http://localhost:3001/profile/about/bio', {
                bio: bio
            });
        }
        fetchData();
    };

    const editBirthdate = () => {
        async function fetchData() {
            const res = await Axios.put('http://localhost:3001/profile/about/birthdate', {
                birthdate: birthdate
            });
        }
        fetchData();
    };

    const editLocation = () => {
        async function fetchData() {
            const res = await Axios.put('http://localhost:3001/profile/about/location', {
                location: location
            });
        }
        fetchData();
    };

    const editPhone = () => {
        async function fetchData() {
            const res = Axios.put('http://localhost:3001/profile/about/phone', {
                phone: phone
            });
        }
        fetchData();
    };

    const handleButton = () => {
        if (profilePicture.name) {
            editProfilePicture();
        }
        editBio();
        editBirthdate();
        editLocation();
        editPhone();
        setSaveChanges(true);
    }

    const SaveButton = () =>
        <button onClick={handleButton}>
            {saveChanges ? "Changes saved" : "Save Changes"}
        </button>;

    let value = !showElement ? "Edit About" : "Done";

    // referred to on line 170
    const onClick = () => {
        setShowText(!showElement);
        setSaveChanges(false);
    }

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return ( //Bio is visible to all, other fields visible to profile owner/friends only, editing is only for the profile owner
    <div className="content">
        <h2>About</h2>
        <div className="column">
        {showElement ? null : <img className="bioPic" src={profilePicture ? profilePicture : defaultProfilePic} alt="Could not display image" />}
                {showElement && isProfileOwner ? <div className="imageInput">
                {/* <label for="post_img">
                    <FcAddImage id="icon" size={40}/>
                </label> */}

                <input 
                    type="file"
                    accept="image/*"
                    id="post_img"
                    // placeholder="Upload Image"
                    onChange={(e) => { setProfilePicture(e.target.files[0]) }}
                />
                </div> : null}
                {/* {showElement && isProfileOwner ? <BioButton /> : null} */}
            <ul className="greyBox">
                <li><p><b>Bio:</b> {showElement ? null : bio}
                    {showElement && isProfileOwner ? <input
                        type="text"
                        id="bio"
                        value={bio ? bio : ""}
                        onChange={(e) => { setBio(e.target.value)}}
                    /> : null}
                    {/* {showElement && isProfileOwner ? <BioButton /> : null} */}
                </p></li>
                {isProfileOwner || isFriend ?
                <li><p><b>Birthday:</b> {showElement ? null : birthdate}
                    {showElement && isProfileOwner ? <input
                        type="text"
                        id="birthdate"
                        value={birthdate ? birthdate : ""}
                        onChange={(e) => {setBirthdate(e.target.value)}}
                    /> : null}
                    {/* {showElement && isProfileOwner ? <BirthdayButton /> : null} */}
                </p></li> : null}
                {isProfileOwner || isFriend ?
                <li><p><b>Location:</b> {showElement ? null : location}
                    {showElement && isProfileOwner ? <input
                        type="text"
                        id="location"
                        value={location ? location : ""}
                        onChange={(e) => {setLocation(e.target.value)}}
                    /> : null}
                    {/* {showElement ? <LocationButton /> : null} */}
                </p></li> : null}
                {isProfileOwner || isFriend ?
                <li><p><b>Phone:</b> {showElement ? null : phone}
                    {showElement&& isProfileOwner ? <input
                        type="text"
                        id="phone"
                        value={phone ? phone : ""}
                        onChange={(e) => {setPhone(e.target.value)}}
                    /> : null}
                    {/* {showElement && isProfileOwner ? <PhoneButton /> : null} */}
                </p></li> : null}
            <div>
                {showElement && isProfileOwner ? <SaveButton /> : null}
            </div>
            </ul>
        </div>

        <div>
            {isProfileOwner ? <button onClick={onClick}>{value}</button> : null}
        </div>
        <div>
            <button onClick={() => {history.goBack()}}>Back</button>
        </div>
    </div>);
}

export default About