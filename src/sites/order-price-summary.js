import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'
import Coupon from './coupon'

class OrderPriceSummary extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { actions, cart } = this.props
		let order = cart.toJS()
		return (<div className="col-sm-4 mb-4">
			<ul className="list-group mb-3 z-depth-1 order-price-summary">
				<li className="list-group-item d-flex justify-content-between lh-condensed">
					<div><h6 className="my-0 subtext">Cart Total</h6></div>
					<span>{ order.subtotal }</span>
				</li>
				<li className="list-group-item d-flex justify-content-between lh-condensed">
					<div><h6 className="my-0 subtext">Delivery Charge</h6></div>
					<span>+{ order.delivery_charge }</span>
				</li>
				{order.coupon && <li className="list-group-item d-flex justify-content-between bg-light">
					<div className="text-success">
						<h6 className="my-0 subtext">Promo code</h6>
						<small>{ order.coupon.code }</small>
					</div>
					<span className="text-success">-{ order.coupon.amount || 0 }</span>
				</li>}
				<li className="list-group-item d-flex justify-content-between">
					<span className="subtext">Total</span>
					<strong>{ order.total }</strong>
				</li>
			/ul>
			<Coupon actions={actions} />
		</div>)
	}
}

OrderPriceSummary.propTypes = {
	cart: PropTypes.object
}

const mapStateToProps = (state) => {
	return {
		cart: state.cart
	}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(OrderPriceSummary)
