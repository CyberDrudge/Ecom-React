import { request } from 'axios'
import * as action from "./actions"


const requestApi = (params) => {
	// let token = ""
	// let element = document.getElementsByName("csrf-token")[0]
	// if (element) {
	// 	token = element.content
	// }
	const urlRoot = (params.urlRoot || "http://localhost:8000")
	const method = params.method
	const url = `${urlRoot}${params.path}`
	const responseType = (params.responseType || 'json')

	const requestParams = { method, url, responseType }

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

export function addProductToCart(params={}) {
	return function(dispatch){
		let cart_id = localStorage.getItem('cart_id')
		params['cart_id'] = cart_id
		return requestApi({
			method : 'POST',
			path   : '/cart/update',
			data  : params
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

export function logIn(params = {}) {
	return function(dispatch){
		return fetch(`http://localhost:8000/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Accept": "application/json"
			},
			body: JSON.stringify(params)
		})
			.then(res => res.json())
			.then(response => {
				if (response.type == "success") {
					localStorage.setItem("token", response.data.token)
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

export const signUserUp = (userInfo) => dispatch => {
	fetch(`http://localhost:4000/users`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json"
		},
		body: JSON.stringify(userInfo)
	})
		.then(res => res.json())
		.then(data => {
			localStorage.setItem("token", data.token)
			dispatch({type: action.LOG_IN, data: ""})
		})
}

export function autoLogin() {
	return function(dispatch){
		if (localStorage.getItem("token")) {
			dispatch({type: action.LOG_IN, data: ""})
		}
	}
}
