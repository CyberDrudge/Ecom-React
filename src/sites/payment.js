import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, injectStripe, useElements, useStripe} from '@stripe/react-stripe-js';
import * as actionCreators from './../app/actioncreators'
import { request } from 'axios'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Loading from '../app/loader'
import { useDispatch } from "react-redux";

const PaymentForm = (props) => {
	return (<div>
		<Elements stripe={stripePromise}>
			<CheckoutFormZZ  props={props}/>
		</Elements>
	</div>)
}

const CARD_OPTIONS = {
	iconStyle: 'solid',
	style: {
		base: {
			iconColor: '#c4f0ff',
			color: '#fff',
			fontWeight: 500,
			fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
			fontSize: '16px',
			fontSmoothing: 'antialiased',
			':-webkit-autofill': {
				color: '#fce883',
			},
			'::placeholder': {
				color: '#87bbfd',
			},
		},
		invalid: {
			iconColor: '#ffc7ee',
			color: '#ffc7ee',
		},
	},
}

const SubmitButton = ({processing, error, children, disabled}) => (
	<button
		className='btn btn-primary'
		type="submit"
		disabled={processing || disabled}
	>
		{processing ? 'Processing...' : children}
	</button>
)

const ErrorMessage = ({children}) => (
	<div className="ErrorMessage" role="alert">
		<svg width="16" height="16" viewBox="0 0 17 17">
			<path
				fill="#FFF"
				d="M8.5,17 C3.80557963,17 0,13.1944204 0,8.5 C0,3.80557963 3.80557963,0 8.5,0 C13.1944204,0 17,3.80557963 17,8.5 C17,13.1944204 13.1944204,17 8.5,17 Z"
			/>
			<path
				fill="#6772e5"
				d="M8.5,7.29791847 L6.12604076,4.92395924 C5.79409512,4.59201359 5.25590488,4.59201359 4.92395924,4.92395924 C4.59201359,5.25590488 4.59201359,5.79409512 4.92395924,6.12604076 L7.29791847,8.5 L4.92395924,10.8739592 C4.59201359,11.2059049 4.59201359,11.7440951 4.92395924,12.0760408 C5.25590488,12.4079864 5.79409512,12.4079864 6.12604076,12.0760408 L8.5,9.70208153 L10.8739592,12.0760408 C11.2059049,12.4079864 11.7440951,12.4079864 12.0760408,12.0760408 C12.4079864,11.7440951 12.4079864,11.2059049 12.0760408,10.8739592 L9.70208153,8.5 L12.0760408,6.12604076 C12.4079864,5.79409512 12.4079864,5.25590488 12.0760408,4.92395924 C11.7440951,4.59201359 11.2059049,4.59201359 10.8739592,4.92395924 L8.5,7.29791847 L8.5,7.29791847 Z"
			/>
		</svg>
		{children}
	</div>
)

const CheckoutForm = (props) => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState(null);
	const [cardComplete, setCardComplete] = useState(false);
	const [processing, setProcessing] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!stripe || !elements) {
			// Stripe.js has not loaded yet. Make sure to disable
			// form submission until Stripe.js has loaded.
			return;
		}

		if (error) {
			elements.getElement('card').focus();
			return;
		}

		if (cardComplete) {
			setProcessing(true);
		}
		let cart_id = JSON.parse(localStorage.getItem('cart_id'))
		let billing_address_id = JSON.parse(localStorage.getItem('billing_address') || "null")
		let shipping_address_id = JSON.parse(localStorage.getItem('shipping_address') || "null")
		const card = elements.getElement(CardElement)
		const result = await stripe.createToken(card)
		if (result.error) {
			console.log(result.error.message)
		} else {
			console.log(result.token)
			let context = {
					'cart_id': cart_id,
					'billing_address_id': billing_address_id,
					'shipping_address_id': shipping_address_id,
					'token': result.token
			}
			props.props.placeOrder(context)
					.then(res => {
							let response = res.data
							// this.setState({ loading: false,  isCheckoutDone: true})
							console.log("SSSSS")
							setProcessing(false)
							props.props.history.push({pathname: "/order-placed"})
							// actions.checkout()
					})
					.catch(() => {
							// this.setState({loading:false, error:<Error message="Failed to load sites. Please refresh this page or Contact us."/>})
							// this.setState({loading:false})
							console.log("ERR")
							setProcessing(false)
							setError(result.error)
					})
		}
	}

	return (
		<form className="Form" onSubmit={handleSubmit}>
			<fieldset className="FormGroup">
				<CardElement options={CARD_OPTIONS}
					onChange={(e) => {
						setError(e.error);
						setCardComplete(e.complete);
					}}
				/>
			</fieldset>
			{error && <ErrorMessage>{error.message}</ErrorMessage>}
			<SubmitButton processing={processing} error={error} disabled={!stripe}>
				Purchase
			</SubmitButton>
		</form>
	)
}


const stripePromise = loadStripe('pk_test_5M7DOJHCemkDXjUwGQJfMLeQ00WYWfu1kq');


const CheckoutFormZZ = connect(null, null)(CheckoutForm);

export default PaymentForm
