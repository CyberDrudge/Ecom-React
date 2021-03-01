import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Link, withRouter } from 'react-router-dom'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'
import PaymentForm from './payment'
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {injectStripe} from '@stripe/react-stripe-js';

class Checkout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, checkoutDetails: {}, isCheckoutDone: false}
		this.loadCheckoutDetails = this.loadCheckoutDetails.bind(this)
		this.purchase = this.purchase.bind(this)
	}

	componentDidMount() {
		this.loadCheckoutDetails()
	}

	loadCheckoutDetails() {
		const { loading } = this.state
		const { actions, history, isLoggedIn} = this.props
		let cart_id = JSON.parse(localStorage.getItem('cart_id'));
		let billing_address_id = JSON.parse(localStorage.getItem('billing_address') || "null");
		let shipping_address_id = JSON.parse(localStorage.getItem('shipping_address') || "null");
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		if (!isLoggedIn) {
			history.push({pathname: "/login"})
			this.setState({loading: false})
		} else if (shipping_address_id == null || billing_address_id == null) {
			history.push({pathname: "/address"})
			this.setState({loading: false})
		} else {
			let context = {
				'cart_id': cart_id,
				'billing_address_id': billing_address_id,
				'shipping_address_id': shipping_address_id
			}
			actions.getCheckoutDetails(context)
				.then(res => {
					let response = res.data
					this.setState({ loading: false,  checkoutDetails: response.data})
				})
				.catch(() => {
					// this.setState({loading:false, error:<Error message="Failed to load sites. Please refresh this page or Contact us."/>})
					this.setState({loading:false})
				})
		}
	}

	purchase() {
		const { loading } = this.state
		const { actions, history, isLoggedIn} = this.props
		let cart_id = JSON.parse(localStorage.getItem('cart_id'));
		let billing_address_id = JSON.parse(localStorage.getItem('billing_address') || "null");
		let shipping_address_id = JSON.parse(localStorage.getItem('shipping_address') || "null");
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		if (!isLoggedIn) {
			history.push({pathname: "/login"})
			this.setState({loading: false})
		} else if (shipping_address_id == null || billing_address_id == null) {
			history.push({pathname: "/address"})
			this.setState({loading: false})
		} else {
			let context = {
				'cart_id': cart_id,
				'billing_address_id': billing_address_id,
				'shipping_address_id': shipping_address_id
			}
			actions.placeOrder(context)
				.then(res => {
					let response = res.data
					this.setState({ loading: false,  isCheckoutDone: true})
					// actions.checkout()
				})
				.catch(() => {
					// this.setState({loading:false, error:<Error message="Failed to load sites. Please refresh this page or Contact us."/>})
					this.setState({loading:false})
				})
		}
	}

	displayCheckoutDone() {
		return (<div>
			<div class="col-6 mx-auto py-5 text-center">
				<h1 class="display-1">Thank you for ordering!!!</h1>
			</div>
		</div>)
		// return PaymentForm()
	}

	displayCartItems() {
		const { checkoutDetails } = this.state
		let cartItems = (checkoutDetails && checkoutDetails.cart.products) || []
		let rows = []
		cartItems.forEach((item, index) => {
			rows.push(<li>
				{ item.title }
			</li>)
		})
		return rows
	}
	displayCheckout() {
		const { checkoutDetails } = this.state
		const { actions } = this.props
		return (<div>
			<div class="container">
				<div class="info-2">Finalize Checkout</div>
				<div class="info-1-5 my-3 checkout">
					<div>Cart Items: </div>
					<div class="checkout-value checkout-cart-item">
						<ol>
						{ this.displayCartItems() }
						</ol>
					</div>

					<div class="checkout-address">Shipping Address: </div>
					<div class="checkout-value">{ checkoutDetails.shipping_address?.address_line1 }</div>
					
					<div class="checkout-address">Billing Address: </div>
					<div class="checkout-value">{ checkoutDetails.shipping_address?.address_line1 }</div>

					<div>Cart Total: </div>
					<div class="checkout-value">{ checkoutDetails.cart.total }</div>

					<div>Shipping Total: </div>
					<div class="checkout-value">{ checkoutDetails.shipping_total }</div>

					<div>Order Total: </div>
					<div class="checkout-value">{ checkoutDetails.total }</div>
				</div>
				<PaymentForm placeOrder={actions.placeOrder} />
				{false && <button class='btn btn-primary' onClick={this.purchase}>Purchase</button> }
			</div>
		</div>)
	}

	render() {
		const { loading, isCheckoutDone } = this.state
		return (
			<div className="container">
				{ loading ? <Loading /> : <div className="row my-2">
					{ isCheckoutDone ? this.displayCheckoutDone() : this.displayCheckout() }
				</div> }
			</div>
		)
	}
}

Checkout.propTypes = {
	cart: PropTypes.object
}

const CheckoutWithRouter = withRouter(Checkout)

const mapStateToProps = (state) => {
	return {
		isLoggedIn: state.isLoggedIn
	}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CheckoutWithRouter)