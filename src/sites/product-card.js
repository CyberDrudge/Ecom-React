import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Loading from '../app/loader'

class ProductCard extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: false}
		this.addProductToCart = this.addProductToCart.bind(this)
	}

	addProductToCart(product_id) {
		const { actions } = this.props
		const { loading } = this.state
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		// { isProductIncart ? "Remove" : "Add"}
		actions.addProductToCart({product_id: product_id})
			.then(res => {
				this.setState({loading: false})
			})
	}

	render() {
		const { loading } = this.state
		const { cart, product } = this.props
		let cartItems = (cart && cart.toJS().products) || []
		let isProductIncart = cartItems.find(obj => obj.title === product.title);
		return (<div className="col">
			<div className="product-card rounded my-1">
				<div className="card-body rounded">
					<h5 className="card-title"> { product.title } </h5>
					
					<p className="card-text"> { product.description } </p>
					<button className="btn btn-success" onClick={()=>{this.addProductToCart(product.id)}}>	
						{ loading ? <span className="mdi mdi-circle-outline mdi-spin" ></span> : <span>
							{ isProductIncart ? "Remove" : "Add"}
						</span> }
					</button>
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