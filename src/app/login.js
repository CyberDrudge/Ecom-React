import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import Error from './error'

class Login extends Component {
	constructor(props) {
		super(props)
		this.state = { isLoggingIn: false, authFailed: false, email: "", password: "" }
	}

	handleOnChange = (e) => {
		e.persist();
		this.setState(() => ({
			[e.target.name]: e.target.value 
		}))
	}

	onSubmit = (e) => {
		const { actions, history } = this.props
		e.preventDefault()
		actions.logIn(this.state)
			.then(res => {
				if (res.data.type == "success") {
					this.setState({isLoggingIn: false})
					history.push({pathname: "/"})
				} else {
					this.setState({authFailed: true, isLoggingIn: false})
				}
			})
	}

	render() {
		const { isLoggingIn, authFailed } = this.state
		return (
			<div className="container login-text">
			{ authFailed && <Error message={"Authentication Failed"} /> }
				<div className="login-header">
					<h2 className="float-left my-0">LOGIN</h2>
					<Link className="float-right create-account" to="register"> Create Account </Link>
				</div>
				<form className="login-form" onSubmit={this.onSubmit}>
					<input className="form-control" type="email" name="email"
						placeholder="Official Email" value={this.state.email} onChange={this.handleOnChange} />
					<input name="password" className="form-control" type="password" required
						placeholder="Password" value={this.state.password} onChange={this.handleOnChange} />
					<div className="my-1">
						<input type="checkbox" />
						<span className="keep-logged-in"> Keep me logged in </span>
					</div>
					<button type="submit">
						{ isLoggingIn && <span if="isLoggingIn"><img className="auth_loader" src="./assets/gifs/loader2.gif" /></span>}
						<span>Login</span>
					</button>
				</form>
				<div className="mt-20 text-right">
					<span className="warning">Forgot password?</span>
				</div>
			</div>
		)
	}

	handleClick(event) {
		const email = this.refs.email
		const password = this.refs.password
		const creds = { email: email.value.trim(), password: password.value.trim() }
		this.props.onLoginClick(creds)
	}
}

Login.propTypes = {
	onLoginClick: PropTypes.func,
	errorMessage: PropTypes.string
}


const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(Login)
