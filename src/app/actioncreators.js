import { request } from 'axios'
import * as action from "./actions"


const requestApi = (params) => {
	// let token = ""
	// let element = document.getElementsByName("csrf-token")[0]
	// if (element) {
	// 	token = element.content
	// }
	const urlRoot = (params.urlRoot || "https://cyber-ecom.herokuapp.com")
	const method = params.method
	const url = `${urlRoot}${params.path}`
	const responseType = (params.responseType || 'json')
	let token = localStorage.getItem("token")
	const headers = params.headers || (token && {'Authorization': `Bearer ${token}`})

	const requestParams = { method, url, responseType, headers }

	// `data` is the data to be sent as the request body
	// Only applicable for request methods 'PUT', 'POST', and 'PATCH'
	// When no `transformRequest` is set, must be a string, an ArrayBuffer or a hash
	if (params.data) requestParams.data = params.data

	// `param` are the URL parameters to be sent with the request
	if (params.params) requestParams.params = params.params

	return request(requestParams)
}

export function getProductList(params = {}) {
	return function (dispatch) {
		return requestApi({
			method : 'GET',
			path : '/products/',
			params : params
		})
	}
}

const getCartItems = (params = {})=>{
	return requestApi({
		method : 'POST',
		path   : '/cart/',
		data  : params
	})
}

export function getCart(params = {}) {
	return function(dispatch){
		let cart_id = localStorage.getItem('cart_id')
		return getCartItems({'cart_id': cart_id})
			.then(res => {
				let response = res.data
				let cart = response.data
				if (response.type == "success") {
					dispatch({type: action.SET_CART, data: cart})
					return response
				}
			})
	}
}

export function updateCart(params={}) {
	return function(dispatch){
		let cart_id = localStorage.getItem('cart_id')
		params['cart_id'] = cart_id
		return requestApi({
			method : 'POST',
			path : '/cart/update',
			data : params
		}).then(res => {
			let response = res.data
			let cart = response.data
			if (response.type == "success") {
				dispatch({type: action.SET_CART, data: cart})
				return response
			}
		})
	}
}

export function getCheckoutDetails(params={}) {
	return function(dispatch) {
		return requestApi({
			method : 'POST',
			path : '/cart/checkout',
			data : params
		})
	}
}

export function placeOrder(params={}) {
	return function(dispatch) {
		return requestApi({
			method : 'POST',
			path : '/orders/place-order',
			data : params
		})
	}
}

export function getAddresses(params={}) {
	return function(dispatch) {
		return requestApi({
			method : 'GET',
			path : '/addresses/',
			data : params
		})
	}
}

export function addAddress(params={}) {
	return function(dispatch) {
		return requestApi({
			method : 'POST',
			path : '/checkout/address/create/',
			data : params
		})
	}
}

export function applyCoupon(params={}) {
	return function(dispatch) {
		let cart_id = localStorage.getItem('cart_id')
		params['cart_id'] = cart_id
		return requestApi({
			method : 'POST',
			path : '/coupon/',
			data : params
		})
		.then(res => {
			let response = res.data
			let cart = response.data
			if (response.type == "success") {
				dispatch({type: action.SET_CART, data: cart})
			}
			return response
		})
	}
}

export function checkout(params={}) {
	return function(dispatch) {
		dispatch({type: action.CHECKOUT})
	}
}

export function fetchNotifications(params={}) {
	return function(dispatch) {
		return requestApi({
			method : 'GET',
			path : '/notifications',
			data : params
		})
	}
}

export function setNotifications(notifications) {
	return function(dispatch) {
		dispatch({type: action.SET_NOTIFICATIONS, data: notifications})
	}
}

export function logIn(params = {}) {
	return function(dispatch){
		let headers = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
		return requestApi({
			method : 'POST',
			path : '/login',
			data : params,
			headers: headers
		})
			.then(response => {
				if (response.data.type == "success") {
					localStorage.setItem("token", response.data.data.token)
					dispatch({type: action.LOG_IN, data: response.data.token})
				}
				return response
			})
	}
}

export function logOut(params = {}) {
	return function(dispatch){
		dispatch({type: action.LOG_OUT})
	}
}

export function signUserUp(params = {}) {
	return function(dispatch){
		let headers = {
			"Content-Type": "application/json",
			"Accept": "application/json"
		}
		return requestApi({
			method : 'POST',
			path : '/register',
			data : params,
			headers: headers
		})
	}
}

export function autoLogin() {
	return function(dispatch){
		if (localStorage.getItem("token")) {
			dispatch({type: action.LOG_IN, data: ""})
		}
	}
}
