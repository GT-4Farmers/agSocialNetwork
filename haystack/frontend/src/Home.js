import React from 'react'
import UserStore from './stores/UserStore';

class Home extends React.Component {
	render() {
		return (
			<div className='home'>
				Welcome {UserStore.email}
			</div>
		)
	}
}

export default Home;