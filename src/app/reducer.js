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
		case actionName.LOG_IN:
			return {
				isLoggedIn: true,
				user: {...action.payload}
			}
		case actionName.LOG_OUT:
			localStorage.clear()
			return {
				isLoggedIn: false,
				user: {}
			}
		case actionName.SET_CART:
			let cart = action.getIn(['data'])
			let cart_id = action.getIn(['data', 'id'])
			localStorage.setItem("cart_id", cart_id)
			return {
				cart: cart
			}
		default: {
			return state
		}
	}
}
