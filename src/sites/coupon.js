import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'

class Coupon extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, isCartEmpty: true, couponCode: ""}
	}

	handleOnChange = (e) => {
		e.persist();
		this.setState(() => ({
			[e.target.name]: e.target.value 
		}))
	}

	onSubmit = (e) => {
		e.preventDefault()
		const { actions } = this.props
		console.log(this.state.couponCode)
		actions.applyCoupon({code: this.state.couponCode})
			.then(res => {
				if (res.type == "success") {
					console.log(res)
					this.setState({loading: false})
				} else {
					this.setState({loading: false})
				}
			})
	}

	render() {
		const { loading, isCartEmpty } = this.state
		return (
			<div className="col-sm-4">
				<form className="p-2" onSubmit={this.onSubmit}>
					<div className="input-group">
						<input className="form-control form-input" id="name" formControlName="name" value={this.state.couponCode} name="couponCode" onChange={this.handleOnChange}/>
						<div className="input-group-append">
						<button className="btn btn-secondary btn-md waves-effect mt-10" type="submit">Redeem</button>
						</div>
					</div>
				</form>
			</div>
		)
	}
}

Coupon.propTypes = {
	Coupon: PropTypes.object
}

const CouponWithRouter = withRouter(Coupon)

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn
	}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, null, mergeProps)(CouponWithRouter)