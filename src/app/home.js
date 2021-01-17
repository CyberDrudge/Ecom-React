'use strict'
import React from 'react'
import logo from './../logo.svg';
import './../App.css';

class Home extends React.Component {
	render() {
		const { history } = this.props
		history.push({
			pathname: "products"
		})
		return (
			<div className="App">
				<header className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
				<a
				className="App-link"
				href="https://reactjs.org"
				target="_blank"
				rel="noopener noreferrer"
				>
					Learn React
				</a>
				</header>
			</div>
		)
	}
}

export default Home