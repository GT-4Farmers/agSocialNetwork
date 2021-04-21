import React from 'react'
import UserStore from './stores/UserStore';

export default function Profile() {
    return (
        <div className='profile'>

            🚀🚀🚀🌕 Profile for {UserStore.email}
        </div>
    )
}
