import { useState, useEffect, useContext } from 'react';
import Axios from 'axios';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthContext from '../states/AuthContext';
import AuthService from '../auth/AuthService';
import { Link } from "react-router-dom";

function Photos() {
    const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    const history = useHistory();
    const [photos, setPhotos] = useState([]);
    let profileRoute = (window.location.pathname).substring(1)
    var pathArray = profileRoute.split('/');
    profileRoute = (pathArray[0]);

    useEffect(() => {
        async function fetchData() {
            const res = await Axios.post("http://localhost:3001/profile/photos", {
                profileRoute: profileRoute
            })
            if (res.data.success) {
                setPhotos(res.data.photos)
            }
        }
        fetchData();

        // unmount cleanup
        // return () => { 
        //     setFriendListRoutes([]);
        //     setFriendList([]);
        // };
    }, []);

    if (!isLoggedIn) {
        return (
            <AuthService />
        )
    }

    return (
        <div className="content">
            <div>
                <h2> Photos </h2>
            </div>
            <div>
                <button onClick={() => {history.goBack()}}>Back</button>
            </div>
            <div className="block">
            {(!(photos.length === 0)) ? photos.map((val, key) => {
                return(
                    <div className="greyBox">
                        <img src={val} alt="Cannot Display Image" />
                        {/* <Link className="link" key={key} to={`/${friendListRoutes[key]}`}>
                            {val}
                        </Link> */}
                    </div>
                )
            }) : <div>User has no photos... :(</div>}
            </div>
        </div>
    )
}

export default Photos; 