import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { Link } from 'react-router-dom'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'

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
		console.log("C", isLoggedIn)
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.getCart()
			.then(res => {
				this.setState({
					isCartEmpty: (res.data.products.length === 0),
					// error: res.data.errorMessage && <Error message={res.data.errorMessage}/>,
					loading: false })
			})
			.catch(() => {
				// this.setState({loading:false, error:<Error message="Failed to load sites. Please refresh this page or Contact us."/>})
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
		let cartItems = cart.toJS().products
		let rows = []
		cartItems.forEach((item, index) => {
			rows.push(<tr className='cart-product' key={index}>
					<th className="text-center" scope="row">{ index+1 }.</th>
					<td>
						<a className="product-name" href="{{ product.get_absolute_url }}">{ item.title }</a>
						<button className="remove mr-30" onClick={()=>{this.removeProductFromCart(item.id)}}>Remove</button>
					</td>
					<td>{ item.price }</td>
			</tr>)
		})
		return rows
	}

	displayCart() {
		const { cart } = this.props
		let subtotal = cart.toJS().subtotal
		let total = cart.toJS().total
		return (<div className="cart-container w-100">
			<table className="table cart-table">
				<thead>
					<tr>
						<th className="text-center" scope="col">#</th>
						<th scope="col">Product Name</th>
						<th className="price" scope="col">Price</th>
					</tr>
				</thead>
				<tbody className='cart-body'>
					{ this.displayCartItems() }
					<tr>
						<td colSpan={2}><div className="float-right mr-30"><b>Subtotal:</b></div></td>
						<td className='cart-total'>{ subtotal }</td>
					</tr>
					<tr>
						<td colSpan={2}><div className="float-right mr-30"><b>Total:</b></div></td>
						<td className='cart-total'>{ total }</td>
					</tr>
					<tr>
						<td colSpan={2}>
							<div className="float-right">
								<Link className="btn btn-success" to="/checkout">Checkout</Link>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>)
	}

	render() {
		const { loading, isCartEmpty } = this.state
		return (
			<div className="container">
				{ loading ? <Loading /> : <div className="row my-2">
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