import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {fetchUser} from './actioncreators'
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
				if (res.type == "success") {
					this.setState({isLoggingIn: false})
					history.push({pathname: "/"})
				} else {
					this.setState({authFailed: true, isLoggingIn: false})
				}
			})
	}

	render() {
		const { errorMessage } = this.props
		const { isLoggingIn, authFailed } = this.state
		return (
			<div class="container">
			{ authFailed && <Error message={"Authentication Failed"} /> }
				<div class="login-header">
					<h2 class="float-left my-0">LOGIN</h2>
					<div class="float-right create-account" routerLink="/register" routerLinkActive="active"> Create Account </div>
				</div>
				<form onSubmit={this.onSubmit}>
					<input className="form-control" type="email" name="email"
						placeholder="Official Email" value={this.state.email} onChange={this.handleOnChange} />
					<input name="password" className="form-control" type="password" required
						placeholder="Password" value={this.state.password} onChange={this.handleOnChange} />
					<div class="my-1">
						<input type="checkbox" />
						<span class="sub-title"> Keep me logged in </span>
					</div>
					<button type="submit">
						{ isLoggingIn && <span if="isLoggingIn"><img class="auth_loader" src="./assets/gifs/loader2.gif" /></span>}
						<span>Login</span>
					</button>
				</form>
				<div class="mt-20 text-right secondary">
					<span class="warning">Forgot password?</span>
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
	onLoginClick: PropTypes.func.isRequired,
	errorMessage: PropTypes.string
}


const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(Login)
