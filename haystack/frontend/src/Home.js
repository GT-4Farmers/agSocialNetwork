import React from 'react'
import UserStore from './stores/UserStore';

export default function Home() {
    return (
        <div className='home'>
            Welcome {UserStore.email}
            Home news feed will be displayed here.
        </div>
    )
}
