import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import * as actionCreators from './../app/actioncreators'
import Loading from '../app/loader'
import Error from '../app/error'
import ProductCard from './product-card'

const PER_PAGE = 12
const LIMIT = 12
	
class ProductList extends React.Component {
	constructor(props) {
		super(props)
		this.state = {loading: true, offset: 0, currentPage: 0, last_id: "", products: []}
		this.loadProductList = this.loadProductList.bind(this)
		this.handlePageClick = this.handlePageClick.bind(this)
	}
	componentDidMount() {
		this.loadProductList()
	}

	loadProductList() {
		const { loading, last_id  } = this.state
		const { actions, match } = this.props
		let page = parseInt(match.params.currentpage || 1) - 1
		if (!loading) {
			this.setState({loading: true, response: false})
		}
		Promise.all([
            actions.getProductList({offset: page, limit: LIMIT, last_id: last_id}),
            actions.getCart()
        ]).then(([res_getProductList, res_getCart]) => {
			let products = res_getProductList.data.data
			let fetch_id = res_getProductList.data.data.length ? res_getProductList.data.data[0].id : last_id
			this.setState({
				products: products,
				count: res_getProductList.data.count,
				// error: res.data.errorMessage && <Error message={res.data.errorMessage}/>,
				loading: false, last_id: fetch_id
			})
        }).catch(res => {
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

	handlePageClick(data) {
		const { history } = this.props
		let nextPage = parseInt(data.selected) + 1
		history.push({
			pathname: `/products/${nextPage}`
		})
	}

	render() {
		const { loading, error, products } = this.state
		const { match } = this.props
		let pageCount = Math.ceil(products.length / PER_PAGE)
		let currentpage = parseInt(match.params.currentpage || 1) - 1
		return (
			<div>
			{ loading && <Loading /> }
			{ error }
			<div className="container">
				<div className="row my-2">
					{!loading ? this.products(): null}
				</div>
				<ReactPaginate
					previousLabel={"←"}
					nextLabel={"→"}
					breakLabel={<a>...</a>}
					pageCount={1}
					onPageChange={this.handlePageClick}
					marginPagesDisplayed={2}
					pageRangeDisplayed={5}
					containerClassName={"custom-pagination"}
					activeClassName={"active"}
					forcePage={currentpage}
				/>
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