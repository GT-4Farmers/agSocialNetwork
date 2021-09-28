import React, { useState } from 'react'
import Axios from 'axios';


function Test() {
    const [stuff, setStuff] = useState("");

    async function fetchTest() {
        try {
            const res = await Axios.get("http://localhost:3000/login");
            console.log(res.data.email);
            return(res.data.email);
        } catch (err) {
            console.log(err);
            return err;
        }
    }
    
    return (
        <div>
            <h1>Test</h1>
            {fetchTest()}
        </div>
    )
}

export default Test
