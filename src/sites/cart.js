import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'
import Coupon from './coupon'
import TrimString from '../app/trimstring'
import OrderPriceSummary from './order-price-summary'
import ItemQuantity from './item-quantity'

class Cart extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, isCartEmpty: true}
		this.loadCart = this.loadCart.bind(this)
	}

	componentDidMount() {
		this.loadCart()
	}

	loadCart() {
		const { loading } = this.state
		const { actions, isLoggedIn } = this.props
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.getCart()
			.then(res => {
				this.setState({ isCartEmpty: (res.data.products.length === 0), loading: false })
			})
			.catch(() => {
				this.setState({loading:false})
			})
	}

	removeProductFromCart(product_id) {
		const { actions } = this.props
		const { loading } = this.state
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.addProductToCart({product_id: product_id})
			.then(res => {
				this.setState({loading: false})
			})
	}

	displayEmptyCart() {
		return (<div>
			<div className="cart-empty">OOOPSSS ...... Looks like your cart is empty</div>
		</div>)
	}

	displayCartItems() {
		const { cart } = this.props
		const { loading } = this.state
		let cartItems = cart.toJS().items
		let rows = []
		cartItems.forEach((item, index) => {
			rows.push(<tr className='cart-product' key={index}>
				<th className="text-center" scope="row">{ index+1 }.</th>
				<td className="align-left">
					<a className="product-name" href="{{ product.get_absolute_url }}"><TrimString string={item.product.title} length={57}/></a>
				</td>
				<td className="pr-20">
					<ItemQuantity item={item}/>
				</td>
				<td>{ item.quantity * item.product.price }</td>
			</tr>)
		})
		return rows
	}

	displayCart() {
		const { cart, actions } = this.props
		let subtotal = cart.toJS().subtotal
		let total = cart.toJS().total
		let deliveryCharge = cart.toJS().delivery_charge
		return (<div className="row cart-container w-100">
			<div className="ml-20">
			    <h4 class="d-flex justify-content-between align-items-center mb-3">
				    <span class="text-muted">Your Cart</span>
			    </h4>
		    </div>
			<div className="col-sm-12">
				<table className="table cart-table">
					<thead>
						<tr>
							<th className="text-center" scope="col">#</th>
							<th scope="col">Product Name</th>
							<th className="price" scope="col">Quantity</th>
							<th className="price" scope="col">Price</th>
						</tr>
					</thead>
					<tbody className='cart-body'>
						{ this.displayCartItems() }
						<tr>
							<td colSpan={3}><div className="float-right pr-20"><b>Subtotal:</b></div></td>
							<td className='cart-total'>{ subtotal }</td>
						</tr>
						<tr>
							<td>{ deliveryCharge === 0 && <div className="free-delivery-label">Free Delivery</div> }</td>
							<td colSpan={2}><div className="float-right pr-20"><b> + Delivery Charge:</b></div></td>
							<td className='cart-total'>{ deliveryCharge }</td>
						</tr>
						<tr>
							<td colSpan={3}><div className="float-right pr-20"><b>Total:</b></div></td>
							<td className='cart-total'>{ total }</td>
						</tr>
						<tr>
							<td colSpan={3}>
								<div className="float-right">
									<Link className="btn btn-success" to="/checkout">Checkout</Link>
								</div>
							</td>
							<td></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>)
	}

	render() {
		const { loading, isCartEmpty } = this.state
		return (
			<div className="container">
				{ loading ? <Loading /> : <div className="my-2">
					{ !isCartEmpty ? this.displayCart() : this.displayEmptyCart() }
				</div> }
			</div>
		)
	}
}

Cart.propTypes = {
	cart: PropTypes.object
}

const CartWithRouter = withRouter(Cart)

const mapStateToProps = (state) => {
	return {
		cart: state.cart,
		isLoggedIn: state.isLoggedIn
	}
}

const mapDispatchToProps = (dispatch) => {
	return {actions: bindActionCreators(actionCreators, dispatch)}
}

const mergeProps = (stateProps, dispatchProps, ownProps) => {
	return Object.assign({}, ownProps, stateProps, dispatchProps)
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(CartWithRouter)