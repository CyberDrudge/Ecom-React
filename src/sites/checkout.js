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
import {stringifyAddress} from '../app/helper'
import TrimString from '../app/trimstring'
import OrderPriceSummary from './order-price-summary'

class Checkout extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, checkoutDetails: {}, isCheckoutDone: false}
		this.loadCheckoutDetails = this.loadCheckoutDetails.bind(this)
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

	displayCheckoutDone() {
		return (<div>
			<div class="col-6 mx-auto py-5 text-center">
				<h1 class="display-1">Thank you for ordering!!!</h1>
			</div>
		</div>)
	}

	displayCartItems() {
		const { checkoutDetails } = this.state
		let cartItems = (checkoutDetails && checkoutDetails.cart.items) || []
		let rows = []
		cartItems.forEach((item, index) => {
			let imageSrc = `http://localhost:8000${item.product.image}`
			rows.push(<li className="align-left mb-20">
				{ item.quantity } x <img src={imageSrc} className="checkout-product-image" alt="No Image Available" /> <TrimString string={item.product.title} length={40} /> 
			</li>)
		})
		return rows
	}
	displayCheckout() {
		const { checkoutDetails } = this.state
		const { actions, history } = this.props
		return (<div class="checkout-container">
			<div class="info-2">Complete Your Order</div>
			<div className="row">
				<div className="col-sm-8">
					<div class="info-1-5 my-3 checkout align-left mb-20">
						<div>Cart Items: </div>
						<div class="info-1-25 checkout-cart-item">
							<ol>
								{ this.displayCartItems() }
							</ol>
						</div>

						<div class="checkout-address">Shipping Address: </div>
						<div class="checkout-value align-left">{ stringifyAddress(checkoutDetails.shipping_address) }</div>
						
						<div class="checkout-address">Billing Address: </div>
						<div class="checkout-value align-left">{ stringifyAddress(checkoutDetails.billing_address) }</div>

						<div>Order Total: </div>
						<div class="checkout-value align-left">{ checkoutDetails.cart.total }</div>
					</div>
					<PaymentForm placeOrder={actions.placeOrder} history={history} />
					{false && <button class='btn btn-primary' onClick={this.purchase}>Purchase</button> }
				</div>
				<OrderPriceSummary />
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