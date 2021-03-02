import * as actionName from "./actions"
import url from 'url'
import Immutable from 'immutable'

function initialState() {
	let query = url.parse(window.location.href, true).query
	return Immutable.fromJS({
		"notifications": {
			"modals": {
				persistent: [],
				momentary: []
			},
			"bells": {
				persistent: [],
				total: 0
			},
			"unread": 0,
			"transient_messages": [],
			"limit": 20,
			"last_checked_id": 0
		},
		"limit": 25,
		"cache":{},
		"lastRefreshedInfosAt": null,
		cart: {},
		isLoggedIn: false,
		user: {}
	})
}

function mapToState(currentState, newState) {
	newState.forEach((item) => {
		let index = currentState.findIndex((_item) => {
			return _item.get('id') === item.get('id') 
		})
		if (index === -1) {
			currentState = currentState.push(item)
		} else {
			currentState = currentState.update(index, () => {
				return currentState.get(index).merge(item)
			})
		}
	})
	return currentState
}

export default function(state = initialState(), action) {
	action = Immutable.fromJS(action)
	switch (action.get('type')) {
		case actionName.CHECKOUT:
			localStorage.removeItem("cart_id")
			return Object.assign({}, state, {
				cart: []
			})
		case actionName.LOG_IN:
			return Object.assign({}, state, {
				isLoggedIn: true
			})
		case actionName.LOG_OUT:
			localStorage.clear()
			return Object.assign({}, state, {
				isLoggedIn: false,
				user: {}
			})
		case actionName.SET_CART:
			let cart = action.getIn(['data'])
			let cart_id = action.getIn(['data', 'id'])
			localStorage.setItem("cart_id", cart_id)
			// return Object.assign({}, state, {
			// 	cart: cart,
			// })
			return { ...state, cart: cart };
		case actionName.SET_NOTIFICATIONS:
			let notifications = action.getIn(['data'])
			return Object.assign({}, state, {
				notifications: notifications
			})
		default: {
			return state
		}
	}
}
