import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Loading from '../app/loader'
import TrimString from '../app/trimstring'
import ItemQuantity from './item-quantity'

const ORDER_ITEM_ACTION = {
	'ADD': 1,
	'REMOVE': 2
}

const LABEL = {
	'bestseller': "Best Seller",
	'new': "New"
}

class ProductCard extends React.Component {
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
	}

	addProductToCart = (product_id) => {
		this.updateCart(product_id, ORDER_ITEM_ACTION["ADD"])
	}

	render() {
		const { loading } = this.state
		const { cart, product } = this.props
		let cartItems = (cart && cart.toJS().items) || []
		let item = cartItems.find(obj => obj.product.id === product.id)
		let imageSrc = `http://localhost:8000${product.image}`
		let label = product.label && LABEL[product.label]
		let main_price, sub_price
		if (product.discount_price) {
			main_price = product.discount_price
			sub_price = product.price
		} else {
			main_price = product.price
		}
		return (<div className="col-md-4" key={product.id}>
			{label && <div className="product-label">{label}</div>}
			<div className="product-card rounded mb-20 text-center">
				<img src={imageSrc} className="product-image" alt="No Image Available" />
				<p className="product-title"><TrimString string={product.title} /></p>
				<div className="product-price">
					<span className="mr-20"><b className="font18">{main_price}</b><strike className="font14 ml-05">{sub_price}</strike></span>
					{ item ? <ItemQuantity item={item}/> : <button className="btn btn-primary product-add" onClick={()=>{this.addProductToCart(product.id)}}>
						{ loading ? <span className="mdi mdi-circle-outline mdi-spin" ></span> : <span className="mdi mdi-cart-plus"></span>}
					</button>}
				</div>
			</div>
		</div>)
	}
}

ProductCard.propTypes = {
	actions: PropTypes.object
}

const ProductCardWithRouter = withRouter(ProductCard)

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProductCardWithRouter)
