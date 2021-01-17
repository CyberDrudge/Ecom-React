import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import {connect} from 'react-redux'
import {fetchUser} from './actioncreators'
import * as actionCreators from './../app/actioncreators'
import Error from './error'

class Register extends Component {
	constructor(props) {
		super(props)
		this.state = { loading: false, authFailed: false }
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
		actions.signUserUp(this.state)
			.then(res => {
				if (res.type == "success") {
					this.setState({loading: false, authFailed: false})
					history.push({pathname: "/login"})
				} else {
					this.setState({authFailed: true, loading: false})
				}
			})
	}

	render() {
		const { errorMessage } = this.props
		const { loading, authFailed, submitted, invalid } = this.state
		return (
			<div className="container">
			{ authFailed && <Error message={"Registration Failed."} /> }
				<div className="register-header">
					<h2 className="float-left my-0">REGISTER</h2>
				</div>
				<form onSubmit={this.onSubmit}>
					<input className="form-control" type="text" name="name"
						placeholder="Full Name" value={this.state.name} onChange={this.handleOnChange} />
					<input className="form-control" type="email" name="email"
						placeholder="Official Email" value={this.state.email} onChange={this.handleOnChange} />
					<input className="form-control" type="password" name="password1" required
						placeholder="Password" value={this.state.password} onChange={this.handleOnChange} />
					<input className="form-control" type="password" name="password2" required
						placeholder="Password" value={this.state.confirm_password} onChange={this.handleOnChange} />
					<button className="my-1" type="submit">
						{ loading && <span><img className="auth_loader" src="./assets/gifs/loader2.gif" /></span>}
						<span>Sign Up</span>
					</button>
				</form>
			    { submitted && invalid && <div class="mt-20 text-right secondary">
			        <p class="color-error animated slideInUp">Invalid details!</p>
			    </div>}
			</div>
		)
	}
}

Register.propTypes = {
	errorMessage: PropTypes.string
}


const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(Register)
