import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Loading from '../app/loader'
import TrimString from '../app/trimstring'

const ORDER_ITEM_ACTION = {
	'ADD': 1,
	'REMOVE': 2
}

class ItemQuantity extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false}
	}

	updateCart = (product_id, action) => {
		const { actions } = this.props
		const { loading } = this.state
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.updateCart({product_id: product_id, action: action})
			.then(res => {
				this.setState({loading: false})
			})
			.catch(() => {
				this.setState({loading: false})
			})
	}

	addProductToCart = (product_id) => {
		this.updateCart(product_id, ORDER_ITEM_ACTION["ADD"])
	}

	removeProductFromCart = (product_id) => {
		this.updateCart(product_id, ORDER_ITEM_ACTION["REMOVE"])
	}

	render() {
		const { loading } = this.state
		const { item } = this.props
		return (<div className="product-quantity-counter">
			<button className="btn btn-primary product-add" onClick={()=>{this.removeProductFromCart(item.product.id)}}>	
				{ loading ? <span className="mdi mdi-circle-outline mdi-spin" ></span> : <span className="mdi mdi-minus"></span>}
			</button>
			<span>{item.quantity}</span>
			<button className="btn btn-primary product-add" onClick={()=>{this.addProductToCart(item.product.id)}}>	
				{ loading ? <span className="mdi mdi-circle-outline mdi-spin" ></span> : <span className="mdi mdi-plus"></span>}
			</button>
		</div>)
	}
}

ItemQuantity.propTypes = {
	actions: PropTypes.object
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

export default connect(null, mapDispatchToProps)(ItemQuantity)
