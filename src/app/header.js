import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from './../app/actioncreators'

class Header extends React.PureComponent {
	constructor(props) {
		super(props)
		this.state = { display: ["none", "block"] }
	}

	logout() {
		const { actions } = this.props
		actions.logOut()
	}

	render() {
		const { isLoggedIn } = this.props
		console.log(isLoggedIn, "HEADERS")
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
				<ul className="navbar-nav account-wrap">
					<li className="nav-item dropdown">
						<div className="nav-link dropdown-toggle account-drop" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
							Account 
						</div>
						<div className="dropdown-menu" aria-labelledby="navbarDropdown">
							<a className="dropdown-item">Home</a>
							<a className="dropdown-item">Billing</a>
							<a className="dropdown-item">Preferences</a>
							<a className="dropdown-item">History</a>
							<div className="dropdown-divider"></div>
							<a className="dropdown-item" onClick={this.logout.bind(this)}>Logout</a>
						</div>
					</li>
				</ul>
				{ !isLoggedIn && <ul className="navbar-nav navbar-right">
					<li className="nav-item">
						<a className="nav-link" href="/login">Login</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="/register">Register</a>
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
