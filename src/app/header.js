import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import BellNotifications from './notifications/bell_notifications'

const BELL = 1

class Header extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = { display: ["none", "block"] }
		this.dropdownStyle = this.dropdownStyle.bind(this)
	}

	logout() {
		const { actions } = this.props
		console.log("Logout")
		actions.logOut()
	}

	toggle(key) {
		const { display } = this.state
		let _display
		// display.reverse() directly mutates the state
		if (display[0] === 'none') {
			_display = ['block', 'none']
		} else {
			_display = ['none', 'block']
		}
		this.setState({ display: _display, key: key})
		document.addEventListener("click", this.hide)
	}
	dropdownStyle(_key) {
		const { key, display } = this.state
		if (_key === key) {
			return { display: display[0], zIndex: '100000' }
		} else {
			return { display: "none", zIndex: '100000' }
		}
	}

	displayNotifications() {
		const { notifications } = this.props
		console.log("HEADER", notifications)
		return notifications.map((notice) => {
			return <BellNotifications notification={notice} read=""/>
		})
	}

	render() {
		const { isLoggedIn, notifications } = this.props
		let unread  = notifications.length
		return (<nav className="navbar navbar-expand-sm navbar-light bg-secondary">
			<a className="navbar-brand" href="/">ECom</a>
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
				<span className="navbar-toggler-icon"></span>
			</button>
			<div className="collapse navbar-collapse" id="navbarSupportedContent">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<a className="nav-link" >Home <span className="sr-only">(current)</span></a>
					</li>
					<li className="nav-item ">
						<Link className="nav-link" to="/products">Products</Link>
					</li>
					<li className="nav-item ">
						<Link className="nav-link" to="/cart">
							<span className='navbar-cart-count'></span> Cart
						</Link>
					</li>
				</ul>

				{ isLoggedIn ? <ul className="navbar-nav account-wrap v-center">
					{false && <li key="bell" className="nav-item dropdown">
						<div className="nav-link">
							<i className="mdi mdi-bell-outline" onClick={ this.toggle.bind(this, BELL) }>
								<span style={{position:'absolute'}}>
									{ unread > 0 ? <span className="bv-notification-count">{ unread }</span> : null }
								</span>
							</i>
						</div>
						<div className="bv-notification-dropdown bv-dropdown-show" style={this.dropdownStyle(BELL)}>
							<ul className="p-0">
								{ this.displayNotifications() }
							</ul>
							<div id="bv-mark-all-read" className="bv-mark-all-button">
								<a style={{color: "#fff"}}>
									Mark all as read
								</a>
							</div>
						</div>
					</li>}
					<li className="nav-item dropdown">
						<div className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Account 
						</div>
						<div className="dropdown-menu account-wrap" aria-labelledby="navbarDropdown">
							<a className="dropdown-item">Home</a>
							<a className="dropdown-item">Billing</a>
							<a className="dropdown-item">Preferences</a>
							<a className="dropdown-item">History</a>
							<div className="dropdown-divider"></div>
							<a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
						</div>
					</li>
				</ul> : <ul className="navbar-nav navbar-right">
					<li className="nav-item">
						<Link className="nav-link" to="login">Login</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link" to="register">Register</Link>
					</li>
				</ul> }
			</div>
		</nav>)
	}
}

Header.propTypes = {
	actions: PropTypes.object,
	history: PropTypes.object,
}

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn
	}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
