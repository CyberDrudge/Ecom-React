import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from './../app/actioncreators'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import Loading from './loader'
import Error from './error'
import ProductCard from '../sites/product-card'

class ProductList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, products: []}
		this.loadProductList = this.loadProductList.bind(this)
	}
	componentDidMount() {
		this.loadProductList()
	}

	loadProductList() {
		const { loading } = this.state
		const { actions } = this.props
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		actions.getProductList()
			.then(res => {
				let products = res.data.data
				this.setState({
					products: products,
					count: res.data.count,
					// error: res.data.errorMessage && <Error message={res.data.errorMessage}/>,
					loading: false })
			})
			.catch(() => {
				this.setState({loading:false, error:<Error />})
			})
	}

	products() {
		const { products } = this.state
		const { cart } = this.props
		let cartItems = (cart && cart.toJS().products) || []
		let productList = []
		products.forEach((product, index) => {
			productList.push(<ProductCard product={product} addProductToCart={this.addProductToCart} key={index}/>)
		})
		return productList
	}
	render() {
		const { loading, error } = this.state
		return (
			<div>
			{ loading && <Loading /> }
			{ error }
			<div className="container">
				<div className="row my-2">
					{!loading ? this.products() : null}
				</div>
			</div>
		</div>
		)
	}
}

ProductList.propTypes = {
	actions: PropTypes.object
}

const ProductListWithRouter = withRouter(ProductList)

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

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(ProductListWithRouter)