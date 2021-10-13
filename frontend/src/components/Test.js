import { useEffect, useState, useContext } from 'react';
import AuthContext from '../states/AuthContext';
import { useHistory } from 'react-router';
import '../css/App.css';
import AuthService from '../auth/AuthService';
import Axios from './axios';
import { useLocation } from 'react-router-dom';

function Test({fetchUrl}) {
    const [incomingRequests, setIncomingRequests] = useState([]);
    const [incomingRequestsRoutes, setIncomingRequestsRoutes] = useState([]);
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        async function fetchData() {
            console.log(fetchUrl);
            const req = await Axios.get(fetchUrl);
            setIncomingRequests(req.data.incomingRequests[0]);
            setIncomingRequestsRoutes(req.data.incomingRequestsRoutes[0]);
            setCounter(incomingRequests.length);
            return req;
        }
        fetchData();
    }, [fetchUrl]);
    
    return (
        <>
            <div className="content">
                <h2>{fetchUrl}</h2>
                {incomingRequestsRoutes} {incomingRequests} {counter}
                
            </div>
        </>
    )
}

export default Test


// let history = useHistory();
// const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
// const { profileDummy, setProfileDummy } = useContext(AuthContext);
// const { user, setUser } = useContext(AuthContext);
// const [name, setName] = useState("");



// if (!isLoggedIn) {
//     return (
//         <AuthService />
//     )
// }